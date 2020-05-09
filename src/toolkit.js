/**
 * Get element coordinates (with support old browsers)
 * @param {Element} element
 * @returns {{top: number, left: number}}
 */
export function getElementCoordinates(element) {
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
 * @param {Array} destination
 * @param {Array} source
 * @returns {Array}
 */
export function extendArray(destination, source) {
    if (destination && source) {
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                destination[key] = source[key];
            }
        }
    }

    return destination;
}
