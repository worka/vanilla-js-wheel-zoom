import {
    getElementPosition,
    getPageScrollLeft,
    getPageScrollTop,
    extendObject,
    on,
    off,
    eventClientX,
    eventClientY,
    isTouch
} from './toolkit';
import DragScrollable from './drag-scrollable';

/**
 * @class WZoom
 * @param {string|HTMLElement} selectorOrHTMLElement
 * @param {Object} options
 * @constructor
 */
function WZoom(selectorOrHTMLElement, options = {}) {
    this._init = this._init.bind(this);
    this._prepare = this._prepare.bind(this);
    this._computeNewScale = this._computeNewScale.bind(this);
    this._computeNewPosition = this._computeNewPosition.bind(this);
    this._transform = this._transform.bind(this);

    this._wheelHandler = _wheelHandler.bind(this);
    this._downHandler = _downHandler.bind(this);
    this._upHandler = _upHandler.bind(this);

    this._zoomTwoFingers_TouchmoveHandler = _zoomTwoFingers_TouchmoveHandler.bind(this);
    this._zoomTwoFingers_TouchendHandler = _zoomTwoFingers_TouchendHandler.bind(this);

    /********************/
    /********************/
    this.content = {};
    this.window = {};

    this.isTouch = false;
    this.events = null;
    this.direction = 1;
    this.options = null;
    this.dragScrollable = null;
    // processing of the event "max / min zoom" begin only if there was really just a click
    // so as not to interfere with the DragScrollable module
    this.coordsOnMouseDown = null;
    /********************/
    /********************/

    const defaults = {
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
        smoothExtinction: .3,
        // align content `center`, `left`, `top`, `right`, `bottom`
        alignContent: 'center',
        /********************/
        disableWheelZoom: false
    };

    if (typeof selectorOrHTMLElement === 'string') {
        this.content.$element = document.querySelector(selectorOrHTMLElement);
    } else if (selectorOrHTMLElement instanceof HTMLElement) {
        this.content.$element = selectorOrHTMLElement;
    } else {
        throw `WZoom: \`selectorOrHTMLElement\` must be selector or HTMLElement, and not ${ {}.toString.call(selectorOrHTMLElement) }`;
    }

    // check if we're using a touch screen
    this.isTouch = isTouch();
    // switch to touch events if using a touch screen
    this.events = this.isTouch ? { down: 'touchstart', up: 'touchend' } : { down: 'mousedown', up: 'mouseup' };
    // if using touch screen tells the browser that the default action will not be undone
    this.events.options = this.isTouch ? { passive: true } : false;

    if (this.content.$element) {
        options.smoothExtinction = Number(options.smoothExtinction);
        if (isNaN(options.smoothExtinction)) options.smoothExtinction = defaults.smoothExtinction;

        this.options = extendObject(defaults, options);

        if (this.options.minScale && this.options.minScale >= this.options.maxScale) {
            this.options.minScale = null;
        }

        // for window take just the parent
        this.window.$element = this.content.$element.parentNode;

        if (this.options.type === 'image') {
            let initAlreadyDone = false;

            // if the `image` has already been loaded
            if (this.content.$element.complete) {
                this._init();
                initAlreadyDone = true;
            }

            if (!initAlreadyDone || this.options.watchImageChange === true) {
                // even if the `image` has already been loaded (for "hotswap" of src support)
                on(
                    this.content.$element, 'load', this._init,
                    // if watchImageChange == false listen add only until the first call
                    this.options.watchImageChange ? false : { once: true }
                );
            }
        } else {
            this._init();
        }
    }
}

WZoom.prototype = {
    constructor: WZoom,
    _init() {
        this._prepare();

        // support for zoom and pinch on touch screen devices
        if (this.isTouch) {
            this.fingersHypot = null;
            this.zoomPinchWasDetected = false;

            on(this.content.$element, 'touchmove', this._zoomTwoFingers_TouchmoveHandler);
            on(this.content.$element, 'touchend', this._zoomTwoFingers_TouchendHandler);
        }

        if (this.options.dragScrollable === true) {
            // this can happen if the src of this.content.$element (when type = image) is changed and repeat event load at image
            if (this.dragScrollable) {
                this.dragScrollable.destroy();
            }

            this.setDragScrollable(new DragScrollable(this.window, this.content, this.options.dragScrollableOptions));
        }

        on(this.content.$element, 'wheel', this._wheelHandler);

        if (this.options.zoomOnClick) {
            on(this.content.$element, this.events.down, this._downHandler, this.events.options);
            on(this.content.$element, this.events.up, this._upHandler, this.events.options);
        }
    },
    _prepare() {
        const windowPosition = getElementPosition(this.window.$element);

        // original window sizes and position
        this.window.originalWidth = this.window.$element.offsetWidth;
        this.window.originalHeight = this.window.$element.offsetHeight;
        this.window.positionLeft = windowPosition.left;
        this.window.positionTop = windowPosition.top;

        // original content sizes
        if (this.options.type === 'image') {
            this.content.originalWidth = this.options.width || this.content.$element.naturalWidth;
            this.content.originalHeight = this.options.height || this.content.$element.naturalHeight;
        } else {
            this.content.originalWidth = this.options.width || this.content.$element.offsetWidth;
            this.content.originalHeight = this.options.height || this.content.$element.offsetHeight;
        }

        // minScale && maxScale
        this.content.minScale = this.options.minScale || Math.min(this.window.originalWidth / this.content.originalWidth, this.window.originalHeight / this.content.originalHeight);
        this.content.maxScale = this.options.maxScale;

        // current content sizes and transform data
        this.content.currentWidth = this.content.originalWidth * this.content.minScale;
        this.content.currentHeight = this.content.originalHeight * this.content.minScale;

        const [ alignPointX, alignPointY ] = _calculateAlignPoint(this.options, this.content, this.window);

        this.content.alignPointX = alignPointX;
        this.content.alignPointY = alignPointY;

        // calculate indent-left and indent-top to of content from window borders
        const [ correctX, correctY ] = _calculateCorrectPoint(this.options, this.content, this.window);

        this.content.correctX = correctX;
        this.content.correctY = correctY;

        this.content.currentLeft = this.content.alignPointX;
        this.content.currentTop = this.content.alignPointY;
        this.content.currentScale = this.content.minScale;

        this.content.$element.style.transform = `translate3d(${ this.content.alignPointX }px, ${ this.content.alignPointY }px, 0px) scale(${ this.content.minScale })`;

        if (typeof this.options.prepare === 'function') {
            this.options.prepare();
        }
    },
    _computeNewScale(delta) {
        this.direction = delta < 0 ? 1 : -1;

        const { minScale, maxScale, currentScale } = this.content;

        let contentNewScale = currentScale + (this.direction / this.options.speed);

        if (contentNewScale < minScale) {
            this.direction = 1;
        } else if (contentNewScale > maxScale) {
            this.direction = -1;
        }

        return contentNewScale < minScale ? minScale : (contentNewScale > maxScale ? maxScale : contentNewScale);
    },
    _computeNewPosition(contentNewScale, { x, y }) {
        const { window, content } = this;

        const contentNewWidth = content.originalWidth * contentNewScale;
        const contentNewHeight = content.originalHeight * contentNewScale;

        const scrollLeft = getPageScrollLeft();
        const scrollTop = getPageScrollTop();

        // calculate the parameters along the X axis
        let contentNewLeft = _calculateContentShift(x, scrollLeft, window.positionLeft, content.currentLeft, window.originalWidth, contentNewWidth / content.currentWidth);

        // calculate the parameters along the Y axis
        let contentNewTop = _calculateContentShift(y, scrollTop, window.positionTop, content.currentTop, window.originalHeight, contentNewHeight / content.currentHeight);

        if (this.direction === -1) {
            // check that the content does not go beyond the X axis
            contentNewLeft = _calculateContentMaxShift(this.options, window.originalWidth, content.correctX, contentNewWidth, contentNewLeft);

            // check that the content does not go beyond the Y axis
            contentNewTop = _calculateContentMaxShift(this.options, window.originalHeight, content.correctY, contentNewHeight, contentNewTop);
        }

        if (contentNewScale === this.content.minScale) {
            contentNewLeft = this.content.alignPointX;
            contentNewTop = this.content.alignPointY;
        }

        const response = {
            currentLeft: content.currentLeft,
            newLeft: contentNewLeft,
            currentTop: content.currentTop,
            newTop: contentNewTop,
            currentScale: content.currentScale,
            newScale: contentNewScale
        };

        content.currentWidth = contentNewWidth;
        content.currentHeight = contentNewHeight;
        content.currentLeft = contentNewLeft;
        content.currentTop = contentNewTop;
        content.currentScale = contentNewScale;

        return response;
    },
    _transform({ currentLeft, newLeft, currentTop, newTop, currentScale, newScale }, iterations = 1) {
        if (this.options.smoothExtinction) {
            this.content.$element.style.transition = `transform ${ this.options.smoothExtinction }s`;
        } else {
            this.content.$element.style.removeProperty('transition');
        }

        this.content.$element.style.transform = `translate3d(${ newLeft }px, ${ newTop }px, 0px) scale(${ newScale })`;

        if (typeof this.options.rescale === 'function') {
            this.options.rescale();
        }
    },
    _zoom(scale, coordinates) {
        // if the coordinates are not passed, then use the coordinates of the center
        if (coordinates === undefined || coordinates.x === undefined || coordinates.y === undefined) {
            coordinates = _calculateWindowCenter(this.window);
        }

        // @TODO добавить проверку на то что бы переданные координаты не выходили за пределы возможного

        this._transform(this._computeNewPosition(scale, coordinates));
    },
    prepare() {
        this._prepare();
    },
    zoomUp() {
        this._zoom(this._computeNewScale(-1));
    },
    zoomDown() {
        this._zoom(this._computeNewScale(1));
    },
    maxZoomUp() {
        this._zoom(this.content.maxScale);
    },
    maxZoomDown() {
        this._zoom(this.content.minScale);
    },
    zoomUpToPoint(coordinates) {
        this._zoom(this._computeNewScale(-1), coordinates);
    },
    zoomDownToPoint(coordinates) {
        this._zoom(this._computeNewScale(1), coordinates);
    },
    maxZoomUpToPoint(coordinates) {
        this._zoom(this.content.maxScale, coordinates);
    },
    setDragScrollable(dragScrollable) {
        this.dragScrollable = dragScrollable;
    },
    destroy() {
        this.content.$element.style.transform = '';

        if (this.options.type === 'image') {
            off(this.content.$element, 'load', this._init);
        }

        if (this.isTouch) {
            off(this.content.$element, 'touchmove', this._zoomTwoFingers_TouchmoveHandler);
            off(this.content.$element, 'touchend', this._zoomTwoFingers_TouchendHandler);
        }

        off(this.content.$element, 'wheel', this._wheelHandler);

        if (this.options.zoomOnClick) {
            off(this.content.$element, this.events.down, this._downHandler, this.events.options);
            off(this.content.$element, this.events.up, this._upHandler, this.events.options);
        }

        if (this.dragScrollable) {
            this.dragScrollable.destroy();
        }

        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                this[key] = null;
            }
        }
    }
};

function _wheelHandler(event) {
    if (!this.options.disableWheelZoom) {
        event.preventDefault();

        this._transform(
            this._computeNewPosition(
                this._computeNewScale(event.deltaY),
                { x: eventClientX(event), y: eventClientY(event) }
            )
        );
    }
}

function _downHandler(event) {
    if ((this.isTouch && event.touches.length === 1) || event.buttons === 1) {
        this.coordsOnMouseDown = { x: eventClientX(event), y: eventClientY(event) };
    }
}

function _upHandler(event) {
    if (this.coordsOnMouseDown && this.coordsOnMouseDown.x === eventClientX(event) && this.coordsOnMouseDown.y === eventClientY(event)) {
        this._transform(
            this._computeNewPosition(
                this.direction === 1 ? this.content.maxScale : this.content.minScale, {
                    x: eventClientX(event),
                    y: eventClientY(event)
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
        if (fingersHypotNew > this.fingersHypot + 5) direction = -1;
        if (fingersHypotNew < this.fingersHypot - 5) direction = 1;

        if (direction !== 0) {
            if (this.fingersHypot !== null || direction === 1) {
                const eventEmulator = new Event('wheel');
                // sized direction
                eventEmulator.deltaY = direction;
                // middle position between fingers
                eventEmulator.clientX = Math.min(pageX1, pageX2) + (Math.abs(pageX1 - pageX2) / 2);
                eventEmulator.clientY = Math.min(pageY1, pageY2) + (Math.abs(pageY1 - pageY2) / 2);

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
    let alignPointX = 0;
    let alignPointY = 0;

    switch (options.alignContent) {
        case 'left':
            alignPointX = (content.currentWidth - window.originalWidth) / 2;
            break;
        case 'top':
            alignPointY = (content.currentHeight - window.originalHeight) / 2;
            break;
        case 'right':
            alignPointX = (content.currentWidth - window.originalWidth) / 2 * -1;
            break;
        case 'bottom':
            alignPointY = (content.currentHeight - window.originalHeight) / 2 * -1;
            break;
    }

    return [ alignPointX, alignPointY ];
}

function _calculateCorrectPoint(options, content, window) {
    let correctX = Math.max(0, (window.originalWidth - content.currentWidth) / 2);
    let correctY = Math.max(0, (window.originalHeight - content.currentHeight) / 2);

    if (options.alignContent === 'left') correctX = correctX * 2;
    else if (options.alignContent === 'right') correctX = 0;

    if (options.alignContent === 'bottom') correctY = correctY * 2;
    else if (options.alignContent === 'top') correctY = 0;

    return [ correctX, correctY ];
}

function _calculateContentShift(axisValue, axisScroll, axisWindowPosition, axisContentPosition, originalWindowSize, contentSizeRatio) {
    const windowShift = axisValue + axisScroll - axisWindowPosition;
    const centerWindowShift = originalWindowSize / 2 - windowShift;
    const centerContentShift = centerWindowShift + axisContentPosition;

    return centerContentShift * contentSizeRatio - centerContentShift + axisContentPosition;
}

function _calculateContentMaxShift(options, originalWindowSize, correctCoordinate, size, shift) {
    switch (options.alignContent) {
        case 'left':
            if (size / 2 - shift < originalWindowSize / 2) {
                shift = (size - originalWindowSize) / 2;
            }
            break;
        case 'right':
            if (size / 2 + shift < originalWindowSize / 2) {
                shift = (size - originalWindowSize) / 2 * -1;
            }
            break;
        default:
            if ((size - originalWindowSize) / 2 + correctCoordinate < Math.abs(shift)) {
                const positive = shift < 0 ? -1 : 1;
                shift = ((size - originalWindowSize) / 2 + correctCoordinate) * positive;
            }
    }

    return shift;
}

function _calculateWindowCenter(window) {
    const windowPosition = getElementPosition(window.$element);

    return {
        x: windowPosition.left + (window.originalWidth / 2) - getPageScrollLeft(),
        y: windowPosition.top + (window.originalHeight / 2) - getPageScrollTop()
    };
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

export default WZoom;
