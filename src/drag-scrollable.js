import { extendObject, numberExtinction } from './toolkit';

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

    this.scrollable = scrollable;
    this.scrollable.addEventListener('mousedown', this.grabHandler);
}

DragScrollable.prototype = {
    constructor: DragScrollable,
    scrollable: null,
    moveTimer: null,
    options: {},
    isGrab: false,
    coords: null,
    speed: null,
    grabHandler: function (event) {
        event.preventDefault();

        if (event.buttons !== 1) {
            return false;
        }

        this.isGrab = true;
        this.coords = { left: event.clientX, top: event.clientY };
        this.speed = { x: 0, y: 0 };

        document.addEventListener('mouseup', this.dropHandler);
        document.addEventListener('mousemove', this.moveHandler);

        if (typeof this.options.onGrab === 'function') {
            this.options.onGrab();
        }
    },
    dropHandler: function (event) {
        event.preventDefault();

        this.isGrab = false;

        if (this.options.smoothExtinction) {
            moveExtinction.bind(this)('scrollLeft', numberExtinction(this.speed.x));
            moveExtinction.bind(this)('scrollTop', numberExtinction(this.speed.y));

            function moveExtinction(field, speedArray) {
                // !this.isGrab - stop moving if there was a new grab
                if (!this.isGrab && speedArray.length) {
                    this.scrollable[field] = this.scrollable[field] - speedArray.shift();

                    if (speedArray.length) {
                        window.requestAnimationFrame(moveExtinction.bind(this, field, speedArray));
                    }
                }
            }
        }

        document.removeEventListener('mouseup', this.dropHandler);
        document.removeEventListener('mousemove', this.moveHandler);

        if (typeof this.options.onDrop === 'function') {
            this.options.onDrop();
        }
    },
    moveHandler: function (event) {
        event.preventDefault();

        // speed of change of the coordinate of the mouse cursor along the X/Y axis
        this.speed.x = event.clientX - this.coords.left;
        this.speed.y = event.clientY - this.coords.top;

        clearTimeout(this.moveTimer);

        // reset speed data if cursor stops
        this.moveTimer = setTimeout((function () {
            this.speed = { x: 0, y: 0 };
        }).bind(this), 50);

        this.scrollable.scrollLeft = this.scrollable.scrollLeft - this.speed.x;
        this.scrollable.scrollTop = this.scrollable.scrollTop - this.speed.y;

        this.coords = {
            left: event.clientX,
            top: event.clientY
        };

        if (typeof this.options.onMove === 'function') {
            this.options.onMove();
        }
    }
};

export default DragScrollable;
