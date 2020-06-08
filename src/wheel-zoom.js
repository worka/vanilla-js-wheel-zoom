import { getElementPosition, extendObject, on, eventClientX, eventClientY, isTouch } from './toolkit';
import DragScrollable from './drag-scrollable';

/**
 * @class WZoom
 * @param {string} selector
 * @param {Object} options
 * @constructor
 */
function WZoom(selector, options = {}) {
    this._init = this._init.bind(this);
    this._prepare = this._prepare.bind(this);
    this._computeNewScale = this._computeNewScale.bind(this);
    this._computeNewPosition = this._computeNewPosition.bind(this);
    this._transform = this._transform.bind(this);

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
        // maximum allowed proportion of scale
        maxScale: 1,
        // content resizing speed
        speed: 50
    };

    this.content.$element = document.querySelector(selector);

    // check if we're using a touch screen
    this.isTouch = isTouch();
    // switch to touch events if using a touch screen
    this.events = this.isTouch ? { down: 'touchstart', up: 'touchend' } : { down: 'mousedown', up: 'mouseup' };
    // if using touch screen tells the browser that the default action will not be undone
    this.events.options = this.isTouch ? { passive: true } : false;

    if (this.content.$element) {
        this.options = extendObject(defaults, options);

        // for window take just the parent
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
    _init() {
        this._prepare();

        if (this.options.dragScrollable === true) {
            new DragScrollable(this.window, this.content, this.options.dragScrollableOptions);
        }

        on(this.window.$element, 'wheel', event => {
            event.preventDefault();

            this._transform(
                this._computeNewPosition(
                    this._computeNewScale(event.deltaY),
                    { x: eventClientX(event), y: eventClientY(event) }
                )
            );
        });

        // processing of the event "max / min zoom" begin only if there was really just a click
        // so as not to interfere with the DragScrollable module
        let clickExpired = true;

        on(this.window.$element, this.events.down, event => {
            if ((this.isTouch && event.touches.length === 1) || event.buttons === 1) {
                clickExpired = false;
                setTimeout(() => clickExpired = true, 150);
            }
        }, this.events.options);

        on(this.window.$element, this.events.up, event => {
            if (!clickExpired) {
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
        }, this.events.options);
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
        this.content.minScale = Math.min(this.window.originalWidth / this.content.originalWidth, this.window.originalHeight / this.content.originalHeight);
        this.content.maxScale = this.options.maxScale;

        // current content sizes and transform data
        this.content.currentWidth = this.content.originalWidth * this.content.minScale;
        this.content.currentHeight = this.content.originalHeight * this.content.minScale;
        this.content.currentLeft = 0;
        this.content.currentTop = 0;
        this.content.currentScale = this.content.minScale;

        // calculate indent-left and indent-top to of content from window borders
        this.content.correctX = Math.max(0, (this.window.originalWidth - this.content.currentWidth) / 2);
        this.content.correctY = Math.max(0, (this.window.originalHeight - this.content.currentHeight) / 2);

        this.content.$element.style.transform = `translate3d(0px, 0px, 0px) scale(${ this.content.minScale })`;

        if (typeof this.options.prepare === 'function') {
            this.options.prepare();
        }
    },
    _computeNewScale(delta) {
        this.direction = delta < 0 ? 1 : -1;

        const { minScale, maxScale, currentScale } = this.content;

        let contentNewScale = currentScale + (this.direction / this.options.speed);

        return contentNewScale < minScale ? minScale : (contentNewScale > maxScale ? maxScale : contentNewScale);
    },
    _computeNewPosition(contentNewScale, { x, y }) {
        const { window, content } = this;

        const contentNewWidth = content.originalWidth * contentNewScale;
        const contentNewHeight = content.originalHeight * contentNewScale;

        const { body, documentElement } = document;

        const scrollLeft = window.pageXOffset || documentElement.scrollLeft || body.scrollLeft;
        const scrollTop = window.pageYOffset || documentElement.scrollTop || body.scrollTop;

        // calculate the parameters along the X axis
        const leftWindowShiftX = x + scrollLeft - window.positionLeft;
        const centerWindowShiftX = window.originalWidth / 2 - leftWindowShiftX;
        const centerContentShiftX = centerWindowShiftX + content.currentLeft;
        let contentNewLeft = centerContentShiftX * (contentNewWidth / content.currentWidth) - centerContentShiftX + content.currentLeft;

        // check that the content does not go beyond the X axis
        if ((contentNewWidth - window.originalWidth) / 2 + content.correctX < Math.abs(centerContentShiftX - centerWindowShiftX)) {
            contentNewLeft = (contentNewWidth - window.originalWidth) / 2 + content.correctX;
            if (centerContentShiftX - centerWindowShiftX < 0) contentNewLeft = contentNewLeft * -1;
        }

        // calculate the parameters along the Y axis
        const topWindowShiftY = y + scrollTop - window.positionTop;
        const centerWindowShiftY = window.originalHeight / 2 - topWindowShiftY;
        const centerContentShiftY = centerWindowShiftY + content.currentTop;
        let contentNewTop = centerContentShiftY * (contentNewHeight / content.currentHeight) - centerContentShiftY + content.currentTop;

        // check that the content does not go beyond the Y axis
        if ((contentNewHeight - window.originalHeight) / 2 + content.correctY < Math.abs(centerContentShiftY - centerWindowShiftY)) {
            contentNewTop = (contentNewHeight - window.originalHeight) / 2 + content.correctY;
            if (centerContentShiftY - centerWindowShiftY < 0) contentNewTop = contentNewTop * -1;
        }

        if (contentNewScale === this.content.minScale) {
            contentNewLeft = contentNewTop = 0;
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
        this.content.$element.style.transform = `translate3d(${ newLeft }px, ${ newTop }px, 0px) scale(${ newScale })`;

        if (typeof this.options.rescale === 'function') {
            this.options.rescale();
        }
    },
    _zoom(direction) {
        const windowPosition = getElementPosition(this.window.$element);

        this._transform(
            this._computeNewPosition(
                this._computeNewScale(direction), {
                    x: windowPosition.left + (this.window.originalWidth / 2),
                    y: windowPosition.top + (this.window.originalHeight / 2)
                }));
    },
    prepare() {
        this._prepare();
    },
    zoomUp() {
        this._zoom(-1);
    },
    zoomDown() {
        this._zoom(1);
    }
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

export default WZoom;
