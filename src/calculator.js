import { getElementPosition, getPageScrollLeft, getPageScrollTop } from './toolkit';

/**
 * @param {WZoomViewport} viewport
 * @param {WZoomContent} content
 * @param {'top'|'right'|'bottom'|'left'|'center'} align
 * @returns {number[]}
 */
export function calculateAlignPoint(viewport, content, align) {
    let pointX = 0;
    let pointY = 0;

    switch (align) {
        case 'top':
            pointY = (content.currentHeight - viewport.originalHeight) / 2;
            break;
        case 'right':
            pointX = (content.currentWidth - viewport.originalWidth) / 2 * -1;
            break;
        case 'bottom':
            pointY = (content.currentHeight - viewport.originalHeight) / 2 * -1;
            break;
        case 'left':
            pointX = (content.currentWidth - viewport.originalWidth) / 2;
            break;
    }

    return [ pointX, pointY ];
}

/**
 * @param {WZoomViewport} viewport
 * @param {WZoomContent} content
 * @param {'top'|'right'|'bottom'|'left'|'center'} align
 * @returns {number[]}
 */
export function calculateCorrectPoint(viewport, content, align) {
    let pointX = Math.max(0, (viewport.originalWidth - content.currentWidth) / 2);
    let pointY = Math.max(0, (viewport.originalHeight - content.currentHeight) / 2);

    switch (align) {
        case 'top':
            pointY = 0;
            break;
        case 'right':
            pointX = 0;
            break;
        case 'bottom':
            pointY = pointY * 2;
            break;
        case 'left':
            pointX = pointX * 2;
            break;
    }

    return [ pointX, pointY ];
}

/**
 * @returns {number}
 */
export function calculateContentShift(axisValue, axisScroll, axisViewportPosition, axisContentPosition, originalViewportSize, contentSizeRatio) {
    const viewportShift = axisValue + axisScroll - axisViewportPosition;
    const centerViewportShift = originalViewportSize / 2 - viewportShift;
    const centerContentShift = centerViewportShift + axisContentPosition;

    return centerContentShift * contentSizeRatio - centerContentShift + axisContentPosition;
}

/**
 * @param {'top'|'right'|'bottom'|'left'|'center'} align
 * @param {number} originalViewportSize
 * @param {number} correctCoordinate
 * @param {number} size
 * @param {number} shift
 * @return {number}
 */
export function calculateContentMaxShift(align, originalViewportSize, correctCoordinate, size, shift) {
    const maxShift = (size - originalViewportSize) / 2;
    const halfSize = size / 2;
    const halfViewport = originalViewportSize / 2;

    switch (align) {
        case 'left':
            if (halfSize - shift < halfViewport) {
                shift = maxShift;
            }
            break;
        case 'right':
            if (halfSize + shift < halfViewport) {
                shift = maxShift * -1;
            }
            break;
        default:
            if (maxShift + correctCoordinate < Math.abs(shift)) {
                const direction = shift < 0 ? -1 : 1;
                shift = (maxShift + correctCoordinate) * direction;
            }
    }

    return shift;
}

/**
 * @param {WZoomViewport} viewport
 * @returns {{x: number, y: number}}
 */
export function calculateViewportCenter(viewport) {
    const viewportPosition = getElementPosition(viewport.$element);

    return {
        x: viewportPosition.left + (viewport.originalWidth / 2) - getPageScrollLeft(),
        y: viewportPosition.top + (viewport.originalHeight / 2) - getPageScrollTop(),
    };
}
