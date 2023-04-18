import { on, off, eventClientX, eventClientY, isTouch } from '../toolkit';
import AbstractObserver from './AbstractObserver';

export const EVENT_GRAB = 'grab';
export const EVENT_MOVE = 'move';
export const EVENT_DROP = 'drop';

class DragScrollableObserver extends AbstractObserver {
    /**
     * @param {HTMLElement} target
     * @constructor
     */
    constructor(target) {
        super();

        this.target = target;

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

        this._dropHandler = this._dropHandler.bind(this);
        this._grabHandler = this._grabHandler.bind(this);
        this._moveHandler = this._moveHandler.bind(this);

        on(this.target, this.events.grab, this._grabHandler, this.events.options);
    }

    destroy() {
        off(this.target, this.events.grab, this._grabHandler, this.events.options);

        super.destroy();
    }

    /**
     * @param {Event|TouchEvent|MouseEvent} event
     * @private
     */
    _grabHandler(event) {
        // if touch started (only one finger) or pressed left mouse button
        if ((this.isTouch && event.touches.length === 1) || event.buttons === 1) {
            this.coordinates = { x: eventClientX(event), y: eventClientY(event) };
            this.coordinatesShift = { x: 0, y: 0 };

            on(document, this.events.drop, this._dropHandler, this.events.options);
            on(document, this.events.move, this._moveHandler, this.events.options);

            this._run(EVENT_GRAB, event);
        }
    }

    /**
     * @param {Event} event
     * @private
     */
    _dropHandler(event) {
        off(document, this.events.drop, this._dropHandler);
        off(document, this.events.move, this._moveHandler);

        this._run(EVENT_DROP, event);
    }

    /**
     * @param {Event|TouchEvent} event
     * @private
     */
    _moveHandler(event) {
        // so that it does not move when the touch screen and more than one finger
        if (this.isTouch && event.touches.length > 1) return false;

        const { coordinatesShift, coordinates } = this;

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

        event.data = { ...event.data || {}, x: coordinatesShift.x, y: coordinatesShift.y };

        this._run(EVENT_MOVE, event);
    }
}

export default DragScrollableObserver;
