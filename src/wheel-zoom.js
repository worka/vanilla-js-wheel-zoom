import {
    getElementPosition,
    getPageScrollLeft,
    getPageScrollTop,
    extendObject,
    on,
    off,
    eventClientX,
    eventClientY,
    isTouch,
} from './toolkit';
import {
    calculateAlignPoint,
    calculateContentMaxShift,
    calculateContentShift,
    calculateCorrectPoint,
    calculateWindowCenter,
} from './calculator';
import { dragScrollableDefaultOptions, wZoomDefaultOptions } from './default-options.js';
import DragScrollable from './drag-scrollable';
import Interactor from './interactor';

/**
 * @class WZoom
 * @param {string|HTMLElement} selectorOrHTMLElement
 * @param {WZoomOptions} options
 * @constructor
 */
function WZoom(selectorOrHTMLElement, options = {}) {
    this._init = this._init.bind(this);
    this._prepare = this._prepare.bind(this);
    this._computeNewScale = this._computeNewScale.bind(this);
    this._computeNewPosition = this._computeNewPosition.bind(this);
    this._transform = this._transform.bind(this);

    /** @type {WZoomContent} */
    this.content = {};
    this.content.elementInteractor = null;
    /** @type {WZoomWindow} */
    this.window = {};
    /** @type {WZoomOptions} */
    this.options = extendObject(wZoomDefaultOptions, options);

    this.isTouch = false;
    this.direction = 1;
    this.dragScrollable = null;

    if (typeof selectorOrHTMLElement === 'string') {
        this.content.$element = document.querySelector(selectorOrHTMLElement);
    } else if (selectorOrHTMLElement instanceof HTMLElement) {
        this.content.$element = selectorOrHTMLElement;
    } else {
        throw `WZoom: \`selectorOrHTMLElement\` must be selector or HTMLElement, and not ${ {}.toString.call(selectorOrHTMLElement) }`;
    }

    // check if we're using a touch screen
    this.isTouch = isTouch();

    if (this.content.$element) {
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
    /**
     * @private
     */
    _init() {
        this._prepare();

        if (this.content.elementInteractor) {
            this.content.elementInteractor.destroy();
        }

        this.content.elementInteractor = new Interactor(this.content.$element);

        if (this.options.dragScrollable === true) {
            // this can happen if the src of this.content.$element (when type = image) is changed and repeat event load at image
            if (this.dragScrollable) {
                this.dragScrollable.destroy();
            }

            this.setDragScrollable(new DragScrollable(this.window, this.content, this.options.dragScrollableOptions));
        }

        if (!this.options.disableWheelZoom) {
            // support for zoom and pinch on touch screen devices
            if (this.isTouch) {
                this.content.elementInteractor.on('pinchtozoom', (event) => {
                    const { clientX, clientY, direction } = event.data;

                    this._transform(
                        this._computeNewPosition(
                            this._computeNewScale(direction), {
                                x: clientX,
                                y: clientY,
                            }
                        )
                    );
                });
            }

            this.content.elementInteractor.on('wheel', (event) => {
                event.preventDefault();

                const direction = this.options.reverseWheelDirection ? -event.deltaY : event.deltaY;

                this._transform(
                    this._computeNewPosition(
                        this._computeNewScale(direction), {
                            x: eventClientX(event),
                            y: eventClientY(event),
                        }
                    )
                );
            });
        }

        if (this.options.zoomOnClick || this.options.zoomOnDblClick) {
            const eventType = this.options.zoomOnDblClick ? 'dblclick' : 'click';

            this.content.elementInteractor.on(eventType, (event) => {
                this._transform(
                    this._computeNewPosition(
                        this.direction === 1 ? this.content.maxScale : this.content.minScale, {
                            x: eventClientX(event),
                            y: eventClientY(event),
                        }
                    )
                );

                this.direction *= -1;
            });
        }
    },
    /**
     * @private
     */
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

        const [ alignPointX, alignPointY ] = calculateAlignPoint(this.options.alignContent, this.content, this.window);

        this.content.alignPointX = alignPointX;
        this.content.alignPointY = alignPointY;

        // calculate indent-left and indent-top to of content from window borders
        const [ correctX, correctY ] = calculateCorrectPoint(this.options.alignContent, this.content, this.window);

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
    /**
     * @private
     */
    _computeNewScale(direction) {
        this.direction = direction < 0 ? 1 : -1;

        const { minScale, maxScale, currentScale } = this.content;

        let contentNewScale = currentScale + (this.direction / this.options.speed);

        if (contentNewScale < minScale) {
            this.direction = 1;
        } else if (contentNewScale > maxScale) {
            this.direction = -1;
        }

        return contentNewScale < minScale ? minScale : (contentNewScale > maxScale ? maxScale : contentNewScale);
    },
    /**
     * @private
     */
    _computeNewPosition(contentNewScale, { x, y }) {
        const { window, content } = this;

        const contentNewWidth = content.originalWidth * contentNewScale;
        const contentNewHeight = content.originalHeight * contentNewScale;

        const scrollLeft = getPageScrollLeft();
        const scrollTop = getPageScrollTop();

        // calculate the parameters along the X axis
        let contentNewLeft = calculateContentShift(x, scrollLeft, window.positionLeft, content.currentLeft, window.originalWidth, contentNewWidth / content.currentWidth);

        // calculate the parameters along the Y axis
        let contentNewTop = calculateContentShift(y, scrollTop, window.positionTop, content.currentTop, window.originalHeight, contentNewHeight / content.currentHeight);

        if (this.direction === -1) {
            // check that the content does not go beyond the X axis
            contentNewLeft = calculateContentMaxShift(this.options.alignContent, window.originalWidth, content.correctX, contentNewWidth, contentNewLeft);

            // check that the content does not go beyond the Y axis
            contentNewTop = calculateContentMaxShift(this.options.alignContent, window.originalHeight, content.correctY, contentNewHeight, contentNewTop);
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
    /**
     * @private
     */
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
    /**
     * @private
     */
    _zoom(scale, coordinates) {
        // if the coordinates are not passed, then use the coordinates of the center
        if (coordinates === undefined || coordinates.x === undefined || coordinates.y === undefined) {
            coordinates = calculateWindowCenter(this.window);
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

        if (this.content.elementInteractor) {
            this.content.elementInteractor.destroy();
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

/**
 * Create WZoom instance
 * @param {string|HTMLElement} selectorOrHTMLElement
 * @param {WZoomOptions} [options]
 * @returns {WZoom}
 */
WZoom.create = function (selectorOrHTMLElement, options) {
    options.smoothExtinction = Number(options.smoothExtinction) || wZoomDefaultOptions.smoothExtinction;

    if (options.dragScrollableOptions) {
        options.dragScrollableOptions.smoothExtinction =
            Number(options.dragScrollableOptions.smoothExtinction) || dragScrollableDefaultOptions.smoothExtinction;
    }

    return new WZoom(selectorOrHTMLElement, options);
};

export default WZoom;

// @todo define types without any

/**
 * @typedef WZoomContent
 * @type {object}
 * @property {?Interactor} elementInteractor,
 * @property {HTMLElement} [$element],
 * @property {any} [originalWidth],
 * @property {any} [originalHeight],
 * @property {any} [currentWidth],
 * @property {any} [currentHeight],
 * @property {any} [currentLeft],
 * @property {any} [currentTop],
 * @property {any} [currentScale],
 * @property {any} [maxScale],
 * @property {any} [minScale],
 * @property {any} [alignPointX],
 * @property {any} [alignPointY],
 * @property {any} [correctX],
 * @property {any} [correctY],
 */

/**
 * @typedef WZoomWindow
 * @type {object}
 * @property {HTMLElement} [$element],
 * @property {any} [originalWidth],
 * @property {any} [originalHeight],
 * @property {any} [positionLeft]
 * @property {any} [positionTop]
 */
