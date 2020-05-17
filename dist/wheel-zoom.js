(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory())
        : typeof define === 'function' && define.amd
        ? define(factory)
        : ((global = global || self), (global.JcWheelZoom = factory()));
})(this, function () {
    'use strict';

    /**
     * Get element coordinates (with support old browsers)
     * @param {Element} element
     * @returns {{top: number, left: number}}
     */
    function getElementCoordinates(element) {
        var box = element.getBoundingClientRect();
        var _document = document,
            body = _document.body,
            documentElement = _document.documentElement;
        var scrollTop =
            window.pageYOffset || documentElement.scrollTop || body.scrollTop;
        var scrollLeft =
            window.pageXOffset || documentElement.scrollLeft || body.scrollLeft;
        var clientTop = documentElement.clientTop || body.clientTop || 0;
        var clientLeft = documentElement.clientLeft || body.clientLeft || 0;
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        return {
            top: top,
            left: left,
        };
    }
    /**
     * Universal alternative to Object.assign()
     * @param {Object} destination
     * @param {Object} source
     * @returns {Object}
     */

    function extendObject(destination, source) {
        if (destination && source) {
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    destination[key] = source[key];
                }
            }
        }

        return destination;
    }
    /**
     * @param number number
     * @returns {[]}
     */

    function numberExtinction(number) {
        var k = 2;
        var maxAvailableLength = 12 * k;
        var minAvailableLength = k;
        var forTail = [20, 7, 6, 5, 4];
        var numbers = [];
        var direction = number > 0 ? 1 : -1;
        var length = Math.abs(number) * k;
        length =
            length && length > maxAvailableLength ? maxAvailableLength : length;
        length =
            length && length < minAvailableLength ? minAvailableLength : length;
        number = (length / k) * direction;

        function generateTail(data) {
            var result = [];

            for (var i = data.length - 1; i >= 0; i--) {
                for (var j = 0; j < data[i]; j++) {
                    result.push((i + 1) * direction);
                }
            }

            return result;
        }

        for (var i = 0; i < length - forTail.length; i++) {
            numbers.push(number * k - i * direction);
        }

        return numbers.length ? numbers.concat(generateTail(forTail)) : [];
    }

    /**
     * @class DragScrollable
     * @param {Element} scrollable
     * @param {Object} options
     * @constructor
     */

    function DragScrollable(scrollable) {
        var options =
            arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {};
        this.dropHandler = this.dropHandler.bind(this);
        this.grabHandler = this.grabHandler.bind(this);
        this.moveHandler = this.moveHandler.bind(this);
        this.options = extendObject(
            {
                // smooth extinction moving element after set loose
                smoothExtinction: true,
                // callback triggered when grabbing an element
                onGrab: null,
                // callback triggered when moving an element
                onMove: null,
                // callback triggered when dropping an element
                onDrop: null,
            },
            options
        );
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
        grabHandler: function grabHandler(event) {
            event.preventDefault();

            if (event.buttons !== 1) {
                return false;
            }

            this.isGrab = true;
            this.coords = {
                left: event.clientX,
                top: event.clientY,
            };
            this.speed = {
                x: 0,
                y: 0,
            };
            document.addEventListener('mouseup', this.dropHandler);
            document.addEventListener('mousemove', this.moveHandler);

            if (typeof this.options.onGrab === 'function') {
                this.options.onGrab();
            }
        },
        dropHandler: function dropHandler(event) {
            event.preventDefault();
            this.isGrab = false;

            if (this.options.smoothExtinction) {
                var moveExtinction = function moveExtinction(
                    field,
                    speedArray
                ) {
                    // !this.isGrab - stop moving if there was a new grab
                    if (!this.isGrab && speedArray.length) {
                        this.scrollable[field] =
                            this.scrollable[field] - speedArray.shift();

                        if (speedArray.length) {
                            window.requestAnimationFrame(
                                moveExtinction.bind(this, field, speedArray)
                            );
                        }
                    }
                };

                moveExtinction.bind(this)(
                    'scrollLeft',
                    numberExtinction(this.speed.x)
                );
                moveExtinction.bind(this)(
                    'scrollTop',
                    numberExtinction(this.speed.y)
                );
            }

            document.removeEventListener('mouseup', this.dropHandler);
            document.removeEventListener('mousemove', this.moveHandler);

            if (typeof this.options.onDrop === 'function') {
                this.options.onDrop();
            }
        },
        moveHandler: function moveHandler(event) {
            event.preventDefault(); // speed of change of the coordinate of the mouse cursor along the X/Y axis

            this.speed.x = event.clientX - this.coords.left;
            this.speed.y = event.clientY - this.coords.top;
            clearTimeout(this.moveTimer); // reset speed data if cursor stops

            this.moveTimer = setTimeout(
                function () {
                    this.speed = {
                        x: 0,
                        y: 0,
                    };
                }.bind(this),
                50
            );
            this.scrollable.scrollLeft =
                this.scrollable.scrollLeft - this.speed.x;
            this.scrollable.scrollTop =
                this.scrollable.scrollTop - this.speed.y;
            this.coords = {
                left: event.clientX,
                top: event.clientY,
            };

            if (typeof this.options.onMove === 'function') {
                this.options.onMove();
            }
        },
    };

    /**
     * @class JcWheelZoom
     * @param {string} selector
     * @param {Object} options
     * @constructor
     */

    function JcWheelZoom(selector) {
        var options =
            arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {};
        this._init = this._init.bind(this);
        this._prepare = this._prepare.bind(this);
        this._rescale = this._rescale.bind(this); //@TODO если просто кликнули на изображение сделать что бы оно масштабировалось от 0 до 100 и наоборот

        var defaults = {
            // drag scrollable image
            dragScrollable: true,
            // options for the DragScrollable module
            dragScrollableOptions: {},
            // maximum allowed proportion of scale
            maxScale: 1,
            // image resizing speed
            speed: 10,
        };
        this.image = document.querySelector(selector);
        this.options = extendObject(defaults, options);

        if (this.image !== null) {
            // for window take just the parent
            this.window = this.image.parentNode; // if the image has already been loaded

            if (this.image.complete) {
                this._init();
            } else {
                // if suddenly the image has not loaded yet, then wait
                this.image.onload = this._init;
            }
        }
    }

    JcWheelZoom.prototype = {
        constructor: JcWheelZoom,
        image: null,
        container: null,
        window: null,
        original: {
            image: {},
            window: {},
        },
        options: null,
        correctX: null,
        correctY: null,

        /**
         * @private
         */
        _init: function _init() {
            // original image sizes
            this.original.image = {
                width: this.image.offsetWidth,
                height: this.image.offsetHeight,
            }; // will move this container, and will center the image in it

            this.container = document.createElement('div');
            this.window.appendChild(this.container);
            this.container.appendChild(this.image);

            this._prepare();

            if (this.options.dragScrollable === true) {
                new DragScrollable(
                    this.window,
                    this.options.dragScrollableOptions
                );
            }

            this.window.addEventListener('wheel', this._rescale);
            window.addEventListener('resize', this._rescale);
        },

        /**
         * @private
         */
        _prepare: function _prepare() {
            // original window sizes
            this.original.window = {
                width: this.window.offsetWidth,
                height: this.window.offsetHeight,
            }; // minimum allowed proportion of scale

            var minScale = Math.min(
                this.original.window.width / this.original.image.width,
                this.original.window.height / this.original.image.height
            ); // calculate margin-left and margin-top to center the image

            this.correctX = Math.max(
                0,
                (this.original.window.width -
                    this.original.image.width * minScale) /
                    2
            );
            this.correctY = Math.max(
                0,
                (this.original.window.height -
                    this.original.image.height * minScale) /
                    2
            ); // set new image dimensions to fit it into the container

            this.image.width = this.original.image.width * minScale;
            this.image.height = this.original.image.height * minScale; // center the image

            this.image.style.marginLeft = ''.concat(this.correctX, 'px');
            this.image.style.marginTop = ''.concat(this.correctY, 'px');
            this.container.style.width = ''.concat(
                this.image.width + this.correctX * 2,
                'px'
            );
            this.container.style.height = ''.concat(
                this.image.height + this.correctY * 2,
                'px'
            );

            if (typeof this.options.prepare === 'function') {
                this.options.prepare(minScale, this.correctX, this.correctY);
            }
        },

        /**
         * @private
         */
        _rescale: function _rescale(event) {
            event.preventDefault();
            var delta = event.deltaY < 0 ? 1 : -1; // the size of the image at the moment

            var imageCurrentWidth = this.image.width;
            var imageCurrentHeight = this.image.height; // current proportion of scale

            var scale = imageCurrentWidth / this.original.image.width; // minimum allowed proportion of scale

            var minScale = Math.min(
                this.original.window.width / this.original.image.width,
                this.original.window.height / this.original.image.height
            ); // new allowed proportion of scale

            var newScale = scale + delta / this.options.speed;
            newScale =
                newScale < minScale
                    ? minScale
                    : newScale > this.options.maxScale
                    ? this.options.maxScale
                    : newScale; // scroll along the X axis before resizing

            var scrollLeftBeforeRescale = this.window.scrollLeft; // scroll along the Y axis before resizing

            var scrollTopBeforeRescale = this.window.scrollTop; // new image sizes that will be set

            var imageNewWidth = (this.image.width =
                this.original.image.width * newScale);
            var imageNewHeight = (this.image.height =
                this.original.image.height * newScale);
            var containerNewWidth = imageNewWidth + this.correctX * 2;
            var containerNewHeight = imageNewHeight + this.correctY * 2;
            this.container.style.width = ''.concat(containerNewWidth, 'px');
            this.container.style.height = ''.concat(containerNewHeight, 'px');

            if (typeof this.options.rescale === 'function') {
                this.options.rescale(
                    newScale,
                    this.correctX,
                    this.correctY,
                    minScale
                );
            } // scroll on the X axis after resized

            var scrollLeftAfterRescale = this.window.scrollLeft; // scroll on the Y axis after resized

            var scrollTopAfterRescale = this.window.scrollTop;
            var windowCoords = getElementCoordinates(this.window);
            var x = Math.round(
                event.pageX -
                    windowCoords.left +
                    this.window.scrollLeft -
                    this.correctX
            );
            var newX = Math.round((imageNewWidth * x) / imageCurrentWidth);
            var shiftX = newX - x;
            this.window.scrollLeft +=
                shiftX + (scrollLeftBeforeRescale - scrollLeftAfterRescale);
            var y = Math.round(
                event.pageY -
                    windowCoords.top +
                    this.window.scrollTop -
                    this.correctY
            );
            var newY = Math.round((imageNewHeight * y) / imageCurrentHeight);
            var shiftY = newY - y;
            this.window.scrollTop +=
                shiftY + (scrollTopBeforeRescale - scrollTopAfterRescale);
        },

        /**
         * @public
         */
        prepare: function prepare() {
            this._prepare();
        },

        /**
         * @public
         */
        zoomUp: function zoomUp() {
            var windowCoords = getElementCoordinates(this.window);
            var event = new Event('wheel');
            event.deltaY = -1;
            event.pageX = windowCoords.left + this.original.window.width / 2;
            event.pageY = windowCoords.top + this.original.window.height / 2;

            this._rescale(event);
        },

        /**
         * @public
         */
        zoomDown: function zoomDown() {
            var windowCoords = getElementCoordinates(this.window);
            var event = new Event('wheel');
            event.deltaY = 1;
            event.pageX = windowCoords.left + this.original.window.width / 2;
            event.pageY = windowCoords.top + this.original.window.height / 2;

            this._rescale(event);
        },
    };
    /**
     * Create JcWheelZoom instance
     * @param {string} selector
     * @param {Object} [options]
     * @returns {JcWheelZoom}
     */

    JcWheelZoom.create = function (selector, options) {
        return new JcWheelZoom(selector, options);
    };

    return JcWheelZoom;
});
