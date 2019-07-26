# vanilla-js-wheel-zoom

Image resizing using mouse wheel + drag scrollable image

```
<script>
    document.addEventListener('DOMContentLoaded', function () {
        jcWheelZoom = JcWheelZoom.create('image_selector', {
            prepare: function (scale, correct_x, correct_y) {
                // do smth when image prepared
            },
            rescale: function (scale, correct_x, correct_y) {
                // do smth when image rescaled
            }
        });
    });
</script>
```

Default params

```
var defaults = {
    dragscrollable: true,
    speed: 10
};
```
