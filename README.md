# vanilla-js-wheel-zoom

![GitHub package.json version](https://img.shields.io/github/package-json/v/worka/vanilla-js-wheel-zoom)
[![GitHub stars](https://img.shields.io/github/stars/worka/vanilla-js-wheel-zoom)](https://github.com/worka/vanilla-js-wheel-zoom/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/worka/vanilla-js-wheel-zoom)](https://github.com/worka/vanilla-js-wheel-zoom/issues)
[![GitHub forks](https://img.shields.io/github/forks/worka/vanilla-js-wheel-zoom)](https://github.com/worka/vanilla-js-wheel-zoom/network)

Image resizing using mouse wheel + drag scrollable image

Advantages: 
* the ability to fit the image into a container of any proportion
* the ability to place elements (e.g. badge) on the image that can be moved and resized using callback

<a href="https://worka.github.io/wheel-zoom.html">Demo</a>

``` html
<html>
<head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">

    <script src="/wheel-zoom.js"></script>
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

        <div style="width:600px;height:600px;overflow:auto;background:#999;position:relative;cursor:move">
            <div class="badge" style="width:50px;height:60px;top:500px;left:600px;border:solid 1px blue;position:absolute"></div>
            
            <img src="https://placehold.it/2400x1400" />
        </div>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            var badge = document.querySelector('.badge');
            
            jcWheelZoom = JcWheelZoom.create('img', {
                prepare: function (scale, correct_x, correct_y) {
                    // do smth when image prepared
                    
                    if (!Object.keys(badge.dataset).length) {
                        badge.dataset.width = parseInt(badge.style.width);
                        badge.dataset.height = parseInt(badge.style.height);
                        badge.dataset.left = parseInt(badge.style.left);
                        badge.dataset.top = parseInt(badge.style.top);
                    }
                    
                    badge.style.width = (badge.dataset.width * scale) + 'px';
                    badge.style.height = (badge.dataset.height * scale) + 'px';
                    badge.style.left = (badge.dataset.left * scale + correct_x) + 'px';
                    badge.style.top = (badge.dataset.top * scale + correct_y) + 'px';
                },
                rescale: function (scale, correct_x, correct_y, min_scale) {
                    // do smth when image rescaled
                    
                    badge.style.width = (badge.dataset.width * scale) + 'px';
                    badge.style.height = (badge.dataset.height * scale) + 'px';
                    badge.style.left = (badge.dataset.left * scale + correct_x) + 'px';
                    badge.style.top = (badge.dataset.top * scale + correct_y) + 'px';
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
    dragScrollable: true,
    // maximum allowed proportion of scale
    maxScale: 1,
    // image resizing speed
    speed: 10
};
```
