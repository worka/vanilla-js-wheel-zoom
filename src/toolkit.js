/**
 * Get element position (with support old browsers)
 * @param {Element} element
 * @returns {{top: number, left: number}}
 */
export function getElementPosition(element) {
    const box = element.getBoundingClientRect();

    const { body, documentElement } = document;

    const scrollTop = window.pageYOffset || documentElement.scrollTop || body.scrollTop;
    const scrollLeft = window.pageXOffset || documentElement.scrollLeft || body.scrollLeft;

    const clientTop = documentElement.clientTop || body.clientTop || 0;
    const clientLeft = documentElement.clientLeft || body.clientLeft || 0;

    const top = box.top + scrollTop - clientTop;
    const left = box.left + scrollLeft - clientLeft;

    return { top, left };
}

/**
 * Universal alternative to Object.assign()
 * @param {Object} destination
 * @param {Object} source
 * @returns {Object}
 */
export function extendObject(destination, source) {
    if (destination && source) {
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                destination[key] = source[key];
            }
        }
    }

    return destination;
}

/**
 * @param target
 * @param type
 * @param listener
 * @param options
 */
export function on(target, type, listener, options = false) {
    target.addEventListener(type, listener, options);
}

/**
 * @param target
 * @param type
 * @param listener
 * @param options
 */
export function off(target, type, listener, options = false) {
    target.removeEventListener(type, listener, options);
}

export function isTouch() {
    return 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

export function eventClientX(event) {
    return event.type === 'wheel' ||
    event.type === 'pointerup' ||
    event.type === 'pointerdown' ||
    event.type === 'pointermove' ||
    event.type === 'mousedown' ||
    event.type === 'mousemove' ||
    event.type === 'mouseup' ? event.clientX : event.changedTouches[0].clientX;
}

export function eventClientY(event) {
    return event.type === 'wheel' ||
    event.type === 'pointerup' ||
    event.type === 'pointerdown' ||
    event.type === 'pointermove' ||
    event.type === 'mousedown' ||
    event.type === 'mousemove' ||
    event.type === 'mouseup' ? event.clientY : event.changedTouches[0].clientY;
}
