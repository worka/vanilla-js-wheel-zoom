import { getElementPosition, getPageScrollLeft, getPageScrollTop } from './toolkit';

/**
 * @param {string} align
 * @param {WZoomContent} content
 * @param {WZoomWindow} window
 * @returns {number[]}
 */
export function calculateAlignPoint(align, content, window) {
    let pointX = 0;
    let pointY = 0;

    switch (align) {
        case 'top':
            pointY = (content.currentHeight - window.originalHeight) / 2;
            break;
        case 'right':
            pointX = (content.currentWidth - window.originalWidth) / 2 * -1;
            break;
        case 'bottom':
            pointY = (content.currentHeight - window.originalHeight) / 2 * -1;
            break;
        case 'left':
            pointX = (content.currentWidth - window.originalWidth) / 2;
            break;
    }

    return [ pointX, pointY ];
}

/**
 * @param {string} align
 * @param {WZoomContent} content
 * @param {WZoomWindow} window
 * @returns {number[]}
 */
export function calculateCorrectPoint(align, content, window) {
    let pointX = Math.max(0, (window.originalWidth - content.currentWidth) / 2);
    let pointY = Math.max(0, (window.originalHeight - content.currentHeight) / 2);

    switch (align) {
        case 'top':
            pointY = 0;
            break;
        case 'right':
            pointX = 0;
            break;
        case 'bottom':
            pointY = pointY * 2
            break;
        case 'left':
            pointX = pointX * 2;
            break;
    }

    return [ pointX, pointY ];
}

export function calculateContentShift(axisValue, axisScroll, axisWindowPosition, axisContentPosition, originalWindowSize, contentSizeRatio) {
    const windowShift = axisValue + axisScroll - axisWindowPosition;
    const centerWindowShift = originalWindowSize / 2 - windowShift;
    const centerContentShift = centerWindowShift + axisContentPosition;

    return centerContentShift * contentSizeRatio - centerContentShift + axisContentPosition;
}

export function calculateContentMaxShift(align, originalWindowSize, correctCoordinate, size, shift) {
    switch (align) {
        case 'left':
            if (size / 2 - shift < originalWindowSize / 2) {
                shift = (size - originalWindowSize) / 2;
            }
            break;
        case 'right':
            if (size / 2 + shift < originalWindowSize / 2) {
                shift = (size - originalWindowSize) / 2 * -1;
            }
            break;
        default:
            if ((size - originalWindowSize) / 2 + correctCoordinate < Math.abs(shift)) {
                const positive = shift < 0 ? -1 : 1;
                shift = ((size - originalWindowSize) / 2 + correctCoordinate) * positive;
            }
    }

    return shift;
}

/**
 * @param {WZoomWindow} window
 * @returns {{x: number, y: number}}
 */
export function calculateWindowCenter(window) {
    const windowPosition = getElementPosition(window.$element);

    return {
        x: windowPosition.left + (window.originalWidth / 2) - getPageScrollLeft(),
        y: windowPosition.top + (window.originalHeight / 2) - getPageScrollTop(),
    };
}
