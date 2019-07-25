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
            // для window берем просто родителя
            this.window = this.image.parentNode;

            // если изображение уже загрузилось
            if (this.image.complete) {
                this._init();
            } else {
                // если вдруг изображение ещё не загрузилось, то ждём
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
            // оригинальные размеры изображения
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
            // оригинальные размеры window
            this.original.window = {
                width: this.window.offsetWidth,
                height: this.window.offsetHeight
            };

            // минимально разрешенная пропорция масштаба
            var min_scale = Math.min(this.original.window.width / this.original.image.width, this.original.window.height / this.original.image.height);

            // вычисляем margin-left и margin-top что бы отцентровать изображение
            this.correct_x = Math.max(0, (this.original.window.width - this.original.image.width * min_scale) / 2);
            this.correct_y = Math.max(0, (this.original.window.height - this.original.image.height * min_scale) / 2);

            this.image.width = this.original.image.width * min_scale;
            this.image.height = this.original.image.height * min_scale;

            // центруем изображение
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

            // размеры изображения в данный момент
            var image_current_width = this.image.width;
            var image_current_height = this.image.height;

            // текущая пропорция масштаба
            var scale = image_current_width / this.original.image.width;
            // минимально разрешенная пропорция масштаба
            var min_scale = Math.min(this.original.window.width / this.original.image.width, this.original.window.height / this.original.image.height);
            // максимально разрешенная пропорция масштаба
            var max_scale = 1;
            // пропорция масштаба которую будем устанавливать
            var new_scale = scale + (delta / 10);

            new_scale = (new_scale < min_scale) ? min_scale : (new_scale > max_scale ? max_scale : new_scale);

            // скролл по оси X до того как изменили размер
            var scroll_left_before_rescale = this.window.scrollLeft;
            // скролл по оси Y до того как изменили размер
            var scroll_top_before_rescale = this.window.scrollTop;

            // новые размеры изображения которые будем устанавливать
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

            // скролл по оси X после того как изменили размер
            var scroll_left_after_rescale = this.window.scrollLeft;
            // скролл по оси Y после того как изменили размер
            var scroll_top_after_rescale = this.window.scrollTop;

            var window_coords = getCoords(this.window);

            // setTimeout(() => {
            var x = Math.round(event.pageX - window_coords.left + this.window.scrollLeft - this.correct_x);
            var new_x = Math.round(image_new_width * x / image_current_width);
            var shift_x = new_x - x;

            this.window.scrollLeft += shift_x + (scroll_left_before_rescale - scroll_left_after_rescale);

            console.log(scroll_left_before_rescale, scroll_left_after_rescale,/*x, new_x, */shift_x, this.window.scrollLeft);

            var y = Math.round(event.pageY - window_coords.top + this.window.scrollTop - this.correct_y);
            var new_y = Math.round(image_new_height * y / image_current_height);
            var shift_y = new_y - y;

            this.window.scrollTop += shift_y + (scroll_top_before_rescale - scroll_top_after_rescale);
            // }, 1000);
        }
    };

    // support old browsers
    function getCoords(elem) {
        var box = elem.getBoundingClientRect();

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return {
            top: top,
            left: left
        };
    }

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
