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

    function _iterableToArrayLimit(arr, i) {
        var _i =
            null == arr
                ? null
                : ('undefined' != typeof Symbol && arr[Symbol.iterator]) ||
                  arr['@@iterator'];
        if (null != _i) {
            var _s,
                _e,
                _x,
                _r,
                _arr = [],
                _n = !0,
                _d = !1;
            try {
                if (((_x = (_i = _i.call(arr)).next), 0 === i)) {
                    if (Object(_i) !== _i) return;
                    _n = !1;
                } else
                    for (
                        ;
                        !(_n = (_s = _x.call(_i)).done) &&
                        (_arr.push(_s.value), _arr.length !== i);
                        _n = !0
                    );
            } catch (err) {
                (_d = !0), (_e = err);
            } finally {
                try {
                    if (
                        !_n &&
                        null != _i.return &&
                        ((_r = _i.return()), Object(_r) !== _r)
                    )
                        return;
                } finally {
                    if (_d) throw _e;
                }
            }
            return _arr;
        }
    }
    function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(object);
            enumerableOnly &&
                (symbols = symbols.filter(function (sym) {
                    return Object.getOwnPropertyDescriptor(
                        object,
                        sym
                    ).enumerable;
                })),
                keys.push.apply(keys, symbols);
        }
        return keys;
    }
    function _objectSpread2(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = null != arguments[i] ? arguments[i] : {};
            i % 2
                ? ownKeys(Object(source), !0).forEach(function (key) {
                      _defineProperty(target, key, source[key]);
                  })
                : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                      target,
                      Object.getOwnPropertyDescriptors(source)
                  )
                : ownKeys(Object(source)).forEach(function (key) {
                      Object.defineProperty(
                          target,
                          key,
                          Object.getOwnPropertyDescriptor(source, key)
                      );
                  });
        }
        return target;
    }
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function');
        }
    }
    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ('value' in descriptor) descriptor.writable = true;
            Object.defineProperty(
                target,
                _toPropertyKey(descriptor.key),
                descriptor
            );
        }
    }
    function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, 'prototype', {
            writable: false,
        });
        return Constructor;
    }
    function _defineProperty(obj, key, value) {
        key = _toPropertyKey(key);
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true,
            });
        } else {
            obj[key] = value;
        }
        return obj;
    }
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
    function _createForOfIteratorHelper(o, allowArrayLike) {
        var it =
            (typeof Symbol !== 'undefined' && o[Symbol.iterator]) ||
            o['@@iterator'];
        if (!it) {
            if (
                Array.isArray(o) ||
                (it = _unsupportedIterableToArray(o)) ||
                (allowArrayLike && o && typeof o.length === 'number')
            ) {
                if (it) o = it;
                var i = 0;
                var F = function () {};
                return {
                    s: F,
                    n: function () {
                        if (i >= o.length)
                            return {
                                done: true,
                            };
                        return {
                            done: false,
                            value: o[i++],
                        };
                    },
                    e: function (e) {
                        throw e;
                    },
                    f: F,
                };
            }
            throw new TypeError(
                'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
            );
        }
        var normalCompletion = true,
            didErr = false,
            err;
        return {
            s: function () {
                it = it.call(o);
            },
            n: function () {
                var step = it.next();
                normalCompletion = step.done;
                return step;
            },
            e: function (e) {
                didErr = true;
                err = e;
            },
            f: function () {
                try {
                    if (!normalCompletion && it.return != null) it.return();
                } finally {
                    if (didErr) throw err;
                }
            },
        };
    }
    function _toPrimitive(input, hint) {
        if (typeof input !== 'object' || input === null) return input;
        var prim = input[Symbol.toPrimitive];
        if (prim !== undefined) {
            var res = prim.call(input, hint || 'default');
            if (typeof res !== 'object') return res;
            throw new TypeError('@@toPrimitive must return a primitive value.');
        }
        return (hint === 'string' ? String : Number)(input);
    }
    function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, 'string');
        return typeof key === 'symbol' ? key : String(key);
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
        var scrollTop = getPageScrollTop();
        var scrollLeft = getPageScrollLeft();
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
     * Get page scroll left
     * @returns {number}
     */
    function getPageScrollLeft() {
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = (document.compatMode || '') === 'CSS1Compat';
        return supportPageOffset
            ? window.pageXOffset
            : isCSS1Compat
            ? document.documentElement.scrollLeft
            : document.body.scrollLeft;
    }

    /**
     * Get page scroll top
     * @returns {number}
     */
    function getPageScrollTop() {
        var supportPageOffset = window.pageYOffset !== undefined;
        var isCSS1Compat = (document.compatMode || '') === 'CSS1Compat';
        return supportPageOffset
            ? window.pageYOffset
            : isCSS1Compat
            ? document.documentElement.scrollTop
            : document.body.scrollTop;
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

    /**
     * @returns {boolean}
     */
    function isTouch() {
        return (
            'ontouchstart' in window ||
            navigator.MaxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        );
    }

    /**
     * @param {Event} event
     * @returns {number}
     */
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

    /**
     * @param {Event} event
     * @returns {number}
     */
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
     * @param {WZoomViewport} viewport
     * @param {WZoomContent} content
     * @param {string} align
     * @returns {number[]}
     */
    function calculateAlignPoint(viewport, content, align) {
        var pointX = 0;
        var pointY = 0;
        switch (align) {
            case 'top':
                pointY = (content.currentHeight - viewport.originalHeight) / 2;
                break;
            case 'right':
                pointX =
                    ((content.currentWidth - viewport.originalWidth) / 2) * -1;
                break;
            case 'bottom':
                pointY =
                    ((content.currentHeight - viewport.originalHeight) / 2) *
                    -1;
                break;
            case 'left':
                pointX = (content.currentWidth - viewport.originalWidth) / 2;
                break;
        }
        return [pointX, pointY];
    }

    /**
     * @param {WZoomViewport} viewport
     * @param {WZoomContent} content
     * @param {string} align
     * @returns {number[]}
     */
    function calculateCorrectPoint(viewport, content, align) {
        var pointX = Math.max(
            0,
            (viewport.originalWidth - content.currentWidth) / 2
        );
        var pointY = Math.max(
            0,
            (viewport.originalHeight - content.currentHeight) / 2
        );
        switch (align) {
            case 'top':
                pointY = 0;
                break;
            case 'right':
                pointX = 0;
                break;
            case 'bottom':
                pointY = pointY * 2;
                break;
            case 'left':
                pointX = pointX * 2;
                break;
        }
        return [pointX, pointY];
    }

    /**
     * @returns {number}
     */
    function calculateContentShift(
        axisValue,
        axisScroll,
        axisViewportPosition,
        axisContentPosition,
        originalViewportSize,
        contentSizeRatio
    ) {
        var viewportShift = axisValue + axisScroll - axisViewportPosition;
        var centerViewportShift = originalViewportSize / 2 - viewportShift;
        var centerContentShift = centerViewportShift + axisContentPosition;
        return (
            centerContentShift * contentSizeRatio -
            centerContentShift +
            axisContentPosition
        );
    }
    function calculateContentMaxShift(
        align,
        originalViewportSize,
        correctCoordinate,
        size,
        shift
    ) {
        switch (align) {
            case 'left':
                if (size / 2 - shift < originalViewportSize / 2) {
                    shift = (size - originalViewportSize) / 2;
                }
                break;
            case 'right':
                if (size / 2 + shift < originalViewportSize / 2) {
                    shift = ((size - originalViewportSize) / 2) * -1;
                }
                break;
            default:
                if (
                    (size - originalViewportSize) / 2 + correctCoordinate <
                    Math.abs(shift)
                ) {
                    var positive = shift < 0 ? -1 : 1;
                    shift =
                        ((size - originalViewportSize) / 2 +
                            correctCoordinate) *
                        positive;
                }
        }
        return shift;
    }

    /**
     * @param {WZoomViewport} viewport
     * @returns {{x: number, y: number}}
     */
    function calculateViewportCenter(viewport) {
        var viewportPosition = getElementPosition(viewport.$element);
        return {
            x:
                viewportPosition.left +
                viewport.originalWidth / 2 -
                getPageScrollLeft(),
            y:
                viewportPosition.top +
                viewport.originalHeight / 2 -
                getPageScrollTop(),
        };
    }

    /** @type {WZoomOptions} */
    var wZoomDefaultOptions = {
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
        // zoom to maximum (minimum) size on double click
        zoomOnDblClick: false,
        // if is true, then when the source image changes, the plugin will automatically restart init function (used with type = image)
        // attention: if false, it will work correctly only if the images are of the same size
        watchImageChange: true,
        // smooth extinction
        smoothExtinction: 0.3,
        // align content `center`, `left`, `top`, `right`, `bottom`
        alignContent: 'center',
        /********************/
        disableWheelZoom: false,
        // option to reverse wheel direction
        reverseWheelDirection: false,
    };

    /** @type {DragScrollableOptions} */
    var dragScrollableDefaultOptions = {
        // smooth extinction
        smoothExtinction: 0.25,
        // callback triggered when grabbing an element
        onGrab: null,
        // callback triggered when moving an element
        onMove: null,
        // callback triggered when dropping an element
        onDrop: null,
    };

    /**
     * @typedef WZoomOptions
     * @type {Object}
     * @property {string} type
     * @property {?number} width
     * @property {?number} height
     * @property {boolean} dragScrollable
     * @property {DragScrollableOptions} dragScrollableOptions
     * @property {?number} minScale
     * @property {number} maxScale
     * @property {number} speed
     * @property {boolean} zoomOnClick
     * @property {boolean} zoomOnDblClick
     * @property {boolean} watchImageChange
     * @property {number} smoothExtinction
     * @property {string} alignContent
     * @property {boolean} disableWheelZoom
     * @property {boolean} reverseWheelDirection
     */

    /**
     * @typedef DragScrollableOptions
     * @type {Object}
     * @property {number} smoothExtinction
     * @property {?Function} onGrab
     * @property {?Function} onMove
     * @property {?Function} onDrop
     */

    var DragScrollable = /*#__PURE__*/ (function () {
        /**
         * @param {WZoomViewport} viewport
         * @param {WZoomContent} content
         * @param {DragScrollableOptions} options
         * @constructor
         */
        function DragScrollable(viewport, content) {
            var options =
                arguments.length > 2 && arguments[2] !== undefined
                    ? arguments[2]
                    : {};
            _classCallCheck(this, DragScrollable);
            this._dropHandler = this._dropHandler.bind(this);
            this._grabHandler = this._grabHandler.bind(this);
            this._moveHandler = this._moveHandler.bind(this);

            /** @type {WZoomViewport} */
            this.viewport = viewport;
            /** @type {WZoomContent} */
            this.content = content;

            /** @type {DragScrollableOptions} */
            this.options = Object.assign(
                {},
                dragScrollableDefaultOptions,
                options
            );
            this.isGrab = false;
            this.moveTimer = null;
            this.coordinates = null;
            this.coordinatesShift = null;

            // check if we're using a touch screen
            this.isTouch = isTouch();
            // switch to touch events if using a touch screen
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
                  };
            // for the touch screen we set the parameter forcibly
            this.events.options = this.isTouch
                ? {
                      passive: false,
                  }
                : false;
            on(
                this.content.$element,
                this.events.grab,
                this._grabHandler,
                this.events.options
            );
        }
        _createClass(DragScrollable, [
            {
                key: 'destroy',
                value: function destroy() {
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

                /**
                 * @param {Event} event
                 * @private
                 */
            },
            {
                key: '_grabHandler',
                value: function _grabHandler(event) {
                    // if touch started (only one finger) or pressed left mouse button
                    if (
                        (this.isTouch && event.touches.length === 1) ||
                        event.buttons === 1
                    ) {
                        event.preventDefault();
                        this.isGrab = true;
                        this.coordinates = {
                            x: eventClientX(event),
                            y: eventClientY(event),
                        };
                        this.coordinatesShift = {
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
                            this.options.onGrab(event);
                        }
                    }
                },

                /**
                 * @param {Event} event
                 * @private
                 */
            },
            {
                key: '_dropHandler',
                value: function _dropHandler(event) {
                    event.preventDefault();
                    this.isGrab = false;
                    off(document, this.events.drop, this._dropHandler);
                    off(document, this.events.move, this._moveHandler);
                    if (typeof this.options.onDrop === 'function') {
                        this.options.onDrop(event);
                    }
                },

                /**
                 * @param {Event} event
                 * @private
                 */
            },
            {
                key: '_moveHandler',
                value: function _moveHandler(event) {
                    // so that it does not move when the touch screen and more than one finger
                    if (this.isTouch && event.touches.length > 1) return false;
                    event.preventDefault();
                    var viewport = this.viewport,
                        content = this.content,
                        coordinatesShift = this.coordinatesShift,
                        coordinates = this.coordinates,
                        options = this.options;

                    // change of the coordinate of the mouse cursor along the X/Y axis
                    coordinatesShift.x = eventClientX(event) - coordinates.x;
                    coordinatesShift.y = eventClientY(event) - coordinates.y;
                    coordinates.x = eventClientX(event);
                    coordinates.y = eventClientY(event);
                    clearTimeout(this.moveTimer);

                    // reset shift if cursor stops
                    this.moveTimer = setTimeout(function () {
                        coordinatesShift.x = 0;
                        coordinatesShift.y = 0;
                    }, 50);
                    var contentNewLeft =
                        content.currentLeft + coordinatesShift.x;
                    var contentNewTop = content.currentTop + coordinatesShift.y;
                    var maxAvailableLeft =
                        (content.currentWidth - viewport.originalWidth) / 2 +
                        content.correctX;
                    var maxAvailableTop =
                        (content.currentHeight - viewport.originalHeight) / 2 +
                        content.correctY;

                    // if we do not go beyond the permissible boundaries of the viewport
                    if (Math.abs(contentNewLeft) <= maxAvailableLeft)
                        content.currentLeft = contentNewLeft;

                    // if we do not go beyond the permissible boundaries of the viewport
                    if (Math.abs(contentNewTop) <= maxAvailableTop)
                        content.currentTop = contentNewTop;
                    transform(
                        content.$element,
                        content.currentLeft,
                        content.currentTop,
                        content.currentScale,
                        this.options.smoothExtinction
                    );
                    if (typeof options.onMove === 'function') {
                        options.onMove(event);
                    }
                },
            },
        ]);
        return DragScrollable;
    })();
    /**
     * @param {HTMLElement} $element
     * @param {number} left
     * @param {number} top
     * @param {number} scale
     * @param {number} smoothExtinction
     */
    function transform($element, left, top, scale, smoothExtinction) {
        if (smoothExtinction) {
            $element.style.transition = 'transform '.concat(
                smoothExtinction,
                's'
            );
        } else {
            $element.style.removeProperty('transition');
        }
        $element.style.transform = 'translate('
            .concat(left, 'px, ')
            .concat(top, 'px) scale(')
            .concat(scale, ')');
    }

    var EVENT_CLICK = 'click';
    var EVENT_DBLCLICK = 'dblclick';
    var EVENT_WHEEL = 'wheel';
    var EVENT_PINCH_TO_ZOOM = 'pinchtozoom';
    var Interactor = /*#__PURE__*/ (function () {
        /**
         * @param {HTMLElement} target
         * @constructor
         */
        function Interactor(target) {
            _classCallCheck(this, Interactor);
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
                ? {
                      down: 'touchstart',
                      up: 'touchend',
                  }
                : {
                      down: 'mousedown',
                      up: 'mouseup',
                  };
            // if using touch screen tells the browser that the default action will not be undone
            this.events.options = this.isTouch
                ? {
                      passive: true,
                  }
                : false;
            this._downHandler = this._downHandler.bind(this);
            this._upHandler = this._upHandler.bind(this);
            this._wheelHandler = this._wheelHandler.bind(this);
            this._touchMoveHandler = this._touchMoveHandler.bind(this);
            this._touchEndHandler = this._touchEndHandler.bind(this);
            on(
                this.target,
                this.events.down,
                this._downHandler,
                this.events.options
            );
            on(
                this.target,
                this.events.up,
                this._upHandler,
                this.events.options
            );
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
        _createClass(Interactor, [
            {
                key: 'on',
                value: function on(eventType, eventHandler) {
                    if (!(eventType in this.subscribes)) {
                        this.subscribes[eventType] = [];
                    }
                    this.subscribes[eventType].push(eventHandler);
                    return this;
                },
            },
            {
                key: 'destroy',
                value: function destroy() {
                    off(
                        this.target,
                        this.events.down,
                        this._downHandler,
                        this.events.options
                    );
                    off(
                        this.target,
                        this.events.up,
                        this._upHandler,
                        this.events.options
                    );
                    off(
                        this.target,
                        EVENT_WHEEL,
                        this._wheelHandler,
                        this.events.options
                    );
                    if (this.isTouch) {
                        off(this.target, 'touchmove', this._touchMoveHandler);
                        off(this.target, 'touchend', this._touchEndHandler);
                    }
                    for (var key in this) {
                        if (this.hasOwnProperty(key)) {
                            this[key] = null;
                        }
                    }
                },

                /**
                 * @param {string} eventType
                 * @param {Event} event
                 * @private
                 */
            },
            {
                key: '_run',
                value: function _run(eventType, event) {
                    if (this.subscribes[eventType]) {
                        var _iterator = _createForOfIteratorHelper(
                                this.subscribes[eventType]
                            ),
                            _step;
                        try {
                            for (
                                _iterator.s();
                                !(_step = _iterator.n()).done;

                            ) {
                                var eventHandler = _step.value;
                                eventHandler(event);
                            }
                        } catch (err) {
                            _iterator.e(err);
                        } finally {
                            _iterator.f();
                        }
                    }
                },

                /**
                 * @param {TouchEvent|MouseEvent|PointerEvent} event
                 * @private
                 */
            },
            {
                key: '_downHandler',
                value: function _downHandler(event) {
                    this.coordsOnDown = null;
                    if (
                        (this.isTouch && event.touches.length === 1) ||
                        event.buttons === 1
                    ) {
                        this.coordsOnDown = {
                            x: eventClientX(event),
                            y: eventClientY(event),
                        };
                    }
                    clearTimeout(this.pressingTimeout);
                },

                /**
                 * @param {TouchEvent|MouseEvent|PointerEvent} event
                 * @private
                 */
            },
            {
                key: '_upHandler',
                value: function _upHandler(event) {
                    var _this = this;
                    var delay = this.subscribes[EVENT_DBLCLICK] ? 200 : 0;
                    if (this.firstClick) {
                        this.pressingTimeout = setTimeout(function () {
                            if (
                                _this.coordsOnDown &&
                                _this.coordsOnDown.x === eventClientX(event) &&
                                _this.coordsOnDown.y === eventClientY(event)
                            ) {
                                _this._run(EVENT_CLICK, event);
                            }
                            _this.firstClick = true;
                        }, delay);
                        this.firstClick = false;
                    } else {
                        this.pressingTimeout = setTimeout(function () {
                            _this._run(EVENT_DBLCLICK, event);
                            _this.firstClick = true;
                        }, delay / 2);
                    }
                },

                /**
                 * @param {WheelEvent} event
                 * @private
                 */
            },
            {
                key: '_wheelHandler',
                value: function _wheelHandler(event) {
                    this._run(EVENT_WHEEL, event);
                },

                /**
                 * @param {TouchEvent|PointerEvent} event
                 * @private
                 */
            },
            {
                key: '_touchMoveHandler',
                value: function _touchMoveHandler(event) {
                    // detect two fingers
                    if (event.targetTouches.length === 2) {
                        var pageX1 = event.targetTouches[0].clientX;
                        var pageY1 = event.targetTouches[0].clientY;
                        var pageX2 = event.targetTouches[1].clientX;
                        var pageY2 = event.targetTouches[1].clientY;

                        // Math.hypot() analog
                        var fingersHypotNew = Math.round(
                            Math.sqrt(
                                Math.pow(Math.abs(pageX1 - pageX2), 2) +
                                    Math.pow(Math.abs(pageY1 - pageY2), 2)
                            )
                        );
                        var direction = 0;
                        if (fingersHypotNew > this.fingersHypot + 5)
                            direction = -1;
                        if (fingersHypotNew < this.fingersHypot - 5)
                            direction = 1;
                        if (direction !== 0) {
                            if (this.fingersHypot !== null || direction === 1) {
                                // middle position between fingers
                                var clientX =
                                    Math.min(pageX1, pageX2) +
                                    Math.abs(pageX1 - pageX2) / 2;
                                var clientY =
                                    Math.min(pageY1, pageY2) +
                                    Math.abs(pageY1 - pageY2) / 2;
                                event.data = _objectSpread2(
                                    _objectSpread2({}, event.data || {}),
                                    {},
                                    {
                                        clientX: clientX,
                                        clientY: clientY,
                                        direction: direction,
                                    }
                                );
                                this._run(EVENT_PINCH_TO_ZOOM, event);
                            }
                            this.fingersHypot = fingersHypotNew;
                            this.zoomPinchWasDetected = true;
                        }
                    }
                },

                /**
                 * @private
                 */
            },
            {
                key: '_touchEndHandler',
                value: function _touchEndHandler() {
                    if (this.zoomPinchWasDetected) {
                        this.fingersHypot = null;
                        this.zoomPinchWasDetected = false;
                    }
                },
            },
        ]);
        return Interactor;
    })();

    /**
     * @class WZoom
     * @param {string|HTMLElement} selectorOrHTMLElement
     * @param {WZoomOptions} options
     * @constructor
     */
    function WZoom(selectorOrHTMLElement) {
        var options =
            arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {};
        this._init = this._init.bind(this);
        this._prepare = this._prepare.bind(this);
        this._computeScale = this._computeScale.bind(this);
        this._computePosition = this._computePosition.bind(this);
        this._transition = this._transition.bind(this);
        this._transform = this._transform.bind(this);

        /** @type {WZoomContent} */
        this.content = {};
        this.content.elementInteractor = null;
        /** @type {WZoomViewport} */
        this.viewport = {};
        /** @type {WZoomOptions} */
        this.options = Object.assign({}, wZoomDefaultOptions, options);
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
        }

        // check if we're using a touch screen
        this.isTouch = isTouch();
        this.direction = 1;
        this.dragScrollable = null;
        if (this.content.$element) {
            // todo не нравится это место для этого действия
            if (
                this.options.minScale &&
                this.options.minScale >= this.options.maxScale
            ) {
                this.options.minScale = null;
            }

            // for viewport take just the parent
            this.viewport.$element = this.content.$element.parentNode;
            if (this.options.type === 'image') {
                var initAlreadyDone = false;

                // if the `image` has already been loaded
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
                        this._init,
                        // if watchImageChange == false listen add only until the first call
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
        /**
         * @private
         */
        _init: function _init() {
            var _this = this;
            this._prepare();
            if (this.content.elementInteractor) {
                this.content.elementInteractor.destroy();
            }
            this.content.elementInteractor = new Interactor(
                this.content.$element
            );
            if (this.options.dragScrollable === true) {
                // this can happen if the src of this.content.$element (when type = image) is changed and repeat event load at image
                if (this.dragScrollable) {
                    this.dragScrollable.destroy();
                }
                this.dragScrollable = new DragScrollable(
                    this.viewport,
                    this.content,
                    this.options.dragScrollableOptions
                );
            }
            if (!this.options.disableWheelZoom) {
                // support for zoom and pinch on touch screen devices
                if (this.isTouch) {
                    this.content.elementInteractor.on(
                        'pinchtozoom',
                        function (event) {
                            var _event$data = event.data,
                                clientX = _event$data.clientX,
                                clientY = _event$data.clientY,
                                direction = _event$data.direction;
                            var scale = _this._computeScale(direction);
                            var position = _this._computePosition(
                                scale,
                                clientX,
                                clientY
                            );
                            _this._transition();
                            _this._transform(
                                position.left,
                                position.top,
                                scale
                            );
                        }
                    );
                }
                this.content.elementInteractor.on('wheel', function (event) {
                    event.preventDefault();
                    var direction = _this.options.reverseWheelDirection
                        ? -event.deltaY
                        : event.deltaY;
                    var scale = _this._computeScale(direction);
                    var position = _this._computePosition(
                        scale,
                        eventClientX(event),
                        eventClientY(event)
                    );
                    _this._transition();
                    _this._transform(position.left, position.top, scale);
                });
            }
            if (this.options.zoomOnClick || this.options.zoomOnDblClick) {
                var eventType = this.options.zoomOnDblClick
                    ? 'dblclick'
                    : 'click';
                this.content.elementInteractor.on(eventType, function (event) {
                    var scale =
                        _this.direction === 1
                            ? _this.content.maxScale
                            : _this.content.minScale;
                    var position = _this._computePosition(
                        scale,
                        eventClientX(event),
                        eventClientY(event)
                    );
                    _this._transition();
                    _this._transform(position.left, position.top, scale);
                    _this.direction *= -1;
                });
            }
        },
        /**
         * @private
         */
        _prepare: function _prepare() {
            var viewportPosition = getElementPosition(this.viewport.$element);

            // original viewport sizes and position
            this.viewport.originalWidth = this.viewport.$element.offsetWidth;
            this.viewport.originalHeight = this.viewport.$element.offsetHeight;
            this.viewport.positionLeft = viewportPosition.left;
            this.viewport.positionTop = viewportPosition.top;

            // original content sizes
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
            }

            // minScale && maxScale
            this.content.minScale =
                this.options.minScale ||
                Math.min(
                    this.viewport.originalWidth / this.content.originalWidth,
                    this.viewport.originalHeight / this.content.originalHeight
                );
            this.content.maxScale = this.options.maxScale;

            // current content sizes and transform data
            this.content.currentWidth =
                this.content.originalWidth * this.content.minScale;
            this.content.currentHeight =
                this.content.originalHeight * this.content.minScale;
            var _calculateAlignPoint = calculateAlignPoint(
                this.viewport,
                this.content,
                this.options.alignContent
            );
            var _calculateAlignPoint2 = _slicedToArray(_calculateAlignPoint, 2);
            this.content.alignPointX = _calculateAlignPoint2[0];
            this.content.alignPointY = _calculateAlignPoint2[1];
            var _calculateCorrectPoin = calculateCorrectPoint(
                this.viewport,
                this.content,
                this.options.alignContent
            );
            var _calculateCorrectPoin2 = _slicedToArray(
                _calculateCorrectPoin,
                2
            );
            this.content.correctX = _calculateCorrectPoin2[0];
            this.content.correctY = _calculateCorrectPoin2[1];
            this.content.currentLeft = this.content.alignPointX;
            this.content.currentTop = this.content.alignPointY;
            this.content.currentScale = this.content.minScale;
            if (typeof this.options.prepare === 'function') {
                this.options.prepare();
            }
            this._transform(
                this.content.alignPointX,
                this.content.alignPointY,
                this.content.minScale
            );
        },
        /**
         * @private
         */
        _computeScale: function _computeScale(direction) {
            this.direction = direction < 0 ? 1 : -1;
            var _this$content = this.content,
                minScale = _this$content.minScale,
                maxScale = _this$content.maxScale,
                currentScale = _this$content.currentScale;
            var scale = currentScale + this.direction / this.options.speed;
            if (scale < minScale) {
                this.direction = 1;
                return minScale;
            }
            if (scale > maxScale) {
                this.direction = -1;
                return maxScale;
            }
            return scale;
        },
        /**
         * @param {number} scale
         * @param {number} x
         * @param {number} y
         * @returns {{top: number, left: number}}
         * @private
         */
        _computePosition: function _computePosition(scale, x, y) {
            var viewport = this.viewport,
                content = this.content,
                options = this.options,
                direction = this.direction;
            var contentNewWidth = content.originalWidth * scale;
            var contentNewHeight = content.originalHeight * scale;
            var scrollLeft = getPageScrollLeft();
            var scrollTop = getPageScrollTop();

            // calculate the parameters along the X axis
            var contentNewLeft = calculateContentShift(
                x,
                scrollLeft,
                viewport.positionLeft,
                content.currentLeft,
                viewport.originalWidth,
                contentNewWidth / content.currentWidth
            );
            // calculate the parameters along the Y axis
            var contentNewTop = calculateContentShift(
                y,
                scrollTop,
                viewport.positionTop,
                content.currentTop,
                viewport.originalHeight,
                contentNewHeight / content.currentHeight
            );
            if (direction === -1) {
                // check that the content does not go beyond the X axis
                contentNewLeft = calculateContentMaxShift(
                    options.alignContent,
                    viewport.originalWidth,
                    content.correctX,
                    contentNewWidth,
                    contentNewLeft
                );
                // check that the content does not go beyond the Y axis
                contentNewTop = calculateContentMaxShift(
                    options.alignContent,
                    viewport.originalHeight,
                    content.correctY,
                    contentNewHeight,
                    contentNewTop
                );
            }
            if (scale === content.minScale) {
                contentNewLeft = content.alignPointX;
                contentNewTop = content.alignPointY;
            }
            content.currentWidth = contentNewWidth;
            content.currentHeight = contentNewHeight;
            content.currentLeft = contentNewLeft;
            content.currentTop = contentNewTop;
            content.currentScale = scale;
            return {
                left: contentNewLeft,
                top: contentNewTop,
            };
        },
        /**
         * @param {number} left
         * @param {number} top
         * @param {number} scale
         * @private
         */
        _transform: function _transform(left, top, scale) {
            this.content.$element.style.transform = 'translate('
                .concat(left, 'px, ')
                .concat(top, 'px) scale(')
                .concat(scale, ')');
            if (typeof this.options.rescale === 'function') {
                this.options.rescale();
            }
        },
        /**
         * @private
         */
        _transition: function _transition() {
            if (this.options.smoothExtinction) {
                this.content.$element.style.transition = 'transform '.concat(
                    this.options.smoothExtinction,
                    's'
                );
            } else {
                this.content.$element.style.removeProperty('transition');
            }
        },
        /**
         * todo добавить проверку на то что бы переданные координаты не выходили за пределы возможного
         * @param {number} scale
         * @param {Object} coordinates
         * @private
         */
        _zoom: function _zoom(scale) {
            var coordinates =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : {};
            // if the coordinates are not passed, then use the coordinates of the center
            if (coordinates.x === undefined || coordinates.y === undefined) {
                coordinates = calculateViewportCenter(this.viewport);
            }
            var position = this._computePosition(
                scale,
                coordinates.x,
                coordinates.y
            );
            this._transition();
            this._transform(position.left, position.top, scale);
        },
        prepare: function prepare() {
            this._prepare();
        },
        zoomUp: function zoomUp() {
            this._zoom(this._computeScale(-1));
        },
        zoomDown: function zoomDown() {
            this._zoom(this._computeScale(1));
        },
        maxZoomUp: function maxZoomUp() {
            this._zoom(this.content.maxScale);
        },
        maxZoomDown: function maxZoomDown() {
            this._zoom(this.content.minScale);
        },
        zoomUpToPoint: function zoomUpToPoint(coordinates) {
            this._zoom(this._computeScale(-1), coordinates);
        },
        zoomDownToPoint: function zoomDownToPoint(coordinates) {
            this._zoom(this._computeScale(1), coordinates);
        },
        maxZoomUpToPoint: function maxZoomUpToPoint(coordinates) {
            this._zoom(this.content.maxScale, coordinates);
        },
        destroy: function destroy() {
            this.content.$element.style.removeProperty('transition');
            this.content.$element.style.removeProperty('transform');
            if (this.options.type === 'image') {
                off(this.content.$element, 'load', this._init);
            }
            if (this.content.elementInteractor) {
                this.content.elementInteractor.destroy();
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

    /**
     * Create WZoom instance
     * @param {string|HTMLElement} selectorOrHTMLElement
     * @param {WZoomOptions} [options]
     * @returns {WZoom}
     */
    WZoom.create = function (selectorOrHTMLElement) {
        var options =
            arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {};
        options.smoothExtinction =
            Number(options.smoothExtinction) ||
            wZoomDefaultOptions.smoothExtinction;
        if (options.dragScrollableOptions) {
            options.dragScrollableOptions.smoothExtinction =
                Number(options.dragScrollableOptions.smoothExtinction) ||
                dragScrollableDefaultOptions.smoothExtinction;
        }
        return new WZoom(selectorOrHTMLElement, options);
    };

    /**
     * @typedef WZoomContent
     * @type {Object}
     * @property {?Interactor} elementInteractor
     * @property {HTMLElement} [$element]
     * @property {number} [originalWidth]
     * @property {number} [originalHeight]
     * @property {number} [currentWidth]
     * @property {number} [currentHeight]
     * @property {number} [currentLeft]
     * @property {number} [currentTop]
     * @property {number} [currentScale]
     * @property {number} [maxScale]
     * @property {number} [minScale]
     * @property {number} [alignPointX]
     * @property {number} [alignPointY]
     * @property {number} [correctX]
     * @property {number} [correctY]
     */

    /**
     * @typedef WZoomViewport
     * @type {Object}
     * @property {HTMLElement} [$element]
     * @property {number} [originalWidth]
     * @property {number} [originalHeight]
     * @property {number} [positionLeft]
     * @property {number} [positionTop]
     */

    return WZoom;
});
