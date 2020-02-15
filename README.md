# vanilla-js-wheel-zoom

![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/worka/vanilla-js-wheel-zoom)
[![GitHub stars](https://img.shields.io/github/stars/worka/vanilla-js-wheel-zoom)](https://github.com/worka/vanilla-js-wheel-zoom/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/worka/vanilla-js-wheel-zoom)](https://github.com/worka/vanilla-js-wheel-zoom/issues)
[![GitHub forks](https://img.shields.io/github/forks/worka/vanilla-js-wheel-zoom)](https://github.com/worka/vanilla-js-wheel-zoom/network)

Image resizing using mouse wheel + drag scrollable image

Advantages: 
* the ability to fit the image into a container of any proportion
* the ability to place elements (e.g. badge) on the image that can be moved and resized using callback

<a href="https://worka.github.io/wheel-zoom.html">Demo</a>

#### Get started

```html
<div style="width:600px;height:600px;overflow:auto;background:#999;position:relative;cursor:move">
    <img src="https://placehold.it/2400x1400" />
</div>
```

``` javascript
JcWheelZoom.create('img');
```
#### Default params

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

#### Badge on the image

``` html
<html lang="en">
<head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">

    <style>
        .container {
            width: 600px;
            height: 600px;
            overflow: auto;
            background: #999;
            position: relative;
            cursor: move
        }

        .badge {
            border: solid 1px blue;
            position: absolute
        }
    </style>
</head>
<body>
    <div style="margin:20px;width:600px">
        <div style="margin:20px 0">
            <div style="float:right">
                <a data-zoom-up href="javascript:;">Zoom Up</a>
            </div>
    
            <div>
                <a data-zoom-down href="javascript:;">Zoom Down</a>
            </div>
        </div>
    
        <div class="container">
            <div class="badge" style="width:50px;height:60px;top:500px;left:600px"></div>
    
            <img src="https://placehold.it/2400x1400" alt=""/>
        </div>
    </div>
    
    <script src="es5/wheel-zoom.min.js" type="text/javascript"></script>

    <script>
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
    </script>
</body>
</html>
```
