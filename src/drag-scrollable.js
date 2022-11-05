import { extendObject, on, off, eventClientX, eventClientY, isTouch } from './toolkit';
import { dragScrollableDefaultOptions } from './default-options';

class DragScrollable {
    /**
     * @param {WZoomWindow} windowObject
     * @param {WZoomContent} contentObject
     * @param {DragScrollableOptions} options
     * @constructor
     */
    constructor(windowObject, contentObject, options = {}) {
        this._dropHandler = this._dropHandler.bind(this);
        this._grabHandler = this._grabHandler.bind(this);
        this._moveHandler = this._moveHandler.bind(this);

        /** @type {WZoomWindow} */
        this.window = windowObject;
        /** @type {WZoomContent} */
        this.content = contentObject;

        /** @type {DragScrollableOptions} */
        this.options = extendObject(dragScrollableDefaultOptions, options);

        this.isGrab = false;
        this.moveTimer = null;
        this.coordinates = null;
        this.coordinatesShift = null;

        // check if we're using a touch screen
        this.isTouch = isTouch();
        // switch to touch events if using a touch screen
        this.events = this.isTouch
            ? { grab: 'touchstart', move: 'touchmove', drop: 'touchend' }
            : { grab: 'mousedown', move: 'mousemove', drop: 'mouseup' };
        // for the touch screen we set the parameter forcibly
        this.events.options = this.isTouch ? { passive: false } : false;

        on(this.content.$element, this.events.grab, this._grabHandler, this.events.options);
    }

    destroy() {
        off(this.content.$element, this.events.grab, this._grabHandler, this.events.options);

        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                this[key] = null;
            }
        }
    }

    /**
     * @param {Event} event
     * @private
     */
    _grabHandler(event) {
        // if touch started (only one finger) or pressed left mouse button
        if ((this.isTouch && event.touches.length === 1) || event.buttons === 1) {
            event.preventDefault();

            this.isGrab = true;
            this.coordinates = { x: eventClientX(event), y: eventClientY(event) };
            this.coordinatesShift = { x: 0, y: 0 };

            on(document, this.events.drop, this._dropHandler, this.events.options);
            on(document, this.events.move, this._moveHandler, this.events.options);

            if (typeof this.options.onGrab === 'function') {
                this.options.onGrab(event);
            }
        }
    }

    /**
     * @param {Event} event
     * @private
     */
    _dropHandler(event) {
        event.preventDefault();

        this.isGrab = false;

        off(document, this.events.drop, this._dropHandler);
        off(document, this.events.move, this._moveHandler);

        if (typeof this.options.onDrop === 'function') {
            this.options.onDrop(event);
        }
    }

    /**
     * @param {Event} event
     * @returns {boolean}
     * @private
     */
    _moveHandler(event) {
        // so that it does not move when the touch screen and more than one finger
        if (this.isTouch && event.touches.length > 1) return false;

        event.preventDefault();

        const { window, content, coordinatesShift, coordinates, options } = this;

        // change of the coordinate of the mouse cursor along the X/Y axis
        coordinatesShift.x = eventClientX(event) - coordinates.x;
        coordinatesShift.y = eventClientY(event) - coordinates.y;

        coordinates.x = eventClientX(event);
        coordinates.y = eventClientY(event);

        clearTimeout(this.moveTimer);

        // reset shift if cursor stops
        this.moveTimer = setTimeout(() => {
            coordinatesShift.x = 0;
            coordinatesShift.y = 0;
        }, 50);

        const contentNewLeft = content.currentLeft + coordinatesShift.x;
        const contentNewTop = content.currentTop + coordinatesShift.y;

        let maxAvailableLeft = (content.currentWidth - window.originalWidth) / 2 + content.correctX;
        let maxAvailableTop = (content.currentHeight - window.originalHeight) / 2 + content.correctY;

        // if we do not go beyond the permissible boundaries of the window
        if (Math.abs(contentNewLeft) <= maxAvailableLeft) content.currentLeft = contentNewLeft;

        // if we do not go beyond the permissible boundaries of the window
        if (Math.abs(contentNewTop) <= maxAvailableTop) content.currentTop = contentNewTop;

        transform(content.$element, {
            left: content.currentLeft,
            top: content.currentTop,
            scale: content.currentScale,
        }, this.options);

        if (typeof options.onMove === 'function') {
            options.onMove(event);
        }
    }
}

function transform($element, { left, top, scale }, options) {
    if (options.smoothExtinction) {
        $element.style.transition = `transform ${ options.smoothExtinction }s`;
    } else {
        $element.style.removeProperty('transition');
    }

    $element.style.transform = `translate3d(${ left }px, ${ top }px, 0px) scale(${ scale })`;
}

export default DragScrollable;
