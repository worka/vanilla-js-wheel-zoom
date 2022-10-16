import { getElementPosition, getPageScrollLeft, getPageScrollTop } from './toolkit';

export function calculateAlignPoint(options, content, window) {
    let alignPointX = 0;
    let alignPointY = 0;

    switch (options.alignContent) {
        case 'left':
            alignPointX = (content.currentWidth - window.originalWidth) / 2;
            break;
        case 'top':
            alignPointY = (content.currentHeight - window.originalHeight) / 2;
            break;
        case 'right':
            alignPointX = (content.currentWidth - window.originalWidth) / 2 * -1;
            break;
        case 'bottom':
            alignPointY = (content.currentHeight - window.originalHeight) / 2 * -1;
            break;
    }

    return [ alignPointX, alignPointY ];
}

export function calculateCorrectPoint(options, content, window) {
    let correctX = Math.max(0, (window.originalWidth - content.currentWidth) / 2);
    let correctY = Math.max(0, (window.originalHeight - content.currentHeight) / 2);

    if (options.alignContent === 'left') correctX = correctX * 2;
    else if (options.alignContent === 'right') correctX = 0;

    if (options.alignContent === 'bottom') correctY = correctY * 2;
    else if (options.alignContent === 'top') correctY = 0;

    return [ correctX, correctY ];
}

export function calculateContentShift(axisValue, axisScroll, axisWindowPosition, axisContentPosition, originalWindowSize, contentSizeRatio) {
    const windowShift = axisValue + axisScroll - axisWindowPosition;
    const centerWindowShift = originalWindowSize / 2 - windowShift;
    const centerContentShift = centerWindowShift + axisContentPosition;

    return centerContentShift * contentSizeRatio - centerContentShift + axisContentPosition;
}

export function calculateContentMaxShift(options, originalWindowSize, correctCoordinate, size, shift) {
    switch (options.alignContent) {
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

export function calculateWindowCenter(window) {
    const windowPosition = getElementPosition(window.$element);

    return {
        x: windowPosition.left + (window.originalWidth / 2) - getPageScrollLeft(),
        y: windowPosition.top + (window.originalHeight / 2) - getPageScrollTop(),
    };
}
