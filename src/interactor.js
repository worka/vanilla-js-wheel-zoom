import { eventClientX, eventClientY, isTouch, off, on } from './toolkit';

const EVENT_CLICK = 'click';
const EVENT_DBLCLICK = 'dblclick';
const EVENT_WHEEL = 'wheel';
const EVENT_PINCH_TO_ZOOM = 'pinchtozoom';

const SHIFT_DECIDE_THAT_MOVE_STARTED = 5;

class Interactor {
    /**
     * @param {HTMLElement} target
     * @constructor
     */
    constructor(target) {
        this.target = target;

        /** @type {Object<string, (event: Event) => void>} */
        this.subscribes = {};

        this.coordsOnDown = null;
        this.pressingTimeout = null;
        this.firstClick = true;

        this.fingersHypot = null;
        this.zoomPinchWasDetected = false;

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

        this._touchMoveHandler = this._touchMoveHandler.bind(this);
        this._touchEndHandler = this._touchEndHandler.bind(this);

        on(this.target, this.events.down, this._downHandler, this.events.options);
        on(this.target, this.events.up, this._upHandler, this.events.options);
        on(this.target, EVENT_WHEEL, this._wheelHandler);

        if (this.isTouch) {
            on(this.target, 'touchmove', this._touchMoveHandler);
            on(this.target, 'touchend', this._touchEndHandler);
        }
    }

    /**
     * @param {string} eventType
     * @param {(event: Event) => void} eventHandler
     * @returns {Interactor}
     */
    on(eventType, eventHandler) {
        if (!(eventType in this.subscribes)) {
            this.subscribes[eventType] = [];
        }

        this.subscribes[eventType].push(eventHandler);

        return this;
    }

    destroy() {
        off(this.target, this.events.down, this._downHandler, this.events.options);
        off(this.target, this.events.up, this._upHandler, this.events.options);
        off(this.target, EVENT_WHEEL, this._wheelHandler, this.events.options);

        if (this.isTouch) {
            off(this.target, 'touchmove', this._touchMoveHandler);
            off(this.target, 'touchend', this._touchEndHandler);
        }

        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                this[key] = null;
            }
        }
    }

    /**
     * @param {string} eventType
     * @param {Event} event
     * @private
     */
    _run(eventType, event) {
        if (this.subscribes[eventType]) {
            for (const eventHandler of this.subscribes[eventType]) {
                eventHandler(event);
            }
        }
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

    /**
     * @param {TouchEvent|PointerEvent} event
     * @private
     */
    _touchMoveHandler(event) {
        // detect two fingers
        if (event.targetTouches.length === 2) {
            const pageX1 = event.targetTouches[0].clientX;
            const pageY1 = event.targetTouches[0].clientY;

            const pageX2 = event.targetTouches[1].clientX;
            const pageY2 = event.targetTouches[1].clientY;

            // Math.hypot() analog
            const fingersHypotNew = Math.round(Math.sqrt(
                Math.pow(Math.abs(pageX1 - pageX2), 2) +
                Math.pow(Math.abs(pageY1 - pageY2), 2)
            ));

            let direction = 0;
            if (fingersHypotNew > this.fingersHypot + SHIFT_DECIDE_THAT_MOVE_STARTED) direction = -1;
            if (fingersHypotNew < this.fingersHypot - SHIFT_DECIDE_THAT_MOVE_STARTED) direction = 1;

            if (direction !== 0) {
                if (this.fingersHypot !== null || direction === 1) {
                    // middle position between fingers
                    const clientX = Math.min(pageX1, pageX2) + (Math.abs(pageX1 - pageX2) / 2);
                    const clientY = Math.min(pageY1, pageY2) + (Math.abs(pageY1 - pageY2) / 2);

                    event.data = { ...event.data || {}, clientX, clientY, direction };

                    this._run(EVENT_PINCH_TO_ZOOM, event);
                }

                this.fingersHypot = fingersHypotNew;
                this.zoomPinchWasDetected = true;
            }
        }
    }

    /**
     * @private
     */
    _touchEndHandler() {
        if (this.zoomPinchWasDetected) {
            this.fingersHypot = null;
            this.zoomPinchWasDetected = false;
        }
    }
}

export default Interactor;
