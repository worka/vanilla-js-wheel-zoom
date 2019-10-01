# vanilla-js-wheel-zoom

Image resizing using mouse wheel + drag scrollable image

Advantages: the ability to fit the image into a container of any proportion

<a href="https://worka.github.io/wheel-zoom.html">Demo</a>

``` html
<html>
<head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">

    <script src="wheel-zoom.js"></script>
</head>
<body>
    <div style="margin:20px;width:600px">
        <div style="margin:20px 0">
            <div style="float:right">
                <a href="javascript:;" id="zoom_up">Zoom Up</a>
            </div>

            <div>
                <a href="javascript:;" id="zoom_down">Zoom Down</a>
            </div>
        </div>

        <div style="width:600px;height:600px;overflow:auto;background:#999">
            <img src="https://placehold.it/2400x1400" />
        </div>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            jcWheelZoom = JcWheelZoom.create('img', {
                prepare: function (scale, correct_x, correct_y) {
                    // do smth when image prepared
                },
                rescale: function (scale, correct_x, correct_y, min_scale) {
                    // do smth when image rescaled
                }
            });
           
            window.addEventListener('resize', function () {
                jcWheelZoom.prepare();
            });
            
            document.getElementById('zoom_up').addEventListener('click', function () {
                jcWheelZoom.zoomUp();
            });
            
            document.getElementById('zoom_down').addEventListener('click', function () {
                jcWheelZoom.zoomDown();
            });
        });
    </script>
</body>
</html>
```

Default params

``` javascript
var defaults = {
    // drag scrollable image
    dragscrollable: true,
    // maximum allowed proportion of scale
    max_scale: 1,
    // image resizing speed
    speed: 10
};
```
