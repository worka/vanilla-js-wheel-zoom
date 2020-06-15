(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory())
        : typeof define === 'function' && define.amd
        ? define(factory)
        : ((global = global || self), (global.WZoom = factory()));
})(this, function () {
    'use strict';

    /**
     * Get element position (with support old browsers)
     * @param {Element} element
     * @returns {{top: number, left: number}}
     */
    function getElementPosition(element) {
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
     * @param target
     * @param type
     * @param listener
     * @param options
     */

    function on(target, type, listener) {
        var options =
            arguments.length > 3 && arguments[3] !== undefined
                ? arguments[3]
                : false;
        target.addEventListener(type, listener, options);
    }
    /**
     * @param target
     * @param type
     * @param listener
     * @param options
     */

    function off(target, type, listener) {
        var options =
            arguments.length > 3 && arguments[3] !== undefined
                ? arguments[3]
                : false;
        target.removeEventListener(type, listener, options);
    }
    function isTouch() {
        return (
            'ontouchstart' in window ||
            navigator.MaxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        );
    }
    function eventClientX(event) {
        return event.type === 'wheel' ||
            event.type === 'mousedown' ||
            event.type === 'mousemove' ||
            event.type === 'mouseup'
            ? event.clientX
            : event.changedTouches[0].clientX;
    }
    function eventClientY(event) {
        return event.type === 'wheel' ||
            event.type === 'mousedown' ||
            event.type === 'mousemove' ||
            event.type === 'mouseup'
            ? event.clientY
            : event.changedTouches[0].clientY;
    }

    /**
     * @class DragScrollable
     * @param {Object} windowObject
     * @param {Object} contentObject
     * @param {Object} options
     * @constructor
     */

    function DragScrollable(windowObject, contentObject) {
        var _this = this;

        var options =
            arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : {};
        this._dropHandler = this._dropHandler.bind(this);
        this._grabHandler = this._grabHandler.bind(this);
        this._moveHandler = this._moveHandler.bind(this);
        this.options = extendObject(
            {
                // smooth extinction moving element after set loose
                smoothExtinction: false,
                // callback triggered when grabbing an element
                onGrab: null,
                // callback triggered when moving an element
                onMove: null,
                // callback triggered when dropping an element
                onDrop: null,
            },
            options
        ); // check if we're using a touch screen

        this.isTouch = isTouch(); // switch to touch events if using a touch screen

        this.events = this.isTouch
            ? {
                  grab: 'touchstart',
                  move: 'touchmove',
                  drop: 'touchend',
              }
            : {
                  grab: 'mousedown',
                  move: 'mousemove',
                  drop: 'mouseup',
              }; // if using touch screen tells the browser that the default action will not be undone

        this.events.options = this.isTouch
            ? {
                  passive: true,
              }
            : false;
        this.window = windowObject;
        this.content = contentObject;
        on(
            this.content.$element,
            this.events.grab,
            function (event) {
                // if touch started (only one finger) or pressed left mouse button
                if (
                    (_this.isTouch && event.touches.length === 1) ||
                    event.buttons === 1
                ) {
                    _this._grabHandler(event);
                }
            },
            this.events.options
        );
    }

    DragScrollable.prototype = {
        constructor: DragScrollable,
        window: null,
        content: null,
        isTouch: false,
        isGrab: false,
        events: null,
        moveTimer: null,
        options: {},
        coordinates: null,
        speed: null,
        _grabHandler: function _grabHandler(event) {
            if (!this.isTouch) event.preventDefault();
            this.isGrab = true;
            this.coordinates = {
                left: eventClientX(event),
                top: eventClientY(event),
            };
            this.speed = {
                x: 0,
                y: 0,
            };
            on(
                document,
                this.events.drop,
                this._dropHandler,
                this.events.options
            );
            on(
                document,
                this.events.move,
                this._moveHandler,
                this.events.options
            );

            if (typeof this.options.onGrab === 'function') {
                this.options.onGrab();
            }
        },
        _dropHandler: function _dropHandler(event) {
            if (!this.isTouch) event.preventDefault();
            this.isGrab = false; // if (this.options.smoothExtinction) {
            //     _moveExtinction.call(this, 'scrollLeft', numberExtinction(this.speed.x));
            //     _moveExtinction.call(this, 'scrollTop', numberExtinction(this.speed.y));
            // }

            off(document, this.events.drop, this._dropHandler);
            off(document, this.events.move, this._moveHandler);

            if (typeof this.options.onDrop === 'function') {
                this.options.onDrop();
            }
        },
        _moveHandler: function _moveHandler(event) {
            if (!this.isTouch) event.preventDefault();
            var window = this.window,
                content = this.content,
                speed = this.speed,
                coordinates = this.coordinates,
                options = this.options; // speed of change of the coordinate of the mouse cursor along the X/Y axis

            speed.x = eventClientX(event) - coordinates.left;
            speed.y = eventClientY(event) - coordinates.top;
            clearTimeout(this.moveTimer); // reset speed data if cursor stops

            this.moveTimer = setTimeout(function () {
                speed.x = 0;
                speed.y = 0;
            }, 50);
            var contentNewLeft = content.currentLeft + speed.x;
            var contentNewTop = content.currentTop + speed.y;
            var maxAvailableLeft =
                (content.currentWidth - window.originalWidth) / 2 +
                content.correctX;
            var maxAvailableTop =
                (content.currentHeight - window.originalHeight) / 2 +
                content.correctY; // if we do not go beyond the permissible boundaries of the window

            if (Math.abs(contentNewLeft) <= maxAvailableLeft)
                content.currentLeft = contentNewLeft; // if we do not go beyond the permissible boundaries of the window

            if (Math.abs(contentNewTop) <= maxAvailableTop)
                content.currentTop = contentNewTop;

            _transform(content.$element, {
                left: content.currentLeft,
                top: content.currentTop,
                scale: content.currentScale,
            });

            coordinates.left = eventClientX(event);
            coordinates.top = eventClientY(event);

            if (typeof options.onMove === 'function') {
                options.onMove();
            }
        },
    };

    function _transform($element, _ref) {
        var left = _ref.left,
            top = _ref.top,
            scale = _ref.scale;
        $element.style.transform = 'translate3d('
            .concat(left, 'px, ')
            .concat(top, 'px, 0px) scale(')
            .concat(scale, ')');
    } // function _moveExtinction(field, speedArray) {

    /**
     * @class WZoom
     * @param {string} selector
     * @param {Object} options
     * @constructor
     */

    function WZoom(selector) {
        var options =
            arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {};
        this._init = this._init.bind(this);
        this._prepare = this._prepare.bind(this);
        this._computeNewScale = this._computeNewScale.bind(this);
        this._computeNewPosition = this._computeNewPosition.bind(this);
        this._transform = this._transform.bind(this);
        var defaults = {
            // type content: `image` - only one image, `html` - any HTML content
            type: 'image',
            // for type `image` computed auto (if width set null), for type `html` need set real html content width, else computed auto
            width: null,
            // for type `image` computed auto (if height set null), for type `html` need set real html content height, else computed auto
            height: null,
            // drag scrollable content
            dragScrollable: true,
            // options for the DragScrollable module
            dragScrollableOptions: {},
            // maximum allowed proportion of scale
            maxScale: 1,
            // content resizing speed
            speed: 50,
        };
        this.content.$element = document.querySelector(selector); // check if we're using a touch screen

        this.isTouch = isTouch(); // switch to touch events if using a touch screen

        this.events = this.isTouch
            ? {
                  down: 'touchstart',
                  up: 'touchend',
              }
            : {
                  down: 'mousedown',
                  up: 'mouseup',
              }; // if using touch screen tells the browser that the default action will not be undone

        this.events.options = this.isTouch
            ? {
                  passive: true,
              }
            : false;

        if (this.content.$element) {
            this.options = extendObject(defaults, options); // for window take just the parent

            this.window.$element = this.content.$element.parentNode;

            if (this.options.type === 'image') {
                // if the `image` has already been loaded
                if (this.content.$element.complete) {
                    this._init();
                } else {
                    // if suddenly the `image` has not loaded yet, then wait
                    this.content.$element.onload = this._init;
                }
            } else {
                this._init();
            }
        }
    }

    WZoom.prototype = {
        constructor: WZoom,
        isTouch: false,
        events: null,
        content: {},
        window: {},
        direction: 1,
        options: null,
        stack: [],
        _init: function _init() {
            var _this = this;

            this._prepare();

            if (this.options.dragScrollable === true) {
                new DragScrollable(
                    this.window,
                    this.content,
                    this.options.dragScrollableOptions
                );
            }

            on(this.window.$element, 'wheel', function (event) {
                event.preventDefault();

                _this._transform(
                    _this._computeNewPosition(
                        _this._computeNewScale(event.deltaY),
                        {
                            x: eventClientX(event),
                            y: eventClientY(event),
                        }
                    )
                );
            }); // processing of the event "max / min zoom" begin only if there was really just a click
            // so as not to interfere with the DragScrollable module

            var clickExpired = true;
            on(
                this.window.$element,
                this.events.down,
                function (event) {
                    if (
                        (_this.isTouch && event.touches.length === 1) ||
                        event.buttons === 1
                    ) {
                        clickExpired = false;
                        setTimeout(function () {
                            return (clickExpired = true);
                        }, 150);
                    }
                },
                this.events.options
            );
            on(
                this.window.$element,
                this.events.up,
                function (event) {
                    if (!clickExpired) {
                        _this._transform(
                            _this._computeNewPosition(
                                _this.direction === 1
                                    ? _this.content.maxScale
                                    : _this.content.minScale,
                                {
                                    x: eventClientX(event),
                                    y: eventClientY(event),
                                }
                            )
                        );

                        _this.direction *= -1;
                    }
                },
                this.events.options
            );
        },
        _prepare: function _prepare() {
            var windowPosition = getElementPosition(this.window.$element); // original window sizes and position

            this.window.originalWidth = this.window.$element.offsetWidth;
            this.window.originalHeight = this.window.$element.offsetHeight;
            this.window.positionLeft = windowPosition.left;
            this.window.positionTop = windowPosition.top; // original content sizes

            if (this.options.type === 'image') {
                this.content.originalWidth =
                    this.options.width || this.content.$element.naturalWidth;
                this.content.originalHeight =
                    this.options.height || this.content.$element.naturalHeight;
            } else {
                this.content.originalWidth =
                    this.options.width || this.content.$element.offsetWidth;
                this.content.originalHeight =
                    this.options.height || this.content.$element.offsetHeight;
            } // minScale && maxScale

            this.content.minScale = Math.min(
                this.window.originalWidth / this.content.originalWidth,
                this.window.originalHeight / this.content.originalHeight
            );
            this.content.maxScale = this.options.maxScale; // current content sizes and transform data

            this.content.currentWidth =
                this.content.originalWidth * this.content.minScale;
            this.content.currentHeight =
                this.content.originalHeight * this.content.minScale;
            this.content.currentLeft = 0;
            this.content.currentTop = 0;
            this.content.currentScale = this.content.minScale; // calculate indent-left and indent-top to of content from window borders

            this.content.correctX = Math.max(
                0,
                (this.window.originalWidth - this.content.currentWidth) / 2
            );
            this.content.correctY = Math.max(
                0,
                (this.window.originalHeight - this.content.currentHeight) / 2
            );
            this.content.$element.style.transform = 'translate3d(0px, 0px, 0px) scale('.concat(
                this.content.minScale,
                ')'
            );

            if (typeof this.options.prepare === 'function') {
                this.options.prepare();
            }
        },
        _computeNewScale: function _computeNewScale(delta) {
            this.direction = delta < 0 ? 1 : -1;
            var _this$content = this.content,
                minScale = _this$content.minScale,
                maxScale = _this$content.maxScale,
                currentScale = _this$content.currentScale;
            var contentNewScale =
                currentScale + this.direction / this.options.speed;
            return contentNewScale < minScale
                ? minScale
                : contentNewScale > maxScale
                ? maxScale
                : contentNewScale;
        },
        _computeNewPosition: function _computeNewPosition(
            contentNewScale,
            _ref
        ) {
            var x = _ref.x,
                y = _ref.y;
            var window = this.window,
                content = this.content;
            var contentNewWidth = content.originalWidth * contentNewScale;
            var contentNewHeight = content.originalHeight * contentNewScale;
            var _document = document,
                body = _document.body,
                documentElement = _document.documentElement;
            var scrollLeft =
                window.pageXOffset ||
                documentElement.scrollLeft ||
                body.scrollLeft;
            var scrollTop =
                window.pageYOffset ||
                documentElement.scrollTop ||
                body.scrollTop; // calculate the parameters along the X axis

            var leftWindowShiftX = x + scrollLeft - window.positionLeft;
            var centerWindowShiftX =
                window.originalWidth / 2 - leftWindowShiftX;
            var centerContentShiftX = centerWindowShiftX + content.currentLeft;
            var contentNewLeft =
                centerContentShiftX * (contentNewWidth / content.currentWidth) -
                centerContentShiftX +
                content.currentLeft; // check that the content does not go beyond the X axis

            if (
                this.direction === -1 &&
                (contentNewWidth - window.originalWidth) / 2 +
                    content.correctX <
                    Math.abs(contentNewLeft)
            ) {
                var positive = contentNewLeft < 0 ? -1 : 1;
                contentNewLeft =
                    ((contentNewWidth - window.originalWidth) / 2 +
                        content.correctX) *
                    positive;
            } // calculate the parameters along the Y axis

            var topWindowShiftY = y + scrollTop - window.positionTop;
            var centerWindowShiftY =
                window.originalHeight / 2 - topWindowShiftY;
            var centerContentShiftY = centerWindowShiftY + content.currentTop;
            var contentNewTop =
                centerContentShiftY *
                    (contentNewHeight / content.currentHeight) -
                centerContentShiftY +
                content.currentTop; // check that the content does not go beyond the Y axis

            if (
                this.direction === -1 &&
                (contentNewHeight - window.originalHeight) / 2 +
                    content.correctY <
                    Math.abs(contentNewTop)
            ) {
                var _positive = contentNewTop < 0 ? -1 : 1;

                contentNewTop =
                    ((contentNewHeight - window.originalHeight) / 2 +
                        content.correctY) *
                    _positive;
            }

            if (contentNewScale === this.content.minScale) {
                contentNewLeft = contentNewTop = 0;
            }

            var response = {
                currentLeft: content.currentLeft,
                newLeft: contentNewLeft,
                currentTop: content.currentTop,
                newTop: contentNewTop,
                currentScale: content.currentScale,
                newScale: contentNewScale,
            };
            content.currentWidth = contentNewWidth;
            content.currentHeight = contentNewHeight;
            content.currentLeft = contentNewLeft;
            content.currentTop = contentNewTop;
            content.currentScale = contentNewScale;
            return response;
        },
        _transform: function _transform(_ref2) {
            var currentLeft = _ref2.currentLeft,
                newLeft = _ref2.newLeft,
                currentTop = _ref2.currentTop,
                newTop = _ref2.newTop,
                currentScale = _ref2.currentScale,
                newScale = _ref2.newScale;
            this.content.$element.style.transform = 'translate3d('
                .concat(newLeft, 'px, ')
                .concat(newTop, 'px, 0px) scale(')
                .concat(newScale, ')');

            if (typeof this.options.rescale === 'function') {
                this.options.rescale();
            }
        },
        _zoom: function _zoom(direction) {
            var windowPosition = getElementPosition(this.window.$element);

            this._transform(
                this._computeNewPosition(this._computeNewScale(direction), {
                    x: windowPosition.left + this.window.originalWidth / 2,
                    y: windowPosition.top + this.window.originalHeight / 2,
                })
            );
        },
        prepare: function prepare() {
            this._prepare();
        },
        zoomUp: function zoomUp() {
            this._zoom(-1);
        },
        zoomDown: function zoomDown() {
            this._zoom(1);
        },
    };
    /**
     * Create WZoom instance
     * @param {string} selector
     * @param {Object} [options]
     * @returns {WZoom}
     */

    WZoom.create = function (selector, options) {
        return new WZoom(selector, options);
    };

    return WZoom;
});
