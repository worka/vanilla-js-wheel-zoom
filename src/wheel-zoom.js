import DragScrollable from './drag-scrollable';
import { getElementPosition, extendObject, on, getClientX, getClientY } from './toolkit';

/**
 * @class JcWheelZoom
 * @param {string} selector
 * @param {Object} options
 * @constructor
 */
function JcWheelZoom(selector, options = {}) {
    this._init = this._init.bind(this);
    this._prepare = this._prepare.bind(this);
    this._computeNewScale = this._computeNewScale.bind(this);
    this._computeNewPosition = this._computeNewPosition.bind(this);
    this._transform = this._transform.bind(this);

    const defaults = {
        // drag scrollable `image`
        dragScrollable: true,
        // options for the DragScrollable module
        dragScrollableOptions: {},
        // maximum allowed proportion of scale
        maxScale: 1,
        // `image` resizing speed
        speed: 10
    };

    this.content.$element = document.querySelector(selector);

    // check if we're using a touch screen
    this.isTouch = 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    // switch to touch events if using a touch screen
    this.events = this.isTouch ? { down: 'touchstart', up: 'touchend' } : { down: 'mousedown', up: 'mouseup' };
    // if using touch screen tells the browser that the default action will not be undone
    this.events.options = this.isTouch ? { passive: true } : false;

    if (this.content.$element) {
        this.options = extendObject(defaults, options);

        // for window take just the parent
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
    _init() {
        // original `image` sizes and transform data
        this.content.originalWidth = this.content.$element.naturalWidth;
        this.content.originalHeight = this.content.$element.naturalHeight;
        this.content.minScale = 1;
        this.content.maxScale = round(this.content.$element.naturalWidth / this.content.$element.offsetWidth * this.options.maxScale);

        // initial `image` sizes
        this.content.initialWidth = this.content.$element.offsetWidth;
        this.content.initialHeight = this.content.$element.offsetHeight;

        // current `image` sizes and transform data
        this.content.currentWidth = this.content.$element.offsetWidth;
        this.content.currentHeight = this.content.$element.offsetHeight;
        this.content.currentLeft = 0;
        this.content.currentTop = 0;
        this.content.currentScale = 1;

        this._prepare();

        on(this.window.$element, 'wheel', event => {
            event.preventDefault();

            this._transform(
                this._computeNewPosition(
                    this._computeNewScale(event.deltaY), { x: getClientX(event), y: getClientY(event) }));
        });

        on(self, 'resize', event => {
            event.preventDefault();

            this._prepare();
            this._transform(
                this._computeNewPosition(
                    1, { x: getClientX(event), y: getClientY(event) }));
        });

        // processing of the event "max / min zoom" begin only if there was really just a click
        // so as not to interfere with the DragScrollable module
        let clickExpired = true;

        on(this.window.$element, this.events.down, () => {
            clickExpired = false;
            setTimeout(() => clickExpired = true, 150);
        }, this.events.options);

        on(this.window.$element, this.events.up, event => {
            if (!clickExpired) {
                this._transform(this._computeNewPosition(this.direction === 1 ? this.content.maxScale : 1, {
                    x: getClientX(event),
                    y: getClientY(event)
                }));
                this.direction = this.direction * -1;
            }
        }, this.events.options);
    },
    _prepare() {
        const windowPosition = getElementPosition(this.window.$element);

        // original window sizes and position
        this.window.originalWidth = this.window.$element.offsetWidth;
        this.window.originalHeight = this.window.$element.offsetHeight;
        this.window.positionLeft = windowPosition.left;
        this.window.positionTop = windowPosition.top;

        // calculate margin-left and margin-top to center the `image`
        this.correctX = Math.max(0, (this.window.originalWidth - this.content.currentWidth) / 2);
        this.correctY = Math.max(0, (this.window.originalHeight - this.content.currentHeight) / 2);
    },
    _computeNewScale(delta) {
        this.direction = delta < 0 ? 1 : -1;

        const { minScale, maxScale, currentScale } = this.content;

        let contentNewScale = currentScale + (this.direction / this.options.speed);

        return contentNewScale < minScale ? minScale : (contentNewScale > maxScale ? maxScale : contentNewScale);
    },
    _computeNewPosition(contentNewScale, { x, y }) {
        const { window, content, correctX, correctY } = this;

        const contentNewWidth = content.initialWidth * contentNewScale;
        const contentNewHeight = content.initialHeight * contentNewScale;

        // calculate the parameters along the X axis
        const leftWindowShiftX = x - window.positionLeft;
        const centerWindowShiftX = window.originalWidth / 2 - leftWindowShiftX;
        const centerContentShiftX = centerWindowShiftX + content.currentLeft;
        let contentNewLeft = centerContentShiftX * (contentNewWidth / content.currentWidth) - centerContentShiftX + content.currentLeft;

        // check that the content does not go beyond the X axis
        if ((contentNewWidth - window.originalWidth) / 2 + correctX < Math.abs(centerContentShiftX - centerWindowShiftX)) {
            contentNewLeft = (contentNewWidth - window.originalWidth) / 2 + correctX;
            if (centerContentShiftX - centerWindowShiftX < 0) contentNewLeft = contentNewLeft * -1;
        }

        // calculate the parameters along the Y axis
        const topWindowShiftY = y - window.positionTop;
        const centerWindowShiftY = window.originalHeight / 2 - topWindowShiftY;
        const centerContentShiftY = centerWindowShiftY + content.currentTop;
        let contentNewTop = centerContentShiftY * (contentNewHeight / content.currentHeight) - centerContentShiftY + content.currentTop;

        // check that the content does not go beyond the Y axis
        if ((contentNewHeight - window.originalHeight) / 2 + correctY < Math.abs(centerContentShiftY - centerWindowShiftY)) {
            contentNewTop = (contentNewHeight - window.originalHeight) / 2 + correctY;
            if (centerContentShiftY - centerWindowShiftY < 0) contentNewTop = contentNewTop * -1;
        }

        if (contentNewScale === 1) {
            contentNewLeft = contentNewTop = 0;
        }

        content.currentWidth = round(contentNewWidth);
        content.currentHeight = round(contentNewHeight);
        content.currentLeft = round(contentNewLeft);
        content.currentTop = round(contentNewTop);
        content.currentScale = round(contentNewScale);

        return {
            currentLeft: content.currentLeft,
            newLeft: contentNewLeft,
            currentTop: content.currentTop,
            newTop: contentNewTop,
            currentScale: content.currentScale,
            newScale: contentNewScale
        };
    },
    _transform({ currentLeft, newLeft, currentTop, newTop, currentScale, newScale }, iterations = 1) {
        this.content.$element.style.transform = newScale === 1 ? null :
            `translate3d(${ newLeft }px, ${ newTop }px, 0px) scale(${ newScale })`;
    }
};

function round(float) {
    return float;
    // return Math.ceil(float * 10) / 10;
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

export default JcWheelZoom;
