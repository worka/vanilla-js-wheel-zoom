import {
    getElementPosition,
    getPageScrollLeft,
    getPageScrollTop,
    on,
    off,
    eventClientX,
    eventClientY,
    isTouch,
    transition,
    transform,
} from './toolkit';
import {
    calculateAlignPoint,
    calculateContentMaxShift,
    calculateContentShift,
    calculateCorrectPoint,
    calculateViewportCenter,
} from './calculator';
import { wZoomDefaultOptions } from './default-options.js';
import DragScrollableObserver, { EVENT_DROP, EVENT_GRAB, EVENT_MOVE } from './observers/DragScrollableObserver';
import InteractionObserver, { EVENT_CLICK, EVENT_DBLCLICK, EVENT_WHEEL } from './observers/InteractionObserver';
import PinchToZoomObserver, { EVENT_PINCH_TO_ZOOM } from './observers/PinchToZoomObserver';

/**
 * @class WZoom
 * @param {string|HTMLElement} selectorOrHTMLElement
 * @param {WZoomOptions} options
 * @constructor
 */
function WZoom(selectorOrHTMLElement, options = {}) {
    this._init = this._init.bind(this);
    this._prepare = this._prepare.bind(this);
    this._computeScale = this._computeScale.bind(this);
    this._computePosition = this._computePosition.bind(this);
    this._transform = this._transform.bind(this);

    /** @type {WZoomContent} */
    this.content = {};

    if (typeof selectorOrHTMLElement === 'string') {
        this.content.$element = document.querySelector(selectorOrHTMLElement);

        if (!this.content.$element) {
            throw `WZoom: Element with selector \`${ selectorOrHTMLElement }\` not found`;
        }
    } else if (selectorOrHTMLElement instanceof HTMLElement) {
        this.content.$element = selectorOrHTMLElement;
    } else {
        throw `WZoom: \`selectorOrHTMLElement\` must be selector or HTMLElement, and not ${ {}.toString.call(selectorOrHTMLElement) }`;
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
            on(this.content.$element, 'load', this._init, { once: true });
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
    _init() {
        const { viewport, content, options, observers } = this;

        this._prepare();
        this._destroyObservers();

        if (options.dragScrollable === true) {
            const dragScrollableObserver = new DragScrollableObserver(content.$element);
            observers.push(dragScrollableObserver);

            if (typeof options.onGrab === 'function') {
                dragScrollableObserver.on(EVENT_GRAB, (event) => {
                    event.preventDefault();

                    options.onGrab(event, this);
                });
            }

            if (typeof options.onDrop === 'function') {
                dragScrollableObserver.on(EVENT_DROP, (event) => {
                    event.preventDefault();

                    options.onDrop(event, this);
                });
            }

            dragScrollableObserver.on(EVENT_MOVE, (event) => {
                event.preventDefault();

                const { x, y } = event.data;

                const contentNewLeft = content.currentLeft + x;
                const contentNewTop = content.currentTop + y;

                let maxAvailableLeft = (content.currentWidth - viewport.originalWidth) / 2 + content.correctX;
                let maxAvailableTop = (content.currentHeight - viewport.originalHeight) / 2 + content.correctY;

                // if we do not go beyond the permissible boundaries of the viewport
                if (Math.abs(contentNewLeft) <= maxAvailableLeft) content.currentLeft = contentNewLeft;
                // if we do not go beyond the permissible boundaries of the viewport
                if (Math.abs(contentNewTop) <= maxAvailableTop) content.currentTop = contentNewTop;

                this._transform(options.smoothTimeDrag);

                if (typeof options.onMove === 'function') {
                    options.onMove(event, this);
                }
            });
        }

        const interactionObserver = new InteractionObserver(content.$element);
        observers.push(interactionObserver);

        if (!options.disableWheelZoom) {
            if (this.isTouch) {
                const pinchToZoomObserver = new PinchToZoomObserver(content.$element);
                observers.push(pinchToZoomObserver);

                pinchToZoomObserver.on(EVENT_PINCH_TO_ZOOM, (event) => {
                    const { clientX, clientY, direction } = event.data;

                    const scale = this._computeScale(direction);
                    this._computePosition(scale, clientX, clientY);
                    this._transform();
                });
            } else {
                interactionObserver.on(EVENT_WHEEL, (event) => {
                    event.preventDefault();

                    const direction = options.reverseWheelDirection ? -event.deltaY : event.deltaY;
                    const scale = this._computeScale(direction);
                    this._computePosition(scale, eventClientX(event), eventClientY(event));
                    this._transform();
                });
            }
        }

        if (options.zoomOnClick || options.zoomOnDblClick) {
            const eventType = options.zoomOnDblClick ? EVENT_DBLCLICK : EVENT_CLICK;

            interactionObserver.on(eventType, (event) => {
                const scale = this.direction === 1 ? content.maxScale : content.minScale;
                this._computePosition(scale, eventClientX(event), eventClientY(event));
                this._transform();

                this.direction *= -1;
            });
        }
    },
    /**
     * @private
     */
    _prepare() {
        const { viewport, content, options } = this;
        const { left, top } = getElementPosition(viewport.$element);

        viewport.originalWidth = viewport.$element.offsetWidth;
        viewport.originalHeight = viewport.$element.offsetHeight;
        viewport.originalLeft = left;
        viewport.originalTop = top;

        if (options.type === 'image') {
            content.originalWidth = options.width || content.$element.naturalWidth;
            content.originalHeight = options.height || content.$element.naturalHeight;
        } else {
            content.originalWidth = options.width || content.$element.offsetWidth;
            content.originalHeight = options.height || content.$element.offsetHeight;
        }

        const scale = content.$element.style.scale;
        content.originalScale = scale ? scale.split(" ").map(p => parseFloat(p)) : [1,1,1];
        content.originalTranslateZ = content.$element.style.translate?.split(" ")[2] || "0px";

        content.maxScale = options.maxScale;
        content.minScale = options.minScale || Math.min(viewport.originalWidth / content.originalWidth, viewport.originalHeight / content.originalHeight, content.maxScale);

        content.currentScale = content.minScale;
        content.currentWidth = content.originalWidth * content.currentScale;
        content.currentHeight = content.originalHeight * content.currentScale;

        [ content.alignPointX, content.alignPointY ] = calculateAlignPoint(viewport, content, options.alignContent);

        content.currentLeft = content.alignPointX;
        content.currentTop = content.alignPointY;

        // calculate indent-left and indent-top to of content from viewport borders
        [ content.correctX, content.correctY ] = calculateCorrectPoint(viewport, content, options.alignContent);

        if (typeof options.prepare === 'function') {
            options.prepare(this);
        }

        this._transform();
    },
    /**
     * @private
     */
    _computeScale(direction) {
        this.direction = direction < 0 ? 1 : -1;

        const { minScale, maxScale, currentScale } = this.content;

        const scale = currentScale * Math.pow(this.options.speed, this.direction);

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
    _computePosition(scale, x, y) {
        const { viewport, content, options, direction } = this;

        const contentNewWidth = content.originalWidth * scale;
        const contentNewHeight = content.originalHeight * scale;

        const scrollLeft = getPageScrollLeft();
        const scrollTop = getPageScrollTop();

        // calculate the parameters along the X axis
        let contentNewLeft = calculateContentShift(x, scrollLeft, viewport.originalLeft, content.currentLeft, viewport.originalWidth, contentNewWidth / content.currentWidth);
        // calculate the parameters along the Y axis
        let contentNewTop = calculateContentShift(y, scrollTop, viewport.originalTop, content.currentTop, viewport.originalHeight, contentNewHeight / content.currentHeight);

        if (direction === -1) {
            // check that the content does not go beyond the X axis
            contentNewLeft = calculateContentMaxShift(options.alignContent, viewport.originalWidth, content.correctX, contentNewWidth, contentNewLeft);
            // check that the content does not go beyond the Y axis
            contentNewTop = calculateContentMaxShift(options.alignContent, viewport.originalHeight, content.correctY, contentNewHeight, contentNewTop);
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
    _transform(smoothTime) {
        if (smoothTime === undefined) smoothTime = this.options.smoothTime;

        // calculate the scale with the respect to the original scale
        const o = this.content.originalScale;
        const s = this.content.currentScale;
        const scale = [o[0] * s, o[1] * s, o[2]].join(" ");

        transition(this.content.$element, smoothTime);
        transform(this.content.$element, this.content.currentLeft, this.content.currentTop, this.content.originalTranslateZ, scale);

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
    _zoom(scale, coordinates = {}) {
        // if the coordinates are not passed, then use the coordinates of the center
        if (coordinates.x === undefined || coordinates.y === undefined) {
            coordinates = calculateViewportCenter(this.viewport);
        }

        this._computePosition(scale, coordinates.x, coordinates.y);
        this._transform();
    },
    _destroyObservers() {
        for (const observer of this.observers) {
            observer.destroy();
        }
    },
    prepare() {
        this._prepare();
    },
    /**
     * todo добавить проверку на то что бы переданный state вообще возможен для данного instance
     * @param {number} top
     * @param {number} left
     * @param {number} scale
     */
    transform(top, left, scale) {
        const { content } = this;

        content.currentWidth = content.originalWidth * scale;
        content.currentHeight = content.originalHeight * scale;
        content.currentLeft = left;
        content.currentTop = top;
        content.currentScale = scale;

        this._transform();
    },
    zoomUp() {
        this._zoom(this._computeScale(-1));
    },
    zoomDown() {
        this._zoom(this._computeScale(1));
    },
    maxZoomUp() {
        this._zoom(this.content.maxScale);
    },
    maxZoomDown() {
        this._zoom(this.content.minScale);
    },
    zoomUpToPoint(coordinates) {
        this._zoom(this._computeScale(-1), coordinates);
    },
    zoomDownToPoint(coordinates) {
        this._zoom(this._computeScale(1), coordinates);
    },
    maxZoomUpToPoint(coordinates) {
        this._zoom(this.content.maxScale, coordinates);
    },
    destroy() {
        this.content.$element.style.removeProperty('transition');
        this.content.$element.style.removeProperty('transform');

        if (this.options.type === 'image') {
            off(this.content.$element, 'load', this._init);
        }

        this._destroyObservers();

        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                this[key] = null;
            }
        }
    }
};

/**
 * @param {?WZoomOptions} targetOptions
 * @param {?WZoomOptions} defaultOptions
 * @returns {?WZoomOptions}
 */
function optionsConstructor(targetOptions, defaultOptions) {
    const options = Object.assign({}, defaultOptions, targetOptions);

    if (isTouch()) {
        options.smoothTime = 0;
        options.smoothTimeDrag = 0;
    } else {
        const smoothTime = Number(options.smoothTime);
        const smoothTimeDrag = Number(options.smoothTimeDrag);

        options.smoothTime = !isNaN(smoothTime) ? smoothTime : wZoomDefaultOptions.smoothTime;
        options.smoothTimeDrag = !isNaN(smoothTimeDrag) ? smoothTimeDrag : options.smoothTime;
    }

    return options;
}

/**
 * Create WZoom instance
 * @param {string|HTMLElement} selectorOrHTMLElement
 * @param {WZoomOptions} [options]
 * @returns {WZoom}
 */
WZoom.create = function (selectorOrHTMLElement, options = {}) {
    return new WZoom(selectorOrHTMLElement, options);
};

export default WZoom;

/**
 * @typedef WZoomContent
 * @type {Object}
 * @property {HTMLElement} [$element]
 * @property {number} [originalWidth]
 * @property {number} [originalHeight]
 * @property {number[]} [originalScale]
 * @property {string} [originalTranslateZ]
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
