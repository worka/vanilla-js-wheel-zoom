import { on, off, eventClientX, eventClientY, isTouch, transform, transition } from './toolkit';
import { dragScrollableDefaultOptions } from './default-options';

class DragScrollable {
    /**
     * @param {WZoomViewport} viewport
     * @param {WZoomContent} content
     * @param {DragScrollableOptions} options
     * @constructor
     */
    constructor(viewport, content, options = {}) {
        this._dropHandler = this._dropHandler.bind(this);
        this._grabHandler = this._grabHandler.bind(this);
        this._moveHandler = this._moveHandler.bind(this);

        /** @type {WZoomViewport} */
        this.viewport = viewport;
        /** @type {WZoomContent} */
        this.content = content;

        /** @type {DragScrollableOptions} */
        this.options = Object.assign({}, dragScrollableDefaultOptions, options);

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

        if (this.isTouch) {
            // @todo rename option
            this.options.smoothExtinction = 0;
        }

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
     * @param {Event|TouchEvent|MouseEvent} event
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
     * @param {Event|TouchEvent} event
     * @private
     */
    _moveHandler(event) {
        // so that it does not move when the touch screen and more than one finger
        if (this.isTouch && event.touches.length > 1) return false;

        event.preventDefault();

        const { viewport, content, coordinatesShift, coordinates, options } = this;

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

        let maxAvailableLeft = (content.currentWidth - viewport.originalWidth) / 2 + content.correctX;
        let maxAvailableTop = (content.currentHeight - viewport.originalHeight) / 2 + content.correctY;

        // if we do not go beyond the permissible boundaries of the viewport
        if (Math.abs(contentNewLeft) <= maxAvailableLeft) content.currentLeft = contentNewLeft;

        // if we do not go beyond the permissible boundaries of the viewport
        if (Math.abs(contentNewTop) <= maxAvailableTop) content.currentTop = contentNewTop;

        transition(content.$element, this.options.smoothExtinction);
        transform(content.$element, content.currentLeft, content.currentTop, content.currentScale);

        if (typeof options.onMove === 'function') {
            options.onMove(event);
        }
    }
}

export default DragScrollable;
