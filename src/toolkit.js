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

/**
 * @param number number
 * @returns {[]}
 */
export function numberExtinction(number) {
    const k = 2;
    const maxAvailableLength = 12 * k;
    const minAvailableLength = k;
    const forTail = [20, 7, 6, 5, 4];

    const numbers = [];
    const direction = number > 0 ? 1 : -1;

    let length = Math.abs(number) * k;
    length = length && length > maxAvailableLength ? maxAvailableLength : length;
    length = length && length < minAvailableLength ? minAvailableLength : length;

    number = length / k * direction;

    function generateTail(data) {
        const result = [];

        for (let i = data.length - 1; i >= 0; i--) {
            for (let j = 0; j < data[i]; j++) {
                result.push((i + 1) * direction);
            }
        }

        return result;
    }

    for (let i = 0; i < length - forTail.length; i++) {
        numbers.push((number * k) - (i * direction));
    }

    return numbers.length ? numbers.concat(generateTail(forTail)) : [];
}

export function isTouch() {
    return 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

export function eventClientX(event) {
    return event.type === 'wheel' ||
    event.type === 'mousedown' ||
    event.type === 'mousemove' ||
    event.type === 'mouseup' ? event.clientX : event.changedTouches[0].clientX;
}

export function eventClientY(event) {
    return event.type === 'wheel' ||
    event.type === 'mousedown' ||
    event.type === 'mousemove' ||
    event.type === 'mouseup' ? event.clientY : event.changedTouches[0].clientY;
}
