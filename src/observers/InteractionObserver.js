import { eventClientX, eventClientY, isTouch, off, on } from '../toolkit';
import AbstractObserver from './AbstractObserver';

export const EVENT_CLICK = 'click';
export const EVENT_DBLCLICK = 'dblclick';
export const EVENT_WHEEL = 'wheel';

class InteractionObserver extends AbstractObserver {
    /**
     * @param {HTMLElement} target
     * @constructor
     */
    constructor(target) {
        super();

        this.target = target;

        this.coordsOnDown = null;
        this.pressingTimeout = null;
        this.firstClick = true;

        // check if we're using a touch screen
        this.isTouch = isTouch();
        // switch to touch events if using a touch screen
        this.events = this.isTouch
            ? { down: 'touchstart', up: 'touchend' }
            : { down: 'mousedown', up: 'mouseup' };
        // if using touch screen tells the browser that the default action will not be undone
        this.events.options = this.isTouch ? { passive: true } : false;

        this._downHandler = this._downHandler.bind(this);
        this._upHandler = this._upHandler.bind(this);
        this._wheelHandler = this._wheelHandler.bind(this);

        on(this.target, this.events.down, this._downHandler, this.events.options);
        on(this.target, this.events.up, this._upHandler, this.events.options);
        on(this.target, EVENT_WHEEL, this._wheelHandler);
    }

    destroy() {
        off(this.target, this.events.down, this._downHandler, this.events.options);
        off(this.target, this.events.up, this._upHandler, this.events.options);
        off(this.target, EVENT_WHEEL, this._wheelHandler, this.events.options);

        super.destroy();
    }

    /**
     * @param {TouchEvent|MouseEvent|PointerEvent} event
     * @private
     */
    _downHandler(event) {
        this.coordsOnDown = null;

        if ((this.isTouch && event.touches.length === 1) || event.buttons === 1) {
            this.coordsOnDown = { x: eventClientX(event), y: eventClientY(event) };
        }

        clearTimeout(this.pressingTimeout);
    }

    /**
     * @param {TouchEvent|MouseEvent|PointerEvent} event
     * @private
     */
    _upHandler(event) {
        const delay = this.subscribes[EVENT_DBLCLICK] ? 200 : 0;

        if (this.firstClick) {
            this.pressingTimeout = setTimeout(() => {
                if (this.coordsOnDown &&
                    this.coordsOnDown.x === eventClientX(event) &&
                    this.coordsOnDown.y === eventClientY(event)
                ) {
                    this._run(EVENT_CLICK, event);
                }

                this.firstClick = true;
            }, delay);

            this.firstClick = false;
        } else {
            this.pressingTimeout = setTimeout(() => {
                this._run(EVENT_DBLCLICK, event);

                this.firstClick = true;
            }, delay / 2);
        }
    }

    /**
     * @param {WheelEvent} event
     * @private
     */
    _wheelHandler(event) {
        this._run(EVENT_WHEEL, event);
    }
}

export default InteractionObserver;
