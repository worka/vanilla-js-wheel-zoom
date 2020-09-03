import { extendObject, on, off, numberExtinction, eventClientX, eventClientY, isTouch } from './toolkit';

/**
 * @class DragScrollable
 * @param {Object} windowObject
 * @param {Object} contentObject
 * @param {Object} options
 * @constructor
 */
function DragScrollable(windowObject, contentObject, options = {}) {
    this._dropHandler = this._dropHandler.bind(this);
    this._grabHandler = this._grabHandler.bind(this);
    this._moveHandler = this._moveHandler.bind(this);

    this.options = extendObject({
        // smooth extinction moving element after set loose
        smoothExtinction: false,
        // callback triggered when grabbing an element
        onGrab: null,
        // callback triggered when moving an element
        onMove: null,
        // callback triggered when dropping an element
        onDrop: null
    }, options);

    // check if we're using a touch screen
    this.isTouch = isTouch();
    // switch to touch events if using a touch screen
    this.events = this.isTouch ?
        { grab: 'touchstart', move: 'touchmove', drop: 'touchend' } :
        { grab: 'mousedown', move: 'mousemove', drop: 'mouseup' };
    // if using touch screen tells the browser that the default action will not be undone
    this.events.options = this.isTouch ? { passive: true } : false;

    this.window = windowObject;
    this.content = contentObject;

    on(this.content.$element, this.events.grab, this._grabHandler, this.events.options);
}

DragScrollable.prototype = {
    constructor: DragScrollable,
    window: null,
    content: null,
    isTouch: false,
    isGrab: false,
    events: null,
    moveTimer: null,
    options: {},
    coordinates: null,
    speed: null,
    _grabHandler(event) {
        // if touch started (only one finger) or pressed left mouse button
        if ((this.isTouch && event.touches.length === 1) || event.buttons === 1) {
            if (!this.isTouch) event.preventDefault();

            this.isGrab = true;
            this.coordinates = { left: eventClientX(event), top: eventClientY(event) };
            this.speed = { x: 0, y: 0 };

            on(document, this.events.drop, this._dropHandler, this.events.options);
            on(document, this.events.move, this._moveHandler, this.events.options);

            if (typeof this.options.onGrab === 'function') {
                this.options.onGrab();
            }
        }
    },
    _dropHandler(event) {
        if (!this.isTouch) event.preventDefault();

        this.isGrab = false;

        // if (this.options.smoothExtinction) {
        //     _moveExtinction.call(this, 'scrollLeft', numberExtinction(this.speed.x));
        //     _moveExtinction.call(this, 'scrollTop', numberExtinction(this.speed.y));
        // }

        off(document, this.events.drop, this._dropHandler);
        off(document, this.events.move, this._moveHandler);

        if (typeof this.options.onDrop === 'function') {
            this.options.onDrop();
        }
    },
    _moveHandler(event) {
        if (!this.isTouch) event.preventDefault();

        const { window, content, speed, coordinates, options } = this;

        // speed of change of the coordinate of the mouse cursor along the X/Y axis
        speed.x = eventClientX(event) - coordinates.left;
        speed.y = eventClientY(event) - coordinates.top;

        clearTimeout(this.moveTimer);

        // reset speed data if cursor stops
        this.moveTimer = setTimeout(() => {
            speed.x = 0;
            speed.y = 0;
        }, 50);

        const contentNewLeft = content.currentLeft + speed.x;
        const contentNewTop = content.currentTop + speed.y;

        let maxAvailableLeft = (content.currentWidth - window.originalWidth) / 2 + content.correctX;
        let maxAvailableTop = (content.currentHeight - window.originalHeight) / 2 + content.correctY;

        // if we do not go beyond the permissible boundaries of the window
        if (Math.abs(contentNewLeft) <= maxAvailableLeft) content.currentLeft = contentNewLeft;

        // if we do not go beyond the permissible boundaries of the window
        if (Math.abs(contentNewTop) <= maxAvailableTop) content.currentTop = contentNewTop;

        _transform(content.$element, {
            left: content.currentLeft,
            top: content.currentTop,
            scale: content.currentScale
        });

        coordinates.left = eventClientX(event);
        coordinates.top = eventClientY(event);

        if (typeof options.onMove === 'function') {
            options.onMove();
        }
    },
    destroy() {
        off(this.content.$element, this.events.grab, this._grabHandler, this.events.options);

        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                this[key] = null;
            }
        }
    }
};

function _transform($element, { left, top, scale }) {
    $element.style.transform = `translate3d(${ left }px, ${ top }px, 0px) scale(${ scale })`;
}

// function _moveExtinction(field, speedArray) {
//     // !this.isGrab - stop moving if there was a new grab
//     if (!this.isGrab && speedArray.length) {
//         this.content.$element[field] = this.content.$element[field] - speedArray.shift();
//
//         if (speedArray.length) {
//             window.requestAnimationFrame(_moveExtinction.bind(this, field, speedArray));
//         }
//     }
// }

export default DragScrollable;
