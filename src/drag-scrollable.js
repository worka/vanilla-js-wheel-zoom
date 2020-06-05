import {
    extendObject,
    on,
    off,
    numberExtinction,
    eventClientX,
    eventClientY,
    isTouch,
    getElementTransform
} from './toolkit';

/**
 * @class DragScrollable
 * @param {Element} $window
 * @param {Element} $content
 * @param {Object} options
 * @constructor
 */
function DragScrollable($window, $content, options = {}) {
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

    this.$window = $window;
    this.$content = $content;

    on(this.$content, this.events.grab, event => {
        // if touch started (only one finger) or pressed left mouse button
        if ((this.isTouch && event.touches.length === 1) || event.buttons === 1) {
            this._grabHandler(event);
        }
    }, this.events.options);
}

DragScrollable.prototype = {
    constructor: DragScrollable,
    $window: null,
    $content: null,
    isTouch: false,
    isGrab: false,
    events: null,
    moveTimer: null,
    options: {},
    coordinates: null,
    speed: null,
    _grabHandler(event) {
        if (!this.isTouch) event.preventDefault();

        this.isGrab = true;
        this.coordinates = { left: eventClientX(event), top: eventClientY(event) };
        this.speed = { x: 0, y: 0 };

        on(document, this.events.drop, this._dropHandler, this.events.options);
        on(document, this.events.move, this._moveHandler, this.events.options);

        if (typeof this.options.onGrab === 'function') {
            this.options.onGrab();
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

        // speed of change of the coordinate of the mouse cursor along the X/Y axis
        this.speed.x = eventClientX(event) - this.coordinates.left;
        this.speed.y = eventClientY(event) - this.coordinates.top;

        clearTimeout(this.moveTimer);

        // reset speed data if cursor stops
        this.moveTimer = setTimeout((function () {
            this.speed = { x: 0, y: 0 };
        }).bind(this), 50);

        const transformParams = getElementTransform(this.$content);

        if (transformParams.left || transformParams.top) {
            const contentNewLeft = transformParams.left + this.speed.x;
            const contentNewTop = transformParams.top + this.speed.y;

            this._transform(contentNewLeft, contentNewTop, transformParams.scale);
        }

        // this.scrollable.scrollLeft = this.scrollable.scrollLeft - this.speed.x;
        // this.scrollable.scrollTop = this.scrollable.scrollTop - this.speed.y;

        this.coordinates = { left: eventClientX(event), top: eventClientY(event) };

        if (typeof this.options.onMove === 'function') {
            this.options.onMove();
        }
    },
    _transform(left, top, scale) {
        this.$content.style.transform = `translate3d(${ left }px, ${ top }px, 0px) scale(${ scale })`;
    }
};

function _moveExtinction(field, speedArray) {
    // !this.isGrab - stop moving if there was a new grab
    if (!this.isGrab && speedArray.length) {
        this.$content[field] = this.$content[field] - speedArray.shift();

        if (speedArray.length) {
            window.requestAnimationFrame(_moveExtinction.bind(this, field, speedArray));
        }
    }
}

export default DragScrollable;
