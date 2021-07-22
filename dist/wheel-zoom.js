(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory())
        : typeof define === 'function' && define.amd
        ? define(factory)
        : ((global =
              typeof globalThis !== 'undefined' ? globalThis : global || self),
          (global.WZoom = factory()));
})(this, function () {
    'use strict';

    function _slicedToArray(arr, i) {
        return (
            _arrayWithHoles(arr) ||
            _iterableToArrayLimit(arr, i) ||
            _unsupportedIterableToArray(arr, i) ||
            _nonIterableRest()
        );
    }

    function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
    }

    function _iterableToArrayLimit(arr, i) {
        var _i =
            arr == null
                ? null
                : (typeof Symbol !== 'undefined' && arr[Symbol.iterator]) ||
                  arr['@@iterator'];

        if (_i == null) return;
        var _arr = [];
        var _n = true;
        var _d = false;

        var _s, _e;

        try {
            for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);

                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i['return'] != null) _i['return']();
            } finally {
                if (_d) throw _e;
            }
        }

        return _arr;
    }

    function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === 'Object' && o.constructor) n = o.constructor.name;
        if (n === 'Map' || n === 'Set') return Array.from(o);
        if (
            n === 'Arguments' ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        )
            return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;

        for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

        return arr2;
    }

    function _nonIterableRest() {
        throw new TypeError(
            'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
        );
    }

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
            event.type === 'pointerup' ||
            event.type === 'pointerdown' ||
            event.type === 'pointermove' ||
            event.type === 'mousedown' ||
            event.type === 'mousemove' ||
            event.type === 'mouseup'
            ? event.clientX
            : event.changedTouches[0].clientX;
    }
    function eventClientY(event) {
        return event.type === 'wheel' ||
            event.type === 'pointerup' ||
            event.type === 'pointerdown' ||
            event.type === 'pointermove' ||
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
        var options =
            arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : {};
        this._dropHandler = this._dropHandler.bind(this);
        this._grabHandler = this._grabHandler.bind(this);
        this._moveHandler = this._moveHandler.bind(this);
        options.smoothExtinction = Number(options.smoothExtinction);
        if (isNaN(options.smoothExtinction)) options.smoothExtinction = 0.25;
        this.options = extendObject(
            {
                // smooth extinction
                smoothExtinction: 0.25,
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
              }; // for the touch screen we set the parameter forcibly

        this.events.options = this.isTouch
            ? {
                  passive: false,
              }
            : false;
        this.window = windowObject;
        this.content = contentObject;
        on(
            this.content.$element,
            this.events.grab,
            this._grabHandler,
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
            // if touch started (only one finger) or pressed left mouse button
            if (
                (this.isTouch && event.touches.length === 1) ||
                event.buttons === 1
            ) {
                event.preventDefault();
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
            }
        },
        _dropHandler: function _dropHandler(event) {
            event.preventDefault();
            this.isGrab = false;
            off(document, this.events.drop, this._dropHandler);
            off(document, this.events.move, this._moveHandler);

            if (typeof this.options.onDrop === 'function') {
                this.options.onDrop();
            }
        },
        _moveHandler: function _moveHandler(event) {
            // so that it does not move when the touch screen and more than one finger
            if (this.isTouch && event.touches.length > 1) return false;
            event.preventDefault();
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

            _transform(
                content.$element,
                {
                    left: content.currentLeft,
                    top: content.currentTop,
                    scale: content.currentScale,
                },
                this.options
            );

            coordinates.left = eventClientX(event);
            coordinates.top = eventClientY(event);

            if (typeof options.onMove === 'function') {
                options.onMove();
            }
        },
        destroy: function destroy() {
            off(
                this.content.$element,
                this.events.grab,
                this._grabHandler,
                this.events.options
            );

            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                    this[key] = null;
                }
            }
        },
    };

    function _transform($element, _ref, options) {
        var left = _ref.left,
            top = _ref.top,
            scale = _ref.scale;

        if (options.smoothExtinction) {
            $element.style.transition = 'transform '.concat(
                options.smoothExtinction,
                's'
            );
        } else {
            $element.style.removeProperty('transition');
        }

        $element.style.transform = 'translate3d('
            .concat(left, 'px, ')
            .concat(top, 'px, 0px) scale(')
            .concat(scale, ')');
    }

    /**
     * @class WZoom
     * @param {string|HTMLElement} selectorOrHTMLElement
     * @param {Object} options
     * @constructor
     */

    function WZoom(selectorOrHTMLElement) {
        var options =
            arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {};
        this._init = this._init.bind(this);
        this._prepare = this._prepare.bind(this);
        this._computeNewScale = this._computeNewScale.bind(this);
        this._computeNewPosition = this._computeNewPosition.bind(this);
        this._transform = this._transform.bind(this);
        this._wheelHandler = _wheelHandler.bind(this);
        this._downHandler = _downHandler.bind(this);
        this._upHandler = _upHandler.bind(this);
        this._zoomTwoFingers_TouchmoveHandler =
            _zoomTwoFingers_TouchmoveHandler.bind(this);
        this._zoomTwoFingers_TouchendHandler =
            _zoomTwoFingers_TouchendHandler.bind(this);
        /********************/

        /********************/

        this.content = {};
        this.window = {};
        this.isTouch = false;
        this.events = null;
        this.direction = 1;
        this.options = null;
        this.dragScrollable = null; // processing of the event "max / min zoom" begin only if there was really just a click
        // so as not to interfere with the DragScrollable module

        this.coordsOnMouseDown = null;
        /********************/

        /********************/

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
            // minimum allowed proportion of scale (computed auto if null)
            minScale: null,
            // maximum allowed proportion of scale (1 = 100% content size)
            maxScale: 1,
            // content resizing speed
            speed: 50,
            // zoom to maximum (minimum) size on click
            zoomOnClick: true,
            // if is true, then when the source image changes, the plugin will automatically restart init function (used with type = image)
            // attention: if false, it will work correctly only if the images are of the same size
            watchImageChange: true,
            // smooth extinction
            smoothExtinction: 0.3,
            // align content `center`, `left`, `top`, `right`, `bottom`
            alignContent: 'center',

            /********************/
            disableWheelZoom: false,
        };

        if (typeof selectorOrHTMLElement === 'string') {
            this.content.$element = document.querySelector(
                selectorOrHTMLElement
            );
        } else if (selectorOrHTMLElement instanceof HTMLElement) {
            this.content.$element = selectorOrHTMLElement;
        } else {
            throw 'WZoom: `selectorOrHTMLElement` must be selector or HTMLElement, and not '.concat(
                {}.toString.call(selectorOrHTMLElement)
            );
        } // check if we're using a touch screen

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
            options.smoothExtinction = Number(options.smoothExtinction);
            if (isNaN(options.smoothExtinction))
                options.smoothExtinction = defaults.smoothExtinction;
            this.options = extendObject(defaults, options);

            if (
                this.options.minScale &&
                this.options.minScale >= this.options.maxScale
            ) {
                this.options.minScale = null;
            } // for window take just the parent

            this.window.$element = this.content.$element.parentNode;

            if (this.options.type === 'image') {
                var initAlreadyDone = false; // if the `image` has already been loaded

                if (this.content.$element.complete) {
                    this._init();

                    initAlreadyDone = true;
                }

                if (
                    !initAlreadyDone ||
                    this.options.watchImageChange === true
                ) {
                    // even if the `image` has already been loaded (for "hotswap" of src support)
                    on(
                        this.content.$element,
                        'load',
                        this._init, // if watchImageChange == false listen add only until the first call
                        this.options.watchImageChange
                            ? false
                            : {
                                  once: true,
                              }
                    );
                }
            } else {
                this._init();
            }
        }
    }

    WZoom.prototype = {
        constructor: WZoom,
        _init: function _init() {
            this._prepare(); // support for zoom and pinch on touch screen devices

            if (this.isTouch) {
                this.fingersHypot = null;
                this.zoomPinchWasDetected = false;
                on(
                    this.content.$element,
                    'touchmove',
                    this._zoomTwoFingers_TouchmoveHandler
                );
                on(
                    this.content.$element,
                    'touchend',
                    this._zoomTwoFingers_TouchendHandler
                );
            }

            if (this.options.dragScrollable === true) {
                // this can happen if the src of this.content.$element (when type = image) is changed and repeat event load at image
                if (this.dragScrollable) {
                    this.dragScrollable.destroy();
                }

                this.setDragScrollable(
                    new DragScrollable(
                        this.window,
                        this.content,
                        this.options.dragScrollableOptions
                    )
                );
            }

            on(this.content.$element, 'wheel', this._wheelHandler);

            if (this.options.zoomOnClick) {
                on(
                    this.content.$element,
                    this.events.down,
                    this._downHandler,
                    this.events.options
                );
                on(
                    this.content.$element,
                    this.events.up,
                    this._upHandler,
                    this.events.options
                );
            }
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

            this.content.minScale =
                this.options.minScale ||
                Math.min(
                    this.window.originalWidth / this.content.originalWidth,
                    this.window.originalHeight / this.content.originalHeight
                );
            this.content.maxScale = this.options.maxScale; // current content sizes and transform data

            this.content.currentWidth =
                this.content.originalWidth * this.content.minScale;
            this.content.currentHeight =
                this.content.originalHeight * this.content.minScale;

            var _calculateAlignPoint2 = _calculateAlignPoint(
                    this.options,
                    this.content,
                    this.window
                ),
                _calculateAlignPoint3 = _slicedToArray(
                    _calculateAlignPoint2,
                    2
                ),
                alignPointX = _calculateAlignPoint3[0],
                alignPointY = _calculateAlignPoint3[1];

            this.content.alignPointX = alignPointX;
            this.content.alignPointY = alignPointY; // calculate indent-left and indent-top to of content from window borders

            var _calculateCorrectPoin = _calculateCorrectPoint(
                    this.options,
                    this.content,
                    this.window
                ),
                _calculateCorrectPoin2 = _slicedToArray(
                    _calculateCorrectPoin,
                    2
                ),
                correctX = _calculateCorrectPoin2[0],
                correctY = _calculateCorrectPoin2[1];

            this.content.correctX = correctX;
            this.content.correctY = correctY;
            this.content.currentLeft = this.content.alignPointX;
            this.content.currentTop = this.content.alignPointY;
            this.content.currentScale = this.content.minScale;
            this.content.$element.style.transform = 'translate3d('
                .concat(this.content.alignPointX, 'px, ')
                .concat(this.content.alignPointY, 'px, 0px) scale(')
                .concat(this.content.minScale, ')');

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

            if (contentNewScale < minScale) {
                this.direction = 1;
            } else if (contentNewScale > maxScale) {
                this.direction = -1;
            }

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

            if (this.direction === -1) {
                switch (this.options.alignContent) {
                    case 'left':
                        if (
                            contentNewWidth / 2 - contentNewLeft <
                            window.originalWidth / 2
                        ) {
                            contentNewLeft =
                                (contentNewWidth - window.originalWidth) / 2;
                        }

                        break;

                    case 'right':
                        if (
                            contentNewWidth / 2 + contentNewLeft <
                            window.originalWidth / 2
                        ) {
                            contentNewLeft =
                                ((contentNewWidth - window.originalWidth) / 2) *
                                -1;
                        }

                        break;

                    default:
                        if (
                            (contentNewWidth - window.originalWidth) / 2 +
                                content.correctX <
                            Math.abs(contentNewLeft)
                        ) {
                            var positive = contentNewLeft < 0 ? -1 : 1;
                            contentNewLeft =
                                ((contentNewWidth - window.originalWidth) / 2 +
                                    content.correctX) *
                                positive;
                        }
                }
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

            switch (this.options.alignContent) {
                case 'top':
                    if (
                        contentNewHeight / 2 - contentNewTop <
                        window.originalHeight / 2
                    ) {
                        contentNewTop =
                            (contentNewHeight - window.originalHeight) / 2;
                    }

                    break;

                case 'bottom':
                    if (
                        contentNewHeight / 2 + contentNewTop <
                        window.originalHeight / 2
                    ) {
                        contentNewTop =
                            ((contentNewHeight - window.originalHeight) / 2) *
                            -1;
                    }

                    break;

                default:
                    if (
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
            }

            if (contentNewScale === this.content.minScale) {
                contentNewLeft = this.content.alignPointX;
                contentNewTop = this.content.alignPointY;
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
            _ref2.currentLeft;
            var newLeft = _ref2.newLeft;
            _ref2.currentTop;
            var newTop = _ref2.newTop;
            _ref2.currentScale;
            var newScale = _ref2.newScale;

            if (this.options.smoothExtinction) {
                this.content.$element.style.transition = 'transform '.concat(
                    this.options.smoothExtinction,
                    's'
                );
            } else {
                this.content.$element.style.removeProperty('transition');
            }

            this.content.$element.style.transform = 'translate3d('
                .concat(newLeft, 'px, ')
                .concat(newTop, 'px, 0px) scale(')
                .concat(newScale, ')');

            if (typeof this.options.rescale === 'function') {
                this.options.rescale();
            }
        },
        _zoom: function _zoom(scale) {
            var windowPosition = getElementPosition(this.window.$element);
            var window = this.window;
            var _document2 = document,
                body = _document2.body,
                documentElement = _document2.documentElement;
            var scrollLeft =
                window.pageXOffset ||
                documentElement.scrollLeft ||
                body.scrollLeft;
            var scrollTop =
                window.pageYOffset ||
                documentElement.scrollTop ||
                body.scrollTop;

            this._transform(
                this._computeNewPosition(scale, {
                    x:
                        windowPosition.left +
                        this.window.originalWidth / 2 -
                        scrollLeft,
                    y:
                        windowPosition.top +
                        this.window.originalHeight / 2 -
                        scrollTop,
                })
            );
        },
        prepare: function prepare() {
            this._prepare();
        },
        zoomUp: function zoomUp() {
            this._zoom(this._computeNewScale(-1));
        },
        zoomDown: function zoomDown() {
            this._zoom(this._computeNewScale(1));
        },
        maxZoomUp: function maxZoomUp() {
            this._zoom(this.content.maxScale);
        },
        maxZoomDown: function maxZoomDown() {
            this._zoom(this.content.minScale);
        },
        setDragScrollable: function setDragScrollable(dragScrollable) {
            this.dragScrollable = dragScrollable;
        },
        destroy: function destroy() {
            this.content.$element.style.transform = '';

            if (this.options.type === 'image') {
                off(this.content.$element, 'load', this._init);
            }

            if (this.isTouch) {
                off(
                    this.content.$element,
                    'touchmove',
                    this._zoomTwoFingers_TouchmoveHandler
                );
                off(
                    this.content.$element,
                    'touchend',
                    this._zoomTwoFingers_TouchendHandler
                );
            }

            off(this.content.$element, 'wheel', this._wheelHandler);

            if (this.options.zoomOnClick) {
                off(
                    this.content.$element,
                    this.events.down,
                    this._downHandler,
                    this.events.options
                );
                off(
                    this.content.$element,
                    this.events.up,
                    this._upHandler,
                    this.events.options
                );
            }

            if (this.dragScrollable) {
                this.dragScrollable.destroy();
            }

            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                    this[key] = null;
                }
            }
        },
    };

    function _wheelHandler(event) {
        if (!this.options.disableWheelZoom) {
            event.preventDefault();

            this._transform(
                this._computeNewPosition(this._computeNewScale(event.deltaY), {
                    x: eventClientX(event),
                    y: eventClientY(event),
                })
            );
        }
    }

    function _downHandler(event) {
        if (
            (this.isTouch && event.touches.length === 1) ||
            event.buttons === 1
        ) {
            this.coordsOnMouseDown = {
                x: eventClientX(event),
                y: eventClientY(event),
            };
        }
    }

    function _upHandler(event) {
        if (
            this.coordsOnMouseDown &&
            this.coordsOnMouseDown.x === eventClientX(event) &&
            this.coordsOnMouseDown.y === eventClientY(event)
        ) {
            this._transform(
                this._computeNewPosition(
                    this.direction === 1
                        ? this.content.maxScale
                        : this.content.minScale,
                    {
                        x: eventClientX(event),
                        y: eventClientY(event),
                    }
                )
            );

            this.direction *= -1;
        }

        this.coordsOnMouseDown = null;
    }

    function _zoomTwoFingers_TouchmoveHandler(event) {
        // detect two fingers
        if (event.targetTouches.length === 2) {
            var pageX1 = event.targetTouches[0].clientX;
            var pageY1 = event.targetTouches[0].clientY;
            var pageX2 = event.targetTouches[1].clientX;
            var pageY2 = event.targetTouches[1].clientY; // Math.hypot() analog

            var fingersHypotNew = Math.round(
                Math.sqrt(
                    Math.pow(Math.abs(pageX1 - pageX2), 2) +
                        Math.pow(Math.abs(pageY1 - pageY2), 2)
                )
            );
            var direction = 0;
            if (fingersHypotNew > this.fingersHypot + 5) direction = -1;
            if (fingersHypotNew < this.fingersHypot - 5) direction = 1;

            if (direction !== 0) {
                if (this.fingersHypot !== null || direction === 1) {
                    var eventEmulator = new Event('wheel'); // sized direction

                    eventEmulator.deltaY = direction; // middle position between fingers

                    eventEmulator.clientX =
                        Math.min(pageX1, pageX2) +
                        Math.abs(pageX1 - pageX2) / 2;
                    eventEmulator.clientY =
                        Math.min(pageY1, pageY2) +
                        Math.abs(pageY1 - pageY2) / 2;

                    this._wheelHandler(eventEmulator);
                }

                this.fingersHypot = fingersHypotNew;
                this.zoomPinchWasDetected = true;
            }
        }
    }

    function _zoomTwoFingers_TouchendHandler() {
        if (this.zoomPinchWasDetected) {
            this.fingersHypot = null;
            this.zoomPinchWasDetected = false;
        }
    }

    function _calculateAlignPoint(options, content, window) {
        var alignPointX = 0;
        var alignPointY = 0;

        switch (options.alignContent) {
            case 'left':
                alignPointX = (content.currentWidth - window.originalWidth) / 2;
                break;

            case 'top':
                alignPointY =
                    (content.currentHeight - window.originalHeight) / 2;
                break;

            case 'right':
                alignPointX =
                    ((content.currentWidth - window.originalWidth) / 2) * -1;
                break;

            case 'bottom':
                alignPointY =
                    ((content.currentHeight - window.originalHeight) / 2) * -1;
                break;
        }

        return [alignPointX, alignPointY];
    }

    function _calculateCorrectPoint(options, content, window) {
        var correctX = Math.max(
            0,
            (window.originalWidth - content.currentWidth) / 2
        );
        var correctY = Math.max(
            0,
            (window.originalHeight - content.currentHeight) / 2
        );
        if (options.alignContent === 'left') correctX = correctX * 2;
        else if (options.alignContent === 'right') correctX = 0;
        if (options.alignContent === 'bottom') correctY = correctY * 2;
        else if (options.alignContent === 'top') correctY = 0;
        return [correctX, correctY];
    }
    /**
     * Create WZoom instance
     * @param {string|HTMLElement} selectorOrHTMLElement
     * @param {Object} [options]
     * @returns {WZoom}
     */

    WZoom.create = function (selectorOrHTMLElement, options) {
        return new WZoom(selectorOrHTMLElement, options);
    };

    return WZoom;
});
