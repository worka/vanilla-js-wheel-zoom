/**
 * @class DragScrollable
 * @param {Element} scrollable
 * @constructor
 */
function DragScrollable(scrollable) {
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);

    this.scrollable = scrollable;
    this.scrollable.addEventListener('mousedown', this.mouseDownHandler);
}

DragScrollable.prototype = {
    constructor: DragScrollable,
    scrollable: null,
    coords: null,
    mouseDownHandler: function (event) {
        event.preventDefault();

        if (event.buttons !== 1) {
            return false;
        }

        this.coords = {
            left: event.clientX,
            top: event.clientY
        };

        document.addEventListener('mouseup', this.mouseUpHandler);
        document.addEventListener('mousemove', this.mouseMoveHandler);
    },
    mouseUpHandler: function (event) {
        event.preventDefault();

        document.removeEventListener('mouseup', this.mouseUpHandler);
        document.removeEventListener('mousemove', this.mouseMoveHandler);
    },
    mouseMoveHandler: function (event) {
        event.preventDefault();

        this.scrollable.scrollLeft = this.scrollable.scrollLeft - (event.clientX - this.coords.left);
        this.scrollable.scrollTop = this.scrollable.scrollTop - (event.clientY - this.coords.top);

        this.coords = {
            left: event.clientX,
            top: event.clientY
        };
    }
};

export default DragScrollable;
