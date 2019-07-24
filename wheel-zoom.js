(function JcWheelZoomModule(factory) {
    "use strict";

    window.JcWheelZoom = factory();
})(function JcWheelZoomFactory() {
    /**
     * @class  JcWheelZoom
     * @param  {selector} selector
     * @param  {Object} [options]
     */
    function JcWheelZoom(selector, options) {
        for (var fn in this) {
            if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
                this[fn] = this[fn].bind(this);
            }
        }

        this.image = document.querySelector(selector);
        this.options = options;

        if (this.image !== null) {
            this.window = this.image.parentNode;

            if (this.image.complete) {
                this._init();
            } else {
                this.image.onload = this._init;
            }
        }
    }

    JcWheelZoom.prototype = {
        constructor: JcWheelZoom,
        image: null,
        container: null,
        window: null,
        original: {image: {}, window: {}},
        options: null,
        correct_x: null,
        correct_y: null,
        _init: function () {
            this.original.image = {
                width: this.image.offsetWidth,
                height: this.image.offsetHeight
            };

            this.container = document.createElement('div');

            this.window.appendChild(this.container);
            this.container.appendChild(this.image);

            this._prepare();

            this.window.addEventListener('mousewheel', this._rescale);

            window.addEventListener('resize', this._rescale);
        },
        _prepare: function () {
            var window_original_rectangle = this.window.getBoundingClientRect();

            this.original.window = {
                width: this.window.offsetWidth,
                height: this.window.offsetHeight,
                left: window_original_rectangle.left,
                top: window_original_rectangle.top
            };

            var min_scale = Math.min(this.original.window.width / this.original.image.width, this.original.window.height / this.original.image.height);

            this.correct_x = Math.max(0, (this.original.window.width - this.original.image.width * min_scale) / 2);
            this.correct_y = Math.max(0, (this.original.window.height - this.original.image.height * min_scale) / 2);

            this.image.width = this.original.image.width * min_scale;
            this.image.height = this.original.image.height * min_scale;

            this.image.style.marginLeft = this.correct_x + 'px';
            this.image.style.marginTop = this.correct_y + 'px';

            this.container.style.width = (this.image.width + (this.correct_x * 2)) + 'px';
            this.container.style.height = (this.image.height + (this.correct_y * 2)) + 'px';

            if (typeof this.options.prepare === 'function') {
                this.options.prepare(min_scale, this.correct_x, this.correct_y);
            }
        },
        _rescale: function (event) {
            event.preventDefault();

            var delta = event.wheelDelta > 0 || event.detail < 0 ? 1 : -1;

            var image_current_width = this.image.width;
            var image_current_height = this.image.height;

            var scale = image_current_width / this.original.image.width;
            var min_scale = Math.min(this.original.window.width / this.original.image.width, this.original.window.height / this.original.image.height);
            var max_scale = 1;
            var new_scale = scale + (delta / 10);

            new_scale = (new_scale < min_scale) ? min_scale : (new_scale > max_scale ? max_scale : new_scale);

            var image_new_width = this.image.width = this.original.image.width * new_scale;
            var image_new_height = this.image.height = this.original.image.height * new_scale;

            var container_current_width = image_current_width + (this.correct_x * 2);
            var container_current_height = image_current_height + (this.correct_y * 2);

            var container_new_width = image_new_width + (this.correct_x * 2);
            var container_new_height = image_new_height + (this.correct_y * 2);

            this.container.style.width = container_new_width + 'px';
            this.container.style.height = container_new_height + 'px';

            if (typeof this.options.rescale === 'function') {
                this.options.rescale(new_scale, this.correct_x, this.correct_y);
            }

            var x = Math.round(event.clientX - this.original.window.left + this.window.scrollLeft);
            var new_x = Math.round(container_new_width * x / container_current_width);
            var shift_x = new_x - x;

            this.window.scrollLeft += shift_x;

            var y = Math.round(event.clientY - this.original.window.top + this.window.scrollTop);
            var new_y = Math.round(container_new_height * y / container_current_height);
            var shift_y = new_y - y;

            this.window.scrollTop += shift_y;
        }
    };

    /**
     * Create JcWheelZoom instance
     * @param {selector} selector
     * @param {Object} [options]
     */
    JcWheelZoom.create = function (selector, options) {
        return new JcWheelZoom(selector, options);
    };

    // Export
    return JcWheelZoom;
});
