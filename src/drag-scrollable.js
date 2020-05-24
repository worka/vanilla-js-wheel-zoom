import { extendObject, on, off, numberExtinction } from './toolkit';

/**
 * @class DragScrollable
 * @param {Element} scrollable
 * @param {Object} options
 * @constructor
 */
function DragScrollable(scrollable, options = {}) {
    this.dropHandler = this.dropHandler.bind(this);
    this.grabHandler = this.grabHandler.bind(this);
    this.moveHandler = this.moveHandler.bind(this);

    this.options = extendObject({
        // smooth extinction moving element after set loose
        smoothExtinction: true,
        // callback triggered when grabbing an element
        onGrab: null,
        // callback triggered when moving an element
        onMove: null,
        // callback triggered when dropping an element
        onDrop: null
    }, options);

    // check if we're using a touch screen
    this.isTouch = 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

    // switch to touch events if using a touch screen
    this.events = this.isTouch ?
        { grab: 'touchstart', move: 'touchmove', drop: 'touchend' } :
        { grab: 'mousedown', move: 'mousemove', drop: 'mouseup' };

    // if using touch screen tells the browser that the default action will not be undone
    this.events.options = this.isTouch ? { passive: true } : false;

    this.scrollable = scrollable;

    on(this.scrollable, this.events.grab, event => {
        // if touch started or pressed left mouse button
        if (this.isTouch || event.buttons === 1) {
            this.grabHandler(event);
        }
    }, this.events.options);
}

DragScrollable.prototype = {
    constructor: DragScrollable,
    isTouch: false,
    isGrab: false,
    events: null,
    scrollable: null,
    moveTimer: null,
    options: {},
    coordinates: null,
    speed: null,
    grabHandler(event) {
        if (!this.isTouch) event.preventDefault();

        this.isGrab = true;
        this.coordinates = { left: _getClientX(event), top: _getClientY(event) };
        this.speed = { x: 0, y: 0 };

        on(document, this.events.drop, this.dropHandler, this.events.options);
        on(document, this.events.move, this.moveHandler, this.events.options);

        if (typeof this.options.onGrab === 'function') {
            this.options.onGrab();
        }
    },
    dropHandler(event) {
        if (!this.isTouch) event.preventDefault();

        this.isGrab = false;

        if (this.options.smoothExtinction) {
            _moveExtinction.call(this, 'scrollLeft', numberExtinction(this.speed.x));
            _moveExtinction.call(this, 'scrollTop', numberExtinction(this.speed.y));
        }

        off(document, this.events.drop, this.dropHandler);
        off(document, this.events.move, this.moveHandler);

        if (typeof this.options.onDrop === 'function') {
            this.options.onDrop();
        }
    },
    moveHandler(event) {
        if (!this.isTouch) event.preventDefault();

        // speed of change of the coordinate of the mouse cursor along the X/Y axis
        this.speed.x = _getClientX(event) - this.coordinates.left;
        this.speed.y = _getClientY(event) - this.coordinates.top;

        clearTimeout(this.moveTimer);

        // reset speed data if cursor stops
        this.moveTimer = setTimeout((function () {
            this.speed = { x: 0, y: 0 };
        }).bind(this), 50);

        this.scrollable.scrollLeft = this.scrollable.scrollLeft - this.speed.x;
        this.scrollable.scrollTop = this.scrollable.scrollTop - this.speed.y;

        this.coordinates = { left: _getClientX(event), top: _getClientY(event) };

        if (typeof this.options.onMove === 'function') {
            this.options.onMove();
        }
    }
};

function _moveExtinction(field, speedArray) {
    // !this.isGrab - stop moving if there was a new grab
    if (!this.isGrab && speedArray.length) {
        this.scrollable[field] = this.scrollable[field] - speedArray.shift();

        if (speedArray.length) {
            window.requestAnimationFrame(_moveExtinction.bind(this, field, speedArray));
        }
    }
}

function _getClientX(event) {
    return event instanceof TouchEvent ? event.touches[0].clientX : event.clientX;
}

function _getClientY(event) {
    return event instanceof TouchEvent ? event.touches[0].clientY : event.clientY;
}

export default DragScrollable;
