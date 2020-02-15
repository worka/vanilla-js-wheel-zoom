document.addEventListener('DOMContentLoaded', () => {
    const badge = document.querySelector('.badge');

    const jcWheelZoom = JcWheelZoom.create('img', {
        prepare: function (scale, correctX, correctY) {
            // do smth when image prepared

            if (!Object.keys(badge.dataset).length) {
                badge.dataset.width = badge.style.width.replace('px', '');
                badge.dataset.height = badge.style.height.replace('px', '');
                badge.dataset.left = badge.style.left.replace('px', '');
                badge.dataset.top = badge.style.top.replace('px', '');
            }

            badge.style.width = `${ badge.dataset.width * scale }px`;
            badge.style.height = `${ badge.dataset.height * scale }px`;
            badge.style.left = `${ badge.dataset.left * scale + correctX }px`;
            badge.style.top = `${ badge.dataset.top * scale + correctY }px`;
        },
        rescale: function (scale, correctX, correctY) {
            // do smth when image rescaled

            badge.style.width = `${ badge.dataset.width * scale }px`;
            badge.style.height = `${ badge.dataset.height * scale }px`;
            badge.style.left = `${ badge.dataset.left * scale + correctX }px`;
            badge.style.top = `${ badge.dataset.top * scale + correctY }px`;
        }
    });

    window.addEventListener('resize', () => {
        jcWheelZoom.prepare();
    });

    document.querySelector('[data-zoom-up]').addEventListener('click', () => {
        jcWheelZoom.zoomUp();
    });

    document.querySelector('[data-zoom-down]').addEventListener('click', () => {
        jcWheelZoom.zoomDown();
    });
});
