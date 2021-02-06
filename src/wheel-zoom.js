import { getElementPosition, extendObject, on, off, eventClientX, eventClientY, isTouch } from './toolkit';
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

    this._wheelHandler = _wheelHandler.bind(this);
    this._downHandler = _downHandler.bind(this);
    this._upHandler = _upHandler.bind(this);

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
    this.clickExpired = true;
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
        // minimum allowed proportion of scale
        minScale: null,
        // maximum allowed proportion of scale
        maxScale: 1,
        // content resizing speed
        speed: 50,
        // zoom to maximum (minimum) size on click
        zoomOnClick: true,
        // if is true, then when the source image changes, the plugin will automatically restart init function (used with type = image)
        // attention: if false, it will work correctly only if the images are of the same size
        watchImageChange: true
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

        if (this.options.dragScrollable === true) {
            // this can happen if the src of this.content.$element (when type = image) is changed and repeat event load at image
            if (this.dragScrollable) {
                this.dragScrollable.destroy();
            }

            this.dragScrollable = new DragScrollable(this.window, this.content, this.options.dragScrollableOptions);
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

        const { body, documentElement } = document;

        const scrollLeft = window.pageXOffset || documentElement.scrollLeft || body.scrollLeft;
        const scrollTop = window.pageYOffset || documentElement.scrollTop || body.scrollTop;

        // calculate the parameters along the X axis
        const leftWindowShiftX = x + scrollLeft - window.positionLeft;
        const centerWindowShiftX = window.originalWidth / 2 - leftWindowShiftX;
        const centerContentShiftX = centerWindowShiftX + content.currentLeft;
        let contentNewLeft = centerContentShiftX * (contentNewWidth / content.currentWidth) - centerContentShiftX + content.currentLeft;

        // check that the content does not go beyond the X axis
        if (this.direction === -1 && (contentNewWidth - window.originalWidth) / 2 + content.correctX < Math.abs(contentNewLeft)) {
            const positive = contentNewLeft < 0 ? -1 : 1;
            contentNewLeft = ((contentNewWidth - window.originalWidth) / 2 + content.correctX) * positive;
        }

        // calculate the parameters along the Y axis
        const topWindowShiftY = y + scrollTop - window.positionTop;
        const centerWindowShiftY = window.originalHeight / 2 - topWindowShiftY;
        const centerContentShiftY = centerWindowShiftY + content.currentTop;
        let contentNewTop = centerContentShiftY * (contentNewHeight / content.currentHeight) - centerContentShiftY + content.currentTop;

        // check that the content does not go beyond the Y axis
        if (this.direction === -1 && (contentNewHeight - window.originalHeight) / 2 + content.correctY < Math.abs(contentNewTop)) {
            const positive = contentNewTop < 0 ? -1 : 1;
            contentNewTop = ((contentNewHeight - window.originalHeight) / 2 + content.correctY) * positive;
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

        const { window } = this;
        const { body, documentElement } = document;

        const scrollLeft = window.pageXOffset || documentElement.scrollLeft || body.scrollLeft;
        const scrollTop = window.pageYOffset || documentElement.scrollTop || body.scrollTop;

        this._transform(
            this._computeNewPosition(
                this._computeNewScale(direction), {
                    x: windowPosition.left + (this.window.originalWidth / 2) - scrollLeft,
                    y: windowPosition.top + (this.window.originalHeight / 2) - scrollTop
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
    },
    destroy() {
        this.content.$element.style.transform = '';

        if (this.options.type === 'image') {
            off(this.content.$element, 'load', this._init);
        }

        off(this.window.$element, 'wheel', this._wheelHandler);

        if (this.options.zoomOnClick) {
            off(this.window.$element, this.events.down, this._downHandler, this.events.options);
            off(this.window.$element, this.events.up, this._upHandler, this.events.options);
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
    event.preventDefault();

    this._transform(
        this._computeNewPosition(
            this._computeNewScale(event.deltaY),
            { x: eventClientX(event), y: eventClientY(event) }
        )
    );
}

function _downHandler(event) {
    if ((this.isTouch && event.touches.length === 1) || event.buttons === 1) {
        this.clickExpired = false;
        setTimeout(() => this.clickExpired = true, 150);
    }
}

function _upHandler(event) {
    if (!this.clickExpired) {
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
}

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
