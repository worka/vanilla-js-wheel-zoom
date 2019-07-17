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
            this.container = this.image.parentNode;

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
        original: {image: {}, container: {}},
        options: null,
        _init: function () {
            this.original.image = {
                width: this.image.offsetWidth,
                height: this.image.offsetHeight
            };

            this._prepare();

            this.container.addEventListener('mousewheel', this._rescale);

            window.addEventListener('resize', this._rescale);
        },
        _prepare: function () {
            var container_original_rectangle = this.container.getBoundingClientRect();

            this.original.container = {
                width: this.container.offsetWidth,
                height: this.container.offsetHeight,
                left: container_original_rectangle.left,
                top: container_original_rectangle.top
            };

            if (typeof this.options.prepare === 'function') {
                this.options.prepare();
            }

            this._rescale();
        },
        _rescale: function (event) {
            var delta = -100000;

            var image_current_width = this.image.offsetWidth;
            var image_current_height = this.image.offsetHeight;

            if (typeof event !== 'undefined' && event instanceof WheelEvent) {
                event.preventDefault();

                delta = event.wheelDelta > 0 || event.detail < 0 ? 1 : -1;
            }

            var scale = image_current_width / this.original.image.width;
            var min_scale = Math.min(this.original.container.width / this.original.image.width, this.original.container.height / this.original.image.height);
            var max_scale = 1;
            var new_scale = scale + (delta / (this.options.speed || 20));

            new_scale = (new_scale < min_scale) ? min_scale : (new_scale > max_scale ? max_scale : new_scale);

            var correct_x = Math.max(0, (this.original.container.width - this.original.image.width * new_scale) / 2);
            var correct_y = Math.max(0, (this.original.container.height - this.original.image.height * new_scale) / 2);

            var image_new_width = this.image.width = this.original.image.width * new_scale;
            var image_new_height = this.image.height = this.original.image.height * new_scale;

            this.image.style.marginLeft = correct_x + 'px';
            this.image.style.marginTop = correct_y + 'px';

            if (typeof this.options.rescale === 'function') {
                this.options.rescale(new_scale, correct_x, correct_y);
            }

            if (typeof event !== 'undefined' && event instanceof WheelEvent) {
                // var isset_left_scroll = !(!(this.container.scrollWidth - this.container.clientWidth));
                // var isset_top_scroll = !(!(this.container.scrollHeight - this.container.clientHeight));

                var x = Math.round(event.clientX - this.original.container.left + this.container.scrollLeft);
                var new_x = Math.round(image_new_width * x / image_current_width);
                var shift_x = new_x - x;

                // if (correct_x > Math.abs(shift_x)) {
                //     this.image.style.marginLeft = (correct_x + shift_x) + 'px';
                // } else if (correct_x > 0) {
                //     this.container.scrollLeft = shift_x + correct_x;
                //     this.image.style.marginLeft = 0;
                // } else {
                this.container.scrollLeft += shift_x;
                // }

                var y = Math.round(event.clientY - this.original.container.top + this.container.scrollTop);
                var new_y = Math.round(image_new_height * y / image_current_height);
                var shift_y = new_y - y;

                // if (correct_y > Math.abs(shift_y)) {
                //     this.image.style.marginTop = (correct_y + shift_y) + 'px';
                // } else if (correct_y > 0) {
                //     this.container.scrollTop = shift_y + correct_y;
                //     this.image.style.marginTop = 0;
                // } else {
                this.container.scrollTop += shift_y;
                // }
            }
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
