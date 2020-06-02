(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory())
        : typeof define === 'function' && define.amd
        ? define(factory)
        : ((global = global || self), (global.JcWheelZoom = factory()));
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
    function eventClientX(event) {
        return event instanceof TouchEvent
            ? event.changedTouches[0].clientX
            : event.clientX;
    }
    function eventClientY(event) {
        return event instanceof TouchEvent
            ? event.changedTouches[0].clientY
            : event.clientY;
    }

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
        this._computeNewScale = this._computeNewScale.bind(this);
        this._computeNewPosition = this._computeNewPosition.bind(this);
        this._transform = this._transform.bind(this);
        var defaults = {
            // drag scrollable content
            dragScrollable: true,
            // options for the DragScrollable module
            dragScrollableOptions: {},
            // maximum allowed proportion of scale
            maxScale: 1,
            // content resizing speed
            speed: 10,
        };
        this.content.$element = document.querySelector(selector); // check if we're using a touch screen

        this.isTouch =
            'ontouchstart' in window ||
            navigator.MaxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0; // switch to touch events if using a touch screen

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

            if (this.content.$element.tagName === 'IMG') {
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

    JcWheelZoom.prototype = {
        constructor: JcWheelZoom,
        isTouch: false,
        events: null,
        content: {},
        window: {},
        direction: 1,
        options: null,
        correctX: null,
        correctY: null,
        stack: [],
        _init: function _init() {
            var _this = this;

            if (this.content.$element.tagName === 'IMG') {
                // original `image` sizes and transform data
                this.content.originalWidth = this.content.$element.naturalWidth;
                this.content.originalHeight = this.content.$element.naturalHeight;
                this.content.minScale = 1;
                this.content.maxScale = round(
                    (this.content.$element.naturalWidth /
                        this.content.$element.offsetWidth) *
                        this.options.maxScale
                );
            } else {
                this.content.minScale = 1;
                this.content.maxScale = 5;
            } // initial content sizes

            this.content.initialWidth = this.content.$element.offsetWidth;
            this.content.initialHeight = this.content.$element.offsetHeight; // current content sizes and transform data

            this.content.currentWidth = this.content.$element.offsetWidth;
            this.content.currentHeight = this.content.$element.offsetHeight;
            this.content.currentLeft = 0;
            this.content.currentTop = 0;
            this.content.currentScale = 1;

            this._prepare();

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
            });
            on(self, 'resize', function (event) {
                event.preventDefault();

                _this._prepare();

                _this._transform(
                    _this._computeNewPosition(1, {
                        x: eventClientX(event),
                        y: eventClientY(event),
                    })
                );
            }); // processing of the event "max / min zoom" begin only if there was really just a click
            // so as not to interfere with the DragScrollable module

            var clickExpired = true;
            on(
                this.window.$element,
                this.events.down,
                function () {
                    clickExpired = false;
                    setTimeout(function () {
                        return (clickExpired = true);
                    }, 150);
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
                                    : 1,
                                {
                                    x: eventClientX(event),
                                    y: eventClientY(event),
                                }
                            )
                        );

                        _this.direction = _this.direction * -1;
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
            this.window.positionTop = windowPosition.top; // calculate margin-left and margin-top to center the content

            this.correctX = Math.max(
                0,
                (this.window.originalWidth - this.content.currentWidth) / 2
            );
            this.correctY = Math.max(
                0,
                (this.window.originalHeight - this.content.currentHeight) / 2
            );
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
                content = this.content,
                correctX = this.correctX,
                correctY = this.correctY;
            var contentNewWidth = content.initialWidth * contentNewScale;
            var contentNewHeight = content.initialHeight * contentNewScale; // calculate the parameters along the X axis

            var leftWindowShiftX = x - window.positionLeft;
            var centerWindowShiftX =
                window.originalWidth / 2 - leftWindowShiftX;
            var centerContentShiftX = centerWindowShiftX + content.currentLeft;
            var contentNewLeft =
                centerContentShiftX * (contentNewWidth / content.currentWidth) -
                centerContentShiftX +
                content.currentLeft; // check that the content does not go beyond the X axis

            if (
                (contentNewWidth - window.originalWidth) / 2 + correctX <
                Math.abs(centerContentShiftX - centerWindowShiftX)
            ) {
                contentNewLeft =
                    (contentNewWidth - window.originalWidth) / 2 + correctX;
                if (centerContentShiftX - centerWindowShiftX < 0)
                    contentNewLeft = contentNewLeft * -1;
            } // calculate the parameters along the Y axis

            var topWindowShiftY = y - window.positionTop;
            var centerWindowShiftY =
                window.originalHeight / 2 - topWindowShiftY;
            var centerContentShiftY = centerWindowShiftY + content.currentTop;
            var contentNewTop =
                centerContentShiftY *
                    (contentNewHeight / content.currentHeight) -
                centerContentShiftY +
                content.currentTop; // check that the content does not go beyond the Y axis

            if (
                (contentNewHeight - window.originalHeight) / 2 + correctY <
                Math.abs(centerContentShiftY - centerWindowShiftY)
            ) {
                contentNewTop =
                    (contentNewHeight - window.originalHeight) / 2 + correctY;
                if (centerContentShiftY - centerWindowShiftY < 0)
                    contentNewTop = contentNewTop * -1;
            }

            if (contentNewScale === 1) {
                contentNewLeft = contentNewTop = 0;
            }

            var response = {
                currentLeft: content.currentLeft,
                newLeft: round(contentNewLeft),
                currentTop: content.currentTop,
                newTop: round(contentNewTop),
                currentScale: content.currentScale,
                newScale: round(contentNewScale),
            };
            content.currentWidth = round(contentNewWidth);
            content.currentHeight = round(contentNewHeight);
            content.currentLeft = round(contentNewLeft);
            content.currentTop = round(contentNewTop);
            content.currentScale = round(contentNewScale);
            return response;
        },
        _transform: function _transform(_ref2) {
            var currentLeft = _ref2.currentLeft,
                newLeft = _ref2.newLeft,
                currentTop = _ref2.currentTop,
                newTop = _ref2.newTop,
                currentScale = _ref2.currentScale,
                newScale = _ref2.newScale;
            this.content.$element.style.transform =
                newScale === 1
                    ? null
                    : 'translate3d('
                          .concat(newLeft, 'px, ')
                          .concat(newTop, 'px, 0px) scale(')
                          .concat(newScale, ')');
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
        zoomUp: function zoomUp() {
            this._zoom(-1);
        },
        zoomDown: function zoomDown() {
            this._zoom(1);
        },
    };

    function round(_float) {
        return _float; // return Math.ceil(float * 10) / 10;
    }
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
