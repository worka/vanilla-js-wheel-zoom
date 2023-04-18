import { off, on } from '../toolkit';
import AbstractObserver from './AbstractObserver';

export const EVENT_PINCH_TO_ZOOM = 'pinchtozoom';

const SHIFT_DECIDE_THAT_MOVE_STARTED = 5;

class PinchToZoomObserver extends AbstractObserver {
    /**
     * @param {HTMLElement} target
     * @constructor
     */
    constructor(target) {
        super();

        this.target = target;

        this.fingersHypot = null;
        this.zoomPinchWasDetected = false;

        this._touchMoveHandler = this._touchMoveHandler.bind(this);
        this._touchEndHandler = this._touchEndHandler.bind(this);

        on(this.target, 'touchmove', this._touchMoveHandler);
        on(this.target, 'touchend', this._touchEndHandler);
    }

    destroy() {
        off(this.target, 'touchmove', this._touchMoveHandler);
        off(this.target, 'touchend', this._touchEndHandler);

        super.destroy();
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

export default PinchToZoomObserver;
