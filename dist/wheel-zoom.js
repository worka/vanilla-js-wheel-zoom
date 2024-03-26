(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory())
        : typeof define === 'function' && define.amd
          ? define(factory)
          : ((global =
                typeof globalThis !== 'undefined'
                    ? globalThis
                    : global || self),
            (global.WZoom = factory()));
})(this, function () {
    'use strict';

    function _callSuper(t, o, e) {
        return (
            (o = _getPrototypeOf(o)),
            _possibleConstructorReturn(
                t,
                _isNativeReflectConstruct()
                    ? Reflect.construct(
                          o,
                          e || [],
                          _getPrototypeOf(t).constructor
                      )
                    : o.apply(t, e)
            )
        );
    }
    function _isNativeReflectConstruct() {
        try {
            var t = !Boolean.prototype.valueOf.call(
                Reflect.construct(Boolean, [], function () {})
            );
        } catch (t) {}
        return (_isNativeReflectConstruct = function () {
            return !!t;
        })();
    }
    function _iterableToArrayLimit(r, l) {
        var t =
            null == r
                ? null
                : ('undefined' != typeof Symbol && r[Symbol.iterator]) ||
                  r['@@iterator'];
        if (null != t) {
            var e,
                n,
                i,
                u,
                a = [],
                f = !0,
                o = !1;
            try {
                if (((i = (t = t.call(r)).next), 0 === l)) {
                    if (Object(t) !== t) return;
                    f = !1;
                } else
                    for (
                        ;
                        !(f = (e = i.call(t)).done) &&
                        (a.push(e.value), a.length !== l);
                        f = !0
                    );
            } catch (r) {
                (o = !0), (n = r);
            } finally {
                try {
                    if (
                        !f &&
                        null != t.return &&
                        ((u = t.return()), Object(u) !== u)
                    )
                        return;
                } finally {
                    if (o) throw n;
                }
            }
            return a;
        }
    }
    function ownKeys(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            r &&
                (o = o.filter(function (r) {
                    return Object.getOwnPropertyDescriptor(e, r).enumerable;
                })),
                t.push.apply(t, o);
        }
        return t;
    }
    function _objectSpread2(e) {
        for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2
                ? ownKeys(Object(t), !0).forEach(function (r) {
                      _defineProperty(e, r, t[r]);
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(
                        e,
                        Object.getOwnPropertyDescriptors(t)
                    )
                  : ownKeys(Object(t)).forEach(function (r) {
                        Object.defineProperty(
                            e,
                            r,
                            Object.getOwnPropertyDescriptor(t, r)
                        );
                    });
        }
        return e;
    }
    function _toPrimitive(t, r) {
        if ('object' != typeof t || !t) return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
            var i = e.call(t, r || 'default');
            if ('object' != typeof i) return i;
            throw new TypeError('@@toPrimitive must return a primitive value.');
        }
        return ('string' === r ? String : Number)(t);
    }
    function _toPropertyKey(t) {
        var i = _toPrimitive(t, 'string');
        return 'symbol' == typeof i ? i : i + '';
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
    function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) {
            throw new TypeError(
                'Super expression must either be null or a function'
            );
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: true,
                configurable: true,
            },
        });
        Object.defineProperty(subClass, 'prototype', {
            writable: false,
        });
        if (superClass) _setPrototypeOf(subClass, superClass);
    }
    function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf
            ? Object.getPrototypeOf.bind()
            : function _getPrototypeOf(o) {
                  return o.__proto__ || Object.getPrototypeOf(o);
              };
        return _getPrototypeOf(o);
    }
    function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf
            ? Object.setPrototypeOf.bind()
            : function _setPrototypeOf(o, p) {
                  o.__proto__ = p;
                  return o;
              };
        return _setPrototypeOf(o, p);
    }
    function _assertThisInitialized(self) {
        if (self === void 0) {
            throw new ReferenceError(
                "this hasn't been initialised - super() hasn't been called"
            );
        }
        return self;
    }
    function _possibleConstructorReturn(self, call) {
        if (call && (typeof call === 'object' || typeof call === 'function')) {
            return call;
        } else if (call !== void 0) {
            throw new TypeError(
                'Derived constructors may only return object or undefined'
            );
        }
        return _assertThisInitialized(self);
    }
    function _superPropBase(object, property) {
        while (!Object.prototype.hasOwnProperty.call(object, property)) {
            object = _getPrototypeOf(object);
            if (object === null) break;
        }
        return object;
    }
    function _get() {
        if (typeof Reflect !== 'undefined' && Reflect.get) {
            _get = Reflect.get.bind();
        } else {
            _get = function _get(target, property, receiver) {
                var base = _superPropBase(target, property);
                if (!base) return;
                var desc = Object.getOwnPropertyDescriptor(base, property);
                if (desc.get) {
                    return desc.get.call(
                        arguments.length < 3 ? target : receiver
                    );
                }
                return desc.value;
            };
        }
        return _get.apply(this, arguments);
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
     * @param {HTMLElement} $element
     * @param {number} left
     * @param {number} top
     * @param {number} scale
     */
    function transform($element, left, top, scale) {
        $element.style.transform = 'translate('
            .concat(left, 'px, ')
            .concat(top, 'px) scale(')
            .concat(scale, ')');
    }

    /**
     * @param {HTMLElement} $element
     * @param {number} time
     */
    function transition($element, time) {
        if (time) {
            $element.style.transition = 'transform '.concat(time, 's');
        } else {
            $element.style.removeProperty('transition');
        }
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
        // minimum allowed proportion of scale (computed auto if null)
        minScale: null,
        // maximum allowed proportion of scale (1 = 100% content size)
        maxScale: 1,
        // content resizing speed
        speed: 1.1,
        // zoom to maximum (minimum) size on click
        zoomOnClick: true,
        // zoom to maximum (minimum) size on double click
        zoomOnDblClick: false,
        // smooth extinction
        smoothTime: 0.25,
        // align content `center`, `left`, `top`, `right`, `bottom`
        alignContent: 'center',
        // ******************** //
        disableWheelZoom: false,
        // option to reverse wheel direction
        reverseWheelDirection: false,
        // ******************** //
        // drag scrollable content
        dragScrollable: true,
    };

    /**
     * @typedef WZoomOptions
     * @type {Object}
     * @property {string} type
     * @property {?number} width
     * @property {?number} height
     * @property {?number} minScale
     * @property {number} maxScale
     * @property {number} speed
     * @property {boolean} zoomOnClick
     * @property {boolean} zoomOnDblClick
     * @property {number} smoothTime
     * @property {string} alignContent
     * @property {boolean} disableWheelZoom
     * @property {boolean} reverseWheelDirection
     * @property {boolean} dragScrollable
     * @property {number} smoothTimeDrag
     * @property {?Function} onGrab
     * @property {?Function} onMove
     * @property {?Function} onDrop
     */

    var AbstractObserver = /*#__PURE__*/ (function () {
        /**
         * @constructor
         */
        function AbstractObserver() {
            _classCallCheck(this, AbstractObserver);
            /** @type {Object<string, (event: Event) => void>} */
            this.subscribes = {};
        }

        /**
         * @param {string} eventType
         * @param {(event: Event) => void} eventHandler
         * @returns {AbstractObserver}
         */
        return _createClass(AbstractObserver, [
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
                    for (var key in this) {
                        if (this.hasOwnProperty(key)) {
                            this[key] = null;
                        }
                    }
                },

                /**
                 * @param {string} eventType
                 * @param {Event} event
                 * @protected
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
            },
        ]);
    })();

    var EVENT_GRAB = 'grab';
    var EVENT_MOVE = 'move';
    var EVENT_DROP = 'drop';
    var DragScrollableObserver = /*#__PURE__*/ (function (_AbstractObserver) {
        /**
         * @param {HTMLElement} target
         * @constructor
         */
        function DragScrollableObserver(target) {
            var _this;
            _classCallCheck(this, DragScrollableObserver);
            _this = _callSuper(this, DragScrollableObserver);
            _this.target = target;
            _this.moveTimer = null;
            _this.coordinates = null;
            _this.coordinatesShift = null;

            // check if we're using a touch screen
            _this.isTouch = isTouch();
            // switch to touch events if using a touch screen
            _this.events = _this.isTouch
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
            _this.events.options = _this.isTouch
                ? {
                      passive: false,
                  }
                : false;
            _this._dropHandler = _this._dropHandler.bind(_this);
            _this._grabHandler = _this._grabHandler.bind(_this);
            _this._moveHandler = _this._moveHandler.bind(_this);
            on(
                _this.target,
                _this.events.grab,
                _this._grabHandler,
                _this.events.options
            );
            return _this;
        }
        _inherits(DragScrollableObserver, _AbstractObserver);
        return _createClass(DragScrollableObserver, [
            {
                key: 'destroy',
                value: function destroy() {
                    off(
                        this.target,
                        this.events.grab,
                        this._grabHandler,
                        this.events.options
                    );
                    _get(
                        _getPrototypeOf(DragScrollableObserver.prototype),
                        'destroy',
                        this
                    ).call(this);
                },

                /**
                 * @param {Event|TouchEvent|MouseEvent} event
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
                        this._run(EVENT_GRAB, event);
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
                    off(document, this.events.drop, this._dropHandler);
                    off(document, this.events.move, this._moveHandler);
                    this._run(EVENT_DROP, event);
                },

                /**
                 * @param {Event|TouchEvent} event
                 * @private
                 */
            },
            {
                key: '_moveHandler',
                value: function _moveHandler(event) {
                    // so that it does not move when the touch screen and more than one finger
                    if (this.isTouch && event.touches.length > 1) return false;
                    var coordinatesShift = this.coordinatesShift,
                        coordinates = this.coordinates;

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
                    event.data = _objectSpread2(
                        _objectSpread2({}, event.data || {}),
                        {},
                        {
                            x: coordinatesShift.x,
                            y: coordinatesShift.y,
                        }
                    );
                    this._run(EVENT_MOVE, event);
                },
            },
        ]);
    })(AbstractObserver);

    var EVENT_CLICK = 'click';
    var EVENT_DBLCLICK = 'dblclick';
    var EVENT_WHEEL = 'wheel';
    var InteractionObserver = /*#__PURE__*/ (function (_AbstractObserver) {
        /**
         * @param {HTMLElement} target
         * @constructor
         */
        function InteractionObserver(target) {
            var _this;
            _classCallCheck(this, InteractionObserver);
            _this = _callSuper(this, InteractionObserver);
            _this.target = target;
            _this.coordsOnDown = null;
            _this.pressingTimeout = null;
            _this.firstClick = true;

            // check if we're using a touch screen
            _this.isTouch = isTouch();
            // switch to touch events if using a touch screen
            _this.events = _this.isTouch
                ? {
                      down: 'touchstart',
                      up: 'touchend',
                  }
                : {
                      down: 'mousedown',
                      up: 'mouseup',
                  };
            // if using touch screen tells the browser that the default action will not be undone
            _this.events.options = _this.isTouch
                ? {
                      passive: true,
                  }
                : false;
            _this._downHandler = _this._downHandler.bind(_this);
            _this._upHandler = _this._upHandler.bind(_this);
            _this._wheelHandler = _this._wheelHandler.bind(_this);
            on(
                _this.target,
                _this.events.down,
                _this._downHandler,
                _this.events.options
            );
            on(
                _this.target,
                _this.events.up,
                _this._upHandler,
                _this.events.options
            );
            on(_this.target, EVENT_WHEEL, _this._wheelHandler);
            return _this;
        }
        _inherits(InteractionObserver, _AbstractObserver);
        return _createClass(InteractionObserver, [
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
                    _get(
                        _getPrototypeOf(InteractionObserver.prototype),
                        'destroy',
                        this
                    ).call(this);
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
                    var _this2 = this;
                    var delay = 200;
                    var setTimeoutInner = this.subscribes[EVENT_DBLCLICK]
                        ? setTimeout
                        : function (cb, delay) {
                              return cb();
                          };
                    if (this.firstClick) {
                        this.firstClick = false;
                        this.pressingTimeout = setTimeoutInner(function () {
                            if (!_this2._isDetectedShift(event)) {
                                _this2._run(EVENT_CLICK, event);
                            }
                            _this2.firstClick = true;
                        }, delay);
                    } else {
                        this.pressingTimeout = setTimeoutInner(function () {
                            if (!_this2._isDetectedShift(event)) {
                                _this2._run(EVENT_DBLCLICK, event);
                            }
                            _this2.firstClick = true;
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
                 * @param {TouchEvent|MouseEvent|PointerEvent} event
                 * @return {boolean}
                 * @private
                 */
            },
            {
                key: '_isDetectedShift',
                value: function _isDetectedShift(event) {
                    return !(
                        this.coordsOnDown &&
                        this.coordsOnDown.x === eventClientX(event) &&
                        this.coordsOnDown.y === eventClientY(event)
                    );
                },
            },
        ]);
    })(AbstractObserver);

    var EVENT_PINCH_TO_ZOOM = 'pinchtozoom';
    var SHIFT_DECIDE_THAT_MOVE_STARTED = 5;
    var PinchToZoomObserver = /*#__PURE__*/ (function (_AbstractObserver) {
        /**
         * @param {HTMLElement} target
         * @constructor
         */
        function PinchToZoomObserver(target) {
            var _this;
            _classCallCheck(this, PinchToZoomObserver);
            _this = _callSuper(this, PinchToZoomObserver);
            _this.target = target;
            _this.fingersHypot = null;
            _this.zoomPinchWasDetected = false;
            _this._touchMoveHandler = _this._touchMoveHandler.bind(_this);
            _this._touchEndHandler = _this._touchEndHandler.bind(_this);
            on(_this.target, 'touchmove', _this._touchMoveHandler);
            on(_this.target, 'touchend', _this._touchEndHandler);
            return _this;
        }
        _inherits(PinchToZoomObserver, _AbstractObserver);
        return _createClass(PinchToZoomObserver, [
            {
                key: 'destroy',
                value: function destroy() {
                    off(this.target, 'touchmove', this._touchMoveHandler);
                    off(this.target, 'touchend', this._touchEndHandler);
                    _get(
                        _getPrototypeOf(PinchToZoomObserver.prototype),
                        'destroy',
                        this
                    ).call(this);
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
                        if (
                            fingersHypotNew >
                            this.fingersHypot + SHIFT_DECIDE_THAT_MOVE_STARTED
                        )
                            direction = -1;
                        if (
                            fingersHypotNew <
                            this.fingersHypot - SHIFT_DECIDE_THAT_MOVE_STARTED
                        )
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
    })(AbstractObserver);

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
        this._transform = this._transform.bind(this);

        /** @type {WZoomContent} */
        this.content = {};
        if (typeof selectorOrHTMLElement === 'string') {
            this.content.$element = document.querySelector(
                selectorOrHTMLElement
            );
            if (!this.content.$element) {
                throw 'WZoom: Element with selector `'.concat(
                    selectorOrHTMLElement,
                    '` not found'
                );
            }
        } else if (selectorOrHTMLElement instanceof HTMLElement) {
            this.content.$element = selectorOrHTMLElement;
        } else {
            throw 'WZoom: `selectorOrHTMLElement` must be selector or HTMLElement, and not '.concat(
                {}.toString.call(selectorOrHTMLElement)
            );
        }

        /** @type {WZoomViewport} */
        this.viewport = {};
        // for viewport take just the parent
        this.viewport.$element = this.content.$element.parentElement;

        /** @type {WZoomOptions} */
        this.options = optionsConstructor(options, wZoomDefaultOptions);

        // check if we're using a touch screen
        this.isTouch = isTouch();
        this.direction = 1;
        /** @type {AbstractObserver[]} */
        this.observers = [];
        if (this.options.type === 'image') {
            // if the `image` has already been loaded
            if (this.content.$element.complete) {
                this._init();
            } else {
                on(this.content.$element, 'load', this._init, {
                    once: true,
                });
            }
        } else {
            this._init();
        }
    }
    WZoom.prototype = {
        constructor: WZoom,
        /**
         * @private
         */
        _init: function _init() {
            var _this = this;
            var viewport = this.viewport,
                content = this.content,
                options = this.options,
                observers = this.observers;
            this._prepare();
            this._destroyObservers();
            if (options.dragScrollable === true) {
                var dragScrollableObserver = new DragScrollableObserver(
                    content.$element
                );
                observers.push(dragScrollableObserver);
                if (typeof options.onGrab === 'function') {
                    dragScrollableObserver.on(EVENT_GRAB, function (event) {
                        event.preventDefault();
                        options.onGrab(event, _this);
                    });
                }
                if (typeof options.onDrop === 'function') {
                    dragScrollableObserver.on(EVENT_DROP, function (event) {
                        event.preventDefault();
                        options.onDrop(event, _this);
                    });
                }
                dragScrollableObserver.on(EVENT_MOVE, function (event) {
                    event.preventDefault();
                    var _event$data = event.data,
                        x = _event$data.x,
                        y = _event$data.y;
                    var contentNewLeft = content.currentLeft + x;
                    var contentNewTop = content.currentTop + y;
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
                    _this._transform(options.smoothTimeDrag);
                    if (typeof options.onMove === 'function') {
                        options.onMove(event, _this);
                    }
                });
            }
            var interactionObserver = new InteractionObserver(content.$element);
            observers.push(interactionObserver);
            if (!options.disableWheelZoom) {
                if (this.isTouch) {
                    var pinchToZoomObserver = new PinchToZoomObserver(
                        content.$element
                    );
                    observers.push(pinchToZoomObserver);
                    pinchToZoomObserver.on(
                        EVENT_PINCH_TO_ZOOM,
                        function (event) {
                            var _event$data2 = event.data,
                                clientX = _event$data2.clientX,
                                clientY = _event$data2.clientY,
                                direction = _event$data2.direction;
                            var scale = _this._computeScale(direction);
                            _this._computePosition(scale, clientX, clientY);
                            _this._transform();
                        }
                    );
                } else {
                    interactionObserver.on(EVENT_WHEEL, function (event) {
                        event.preventDefault();
                        var direction = options.reverseWheelDirection
                            ? -event.deltaY
                            : event.deltaY;
                        var scale = _this._computeScale(direction);
                        _this._computePosition(
                            scale,
                            eventClientX(event),
                            eventClientY(event)
                        );
                        _this._transform();
                    });
                }
            }
            if (options.zoomOnClick || options.zoomOnDblClick) {
                var eventType = options.zoomOnDblClick
                    ? EVENT_DBLCLICK
                    : EVENT_CLICK;
                interactionObserver.on(eventType, function (event) {
                    var scale =
                        _this.direction === 1
                            ? content.maxScale
                            : content.minScale;
                    _this._computePosition(
                        scale,
                        eventClientX(event),
                        eventClientY(event)
                    );
                    _this._transform();
                    _this.direction *= -1;
                });
            }
        },
        /**
         * @private
         */
        _prepare: function _prepare() {
            var viewport = this.viewport,
                content = this.content,
                options = this.options;
            var _getElementPosition = getElementPosition(viewport.$element),
                left = _getElementPosition.left,
                top = _getElementPosition.top;
            viewport.originalWidth = viewport.$element.offsetWidth;
            viewport.originalHeight = viewport.$element.offsetHeight;
            viewport.originalLeft = left;
            viewport.originalTop = top;
            if (options.type === 'image') {
                content.originalWidth =
                    options.width || content.$element.naturalWidth;
                content.originalHeight =
                    options.height || content.$element.naturalHeight;
            } else {
                content.originalWidth =
                    options.width || content.$element.offsetWidth;
                content.originalHeight =
                    options.height || content.$element.offsetHeight;
            }
            content.maxScale = options.maxScale;
            content.minScale =
                options.minScale ||
                Math.min(
                    viewport.originalWidth / content.originalWidth,
                    viewport.originalHeight / content.originalHeight,
                    content.maxScale
                );
            content.currentScale = content.minScale;
            content.currentWidth = content.originalWidth * content.currentScale;
            content.currentHeight =
                content.originalHeight * content.currentScale;
            var _calculateAlignPoint = calculateAlignPoint(
                viewport,
                content,
                options.alignContent
            );
            var _calculateAlignPoint2 = _slicedToArray(_calculateAlignPoint, 2);
            content.alignPointX = _calculateAlignPoint2[0];
            content.alignPointY = _calculateAlignPoint2[1];
            content.currentLeft = content.alignPointX;
            content.currentTop = content.alignPointY;

            // calculate indent-left and indent-top to of content from viewport borders
            var _calculateCorrectPoin = calculateCorrectPoint(
                viewport,
                content,
                options.alignContent
            );
            var _calculateCorrectPoin2 = _slicedToArray(
                _calculateCorrectPoin,
                2
            );
            content.correctX = _calculateCorrectPoin2[0];
            content.correctY = _calculateCorrectPoin2[1];
            if (typeof options.prepare === 'function') {
                options.prepare(this);
            }
            this._transform();
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
            var scale =
                currentScale * Math.pow(this.options.speed, this.direction);
            if (scale <= minScale) {
                this.direction = 1;
                return minScale;
            }
            if (scale >= maxScale) {
                this.direction = -1;
                return maxScale;
            }
            return scale;
        },
        /**
         * @param {number} scale
         * @param {number} x
         * @param {number} y
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
                viewport.originalLeft,
                content.currentLeft,
                viewport.originalWidth,
                contentNewWidth / content.currentWidth
            );
            // calculate the parameters along the Y axis
            var contentNewTop = calculateContentShift(
                y,
                scrollTop,
                viewport.originalTop,
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
        },
        /**
         * @param {number} smoothTime
         * @private
         */
        _transform: function _transform(smoothTime) {
            if (smoothTime === undefined) smoothTime = this.options.smoothTime;
            transition(this.content.$element, smoothTime);
            transform(
                this.content.$element,
                this.content.currentLeft,
                this.content.currentTop,
                this.content.currentScale
            );
            if (typeof this.options.rescale === 'function') {
                this.options.rescale(this);
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
            this._computePosition(scale, coordinates.x, coordinates.y);
            this._transform();
        },
        _destroyObservers: function _destroyObservers() {
            var _iterator = _createForOfIteratorHelper(this.observers),
                _step;
            try {
                for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                    var observer = _step.value;
                    observer.destroy();
                }
            } catch (err) {
                _iterator.e(err);
            } finally {
                _iterator.f();
            }
        },
        prepare: function prepare() {
            this._prepare();
        },
        /**
         * todo добавить проверку на то что бы переданный state вообще возможен для данного instance
         * @param {number} top
         * @param {number} left
         * @param {number} scale
         */
        transform: function transform(top, left, scale) {
            var content = this.content;
            content.currentWidth = content.originalWidth * scale;
            content.currentHeight = content.originalHeight * scale;
            content.currentLeft = left;
            content.currentTop = top;
            content.currentScale = scale;
            this._transform();
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
            this._destroyObservers();
            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                    this[key] = null;
                }
            }
        },
    };

    /**
     * @param {?WZoomOptions} targetOptions
     * @param {?WZoomOptions} defaultOptions
     * @returns {?WZoomOptions}
     */
    function optionsConstructor(targetOptions, defaultOptions) {
        var options = Object.assign({}, defaultOptions, targetOptions);
        if (isTouch()) {
            options.smoothTime = 0;
            options.smoothTimeDrag = 0;
        } else {
            var smoothTime = Number(options.smoothTime);
            var smoothTimeDrag = Number(options.smoothTimeDrag);
            options.smoothTime = !isNaN(smoothTime)
                ? smoothTime
                : wZoomDefaultOptions.smoothTime;
            options.smoothTimeDrag = !isNaN(smoothTimeDrag)
                ? smoothTimeDrag
                : options.smoothTime;
        }
        return options;
    }

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
        return new WZoom(selectorOrHTMLElement, options);
    };

    /**
     * @typedef WZoomContent
     * @type {Object}
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
     * @property {number} [originalLeft]
     * @property {number} [originalTop]
     */

    return WZoom;
});
