import {
    getElementPosition,
    getPageScrollLeft,
    getPageScrollTop,
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
    calculateViewportCenter,
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
    this._computeScale = this._computeScale.bind(this);
    this._computePosition = this._computePosition.bind(this);
    this._transform = this._transform.bind(this);

    /** @type {WZoomContent} */
    this.content = {};
    this.content.elementInteractor = null;
    /** @type {WZoomViewport} */
    this.viewport = {};
    /** @type {WZoomOptions} */
    this.options = Object.assign({}, wZoomDefaultOptions, options);

    if (typeof selectorOrHTMLElement === 'string') {
        this.content.$element = document.querySelector(selectorOrHTMLElement);
    } else if (selectorOrHTMLElement instanceof HTMLElement) {
        this.content.$element = selectorOrHTMLElement;
    } else {
        throw `WZoom: \`selectorOrHTMLElement\` must be selector or HTMLElement, and not ${ {}.toString.call(selectorOrHTMLElement) }`;
    }

    // check if we're using a touch screen
    this.isTouch = isTouch();
    this.direction = 1;
    this.dragScrollable = null;

    if (this.content.$element) {
        // @todo не нравится это место для этого действия
        if (this.options.minScale && this.options.minScale >= this.options.maxScale) {
            this.options.minScale = null;
        }

        // for viewport take just the parent
        this.viewport.$element = this.content.$element.parentNode;

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

            // @todo зачем тут setter
            this.setDragScrollable(new DragScrollable(this.viewport, this.content, this.options.dragScrollableOptions));
        }

        if (!this.options.disableWheelZoom) {
            // support for zoom and pinch on touch screen devices
            if (this.isTouch) {
                this.content.elementInteractor.on('pinchtozoom', (event) => {
                    const { clientX, clientY, direction } = event.data;

                    const scale = this._computeScale(direction);
                    const position = this._computePosition(scale, clientX, clientY);

                    this._transform(position.left, position.top, scale);
                });
            }

            this.content.elementInteractor.on('wheel', (event) => {
                event.preventDefault();

                const direction = this.options.reverseWheelDirection ? -event.deltaY : event.deltaY;
                const scale = this._computeScale(direction);
                const position = this._computePosition(scale, eventClientX(event), eventClientY(event));

                this._transform(position.left, position.top, scale);
            });
        }

        if (this.options.zoomOnClick || this.options.zoomOnDblClick) {
            const eventType = this.options.zoomOnDblClick ? 'dblclick' : 'click';

            this.content.elementInteractor.on(eventType, (event) => {
                const scale = this.direction === 1 ? this.content.maxScale : this.content.minScale;
                const position = this._computePosition(scale, eventClientX(event), eventClientY(event));

                this._transform(position.left, position.top, scale);

                this.direction *= -1;
            });
        }
    },
    /**
     * @private
     */
    _prepare() {
        const viewportPosition = getElementPosition(this.viewport.$element);

        // original viewport sizes and position
        this.viewport.originalWidth = this.viewport.$element.offsetWidth;
        this.viewport.originalHeight = this.viewport.$element.offsetHeight;
        this.viewport.positionLeft = viewportPosition.left;
        this.viewport.positionTop = viewportPosition.top;

        // original content sizes
        if (this.options.type === 'image') {
            this.content.originalWidth = this.options.width || this.content.$element.naturalWidth;
            this.content.originalHeight = this.options.height || this.content.$element.naturalHeight;
        } else {
            this.content.originalWidth = this.options.width || this.content.$element.offsetWidth;
            this.content.originalHeight = this.options.height || this.content.$element.offsetHeight;
        }

        // minScale && maxScale
        this.content.minScale = this.options.minScale || Math.min(this.viewport.originalWidth / this.content.originalWidth, this.viewport.originalHeight / this.content.originalHeight);
        this.content.maxScale = this.options.maxScale;

        // current content sizes and transform data
        this.content.currentWidth = this.content.originalWidth * this.content.minScale;
        this.content.currentHeight = this.content.originalHeight * this.content.minScale;

        const [ alignPointX, alignPointY ] = calculateAlignPoint(this.viewport, this.content, this.options.alignContent);

        // @todo можно избавиться от промежуточных переменных
        this.content.alignPointX = alignPointX;
        this.content.alignPointY = alignPointY;

        // calculate indent-left and indent-top to of content from viewport borders
        const [ correctX, correctY ] = calculateCorrectPoint(this.viewport, this.content, this.options.alignContent);

        // @todo можно избавиться от промежуточных переменных
        this.content.correctX = correctX;
        this.content.correctY = correctY;

        this.content.currentLeft = this.content.alignPointX;
        this.content.currentTop = this.content.alignPointY;
        this.content.currentScale = this.content.minScale;

        // @todo this._transform
        this.content.$element.style.transform = `translate3d(${ this.content.alignPointX }px, ${ this.content.alignPointY }px, 0px) scale(${ this.content.minScale })`;

        if (typeof this.options.prepare === 'function') {
            this.options.prepare();
        }
    },
    /**
     * @private
     */
    _computeScale(direction) {
        this.direction = direction < 0 ? 1 : -1;

        const { minScale, maxScale, currentScale } = this.content;

        let scale = currentScale + (this.direction / this.options.speed);

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
    _computePosition(scale, x, y) {
        const { viewport, content, options, direction } = this;

        const contentNewWidth = content.originalWidth * scale;
        const contentNewHeight = content.originalHeight * scale;

        const scrollLeft = getPageScrollLeft();
        const scrollTop = getPageScrollTop();

        // calculate the parameters along the X axis
        let contentNewLeft = calculateContentShift(x, scrollLeft, viewport.positionLeft, content.currentLeft, viewport.originalWidth, contentNewWidth / content.currentWidth);
        // calculate the parameters along the Y axis
        let contentNewTop = calculateContentShift(y, scrollTop, viewport.positionTop, content.currentTop, viewport.originalHeight, contentNewHeight / content.currentHeight);

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
    _transform(left, top, scale) {
        if (this.options.smoothExtinction) {
            this.content.$element.style.transition = `transform ${ this.options.smoothExtinction }s`;
        } else {
            this.content.$element.style.removeProperty('transition');
        }

        this.content.$element.style.transform = `translate3d(${ left }px, ${ top }px, 0px) scale(${ scale })`;

        if (typeof this.options.rescale === 'function') {
            this.options.rescale();
        }
    },
    /**
     * @TODO добавить проверку на то что бы переданные координаты не выходили за пределы возможного
     * @param {number} scale
     * @param {Object} coordinates
     * @private
     */
    _zoom(scale, coordinates = {}) {
        // if the coordinates are not passed, then use the coordinates of the center
        if (coordinates.x === undefined || coordinates.y === undefined) {
            coordinates = calculateViewportCenter(this.viewport);
        }

        const position = this._computePosition(scale, coordinates.x, coordinates.y);

        this._transform(position.left, position.top, scale);
    },
    prepare() {
        this._prepare();
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
WZoom.create = function (selectorOrHTMLElement, options = {}) {
    options.smoothExtinction = Number(options.smoothExtinction) || wZoomDefaultOptions.smoothExtinction;

    if (options.dragScrollableOptions) {
        options.dragScrollableOptions.smoothExtinction =
            Number(options.dragScrollableOptions.smoothExtinction) || dragScrollableDefaultOptions.smoothExtinction;
    }

    return new WZoom(selectorOrHTMLElement, options);
};

export default WZoom;

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
