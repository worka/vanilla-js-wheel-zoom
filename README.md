# vanilla-js-wheel-zoom

Image resizing using mouse wheel (pinch to zoom) + drag scrollable image (as well as any HTML content)

![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/worka/vanilla-js-wheel-zoom)
[![GitHub stars](https://img.shields.io/github/stars/worka/vanilla-js-wheel-zoom)](https://github.com/worka/vanilla-js-wheel-zoom/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/worka/vanilla-js-wheel-zoom)](https://github.com/worka/vanilla-js-wheel-zoom/issues)
[![GitHub forks](https://img.shields.io/github/forks/worka/vanilla-js-wheel-zoom)](https://github.com/worka/vanilla-js-wheel-zoom/network)
[![](https://data.jsdelivr.com/v1/package/npm/vanilla-js-wheel-zoom/badge?style=rounded)](https://www.jsdelivr.com/package/npm/vanilla-js-wheel-zoom)

Advantages: 
* the ability to fit the image into a container of any proportion
* the ability to scale any HTML content
* touch screen devices support

> Starting with version 5, the plugin switched to using `style transform`. To use the plugin in older browsers, switch to earlier versions.

> You need to center the image (or any HTML content) in the "window" in which scaling will take place. The "window" is taken automatically as the parent of the image in DOM.

> HTML content can be of any structure, but the topmost child element in the “window” must be one. In the example with "badge" below, it will be more clear what is meant.

🖐 If you find my plugin helpful, please <a href="https://paypal.me/bworka">donate me</a> 🤝

<a href="https://worka.github.io/vanilla-js-wheel-zoom/demo-image.html">Demo (only one image)</a>

<a href="https://worka.github.io/vanilla-js-wheel-zoom/demo-html.html">Demo (html)</a>

<a href="https://worka.github.io/vanilla-js-wheel-zoom/demo-images.html">Demo (multi images with custom align)</a>

<a href="https://codesandbox.io/s/workavanilla-js-wheel-zoom-4m481">Playground... Have some fun 🤸‍♂️</a>

### Install

```cmd
npm i vanilla-js-wheel-zoom
```

or

```cmd
yarn add vanilla-js-wheel-zoom
```

### Get started

```css
#myWindow {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: #999;
}

#myContent {
    position: relative;
    display: flex;
    align-items: center;
}
```

```html
<div id="myWindow" style="width:600px;height:600px;">
    <img id="myContent" src="https://placehold.it/2400x1400" alt="image" />
</div>
```

``` javascript
WZoom.create('#myContent');
```

Supported "hotswap" src of image (when type = image). You can do `document.getElementById('myContent').src = "_new_path_"` after initializing the plugin.

#### Syntax & Parameters

```javascript
/**
 * Create WZoom instance
 * @param {string|HTMLElement} selectorOrHTMLElement
 * @param {Object} [options]
 * @returns {WZoom}
 */
const wzoom = WZoom.create(selectorOrHTMLElement[, options]);
```

#### Default options

``` javascript
const defaults = {
    // type content: `image` - only one image, `html` - any HTML content
    type: 'image',
    // for type `image` computed auto (if width set null), for type `html` need set real html content width, else computed auto
    width: null,
    // for type `image` computed auto (if height set null), for type `html` need set real html content height, else computed auto
    height: null,
    // drag scrollable image
    dragScrollable: true,
    // options for the DragScrollable module
    dragScrollableOptions: {
        // smooth extinction (value in seconds)
        smoothExtinction: .25,
        // callback triggered when grabbing an element
        onGrab: null,
        // callback triggered when moving an element
        onMove: null,
        // callback triggered when dropping an element
        onDrop: null
    },
    // minimum allowed proportion of scale (computed auto if null)
    minScale: null,
    // maximum allowed proportion of scale (1 = 100% content size)
    maxScale: 1,
    // image resizing speed
    speed: 10,
    // zoom to maximum (minimum) size on click
    zoomOnClick: true,
    // if is true, then when the source image changes, the plugin will automatically restart init function (used with type = image)
    // attention: if false, it will work correctly only if the images are of the same size
    watchImageChange: true,
    // smooth extinction (value in seconds)
    smoothExtinction: .3,
    // align content `center`, `left`, `top`, `right`, `bottom` 
    alignContent: 'center',
    /********************/
    disableWheelZoom: false
};
```

#### Badge on the image

```css
#myWindow {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: aqua;
}

#myContent {
    position: relative;
    display: flex;
    align-items: center;
}

#myBadge {
    position: absolute;
    border: solid 2px red;
    font-size: 80px;
}

#myImage {
    display: block;
    width: auto;
    height: auto;
    margin: auto;
    align-self: center;
    flex-shrink: 0;
}
```

``` html
<div id="myWindow" style="width:600px;height:600px;">
    <div id="myContent">
        <div id="myBadge" style="left:900px;top:500px;">Badge</div>
        <img id="myImage" src="https://placehold.it/2500x1500" alt="image"/>
    </div>
</div>
```
    
``` javascript
WZoom.create('#myContent', {
    type: 'html',
    width: 2500,
    height: 1500
});
```

#### Control buttons

```html
<button data-zoom-up>Zoom Up</button>
<button data-zoom-down>Zoom Down</button>
```

``` javascript
const wzoom = WZoom.create('img');

document.querySelector('[data-zoom-up]').addEventListener('click', () => {
    wzoom.zoomUp();
});

document.querySelector('[data-zoom-down]').addEventListener('click', () => {
    wzoom.zoomDown();
});
```

#### On window resize

``` javascript
const wzoom = WZoom.create('img');

window.addEventListener('resize', () => {
    wzoom.prepare();
});
```

#### How to rotate the image?

[Try this 😉](https://github.com/worka/vanilla-js-wheel-zoom/issues/21) (and see <a href="https://worka.github.io/vanilla-js-wheel-zoom/demo-image-rotate.html">demo</a>)

### Options

| name                                     | type       | default     | note                                                                                                                                                                                                                                                                                                  |
|------------------------------------------|------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type                                     | _String_   | `image`     | `image` - if you need to scale only one image. In this case, there is no need to pass the parameters `width` and `height`. `html` - if you need to scale the HTML code. It is advisable to specify the parameters `width` and `height` that correspond to the original full size of the HTML content. |
| width                                    | _Number_   | `null`      | For type `image` computed auto (if width set null), for type `html` need set real html content width, else computed auto.                                                                                                                                                                             |
| height                                   | _Number_   | `null`      | For type `image` computed auto (if height set null), for type `html` need set real html content height, else computed auto.                                                                                                                                                                           |
| dragScrollable                           | _Boolean_  | `true`      | If `true` -  scaled image can be dragged with the mouse to see parts of the image that are out of scale.                                                                                                                                                                                              |
| dragScrollableOptions._smoothExtinction_ | _Number_   | `.25`       | Time of smooth extinction. if `0` then no smooth extinction. (value in seconds)                                                                                                                                                                                                                       |
| dragScrollableOptions._onGrab_           | _Function_ | `undefined` | Called after grabbing an element.                                                                                                                                                                                                                                                                     |
| dragScrollableOptions._onMove_           | _Function_ | `undefined` | Called on every tick when moving element.                                                                                                                                                                                                                                                             |
| dragScrollableOptions._onDrop_           | _Function_ | `undefined` | Called after dropping an element.                                                                                                                                                                                                                                                                     |
| minScale                                 | _Number_   | `null`      | The minimum scale to which the image can be zoomed.<br>If `falsy` or greater than `maxScale` then computed auto.                                                                                                                                                                                      |
| maxScale                                 | _Number_   | `1`         | The maximum scale to which the image can be zoomed.<br>`1` means that the image can be maximized to 100%, `2` - 200%, etc.                                                                                                                                                                            |
| speed                                    | _Number_   | `10`        | Step with which the image will be scaled. Measured in relative units.<br>The larger the value, the smaller the step and vice versa.                                                                                                                                                                   |
| zoomOnClick                              | _Boolean_  | `true`      | Zoom to maximum (minimum) size on click.                                                                                                                                                                                                                                                              |
| watchImageChange                         | _Boolean_  | `true`      | If is `true`, then when the source image changes, the plugin will automatically restart init function (used with `type = image`). Attention: if `false`, it will work correctly only if the images are of the same size.                                                                              |
| prepare                                  | _Function_ | `undefined` | Called after the script is initialized when the image is scaled and fit into the container.                                                                                                                                                                                                           |
| rescale                                  | _Function_ | `undefined` | Called on every change of scale.                                                                                                                                                                                                                                                                      |
| alignContent                             | _String_   | `center`    | Align content `center`, `left`, `top`, `right`, `bottom`                                                                                                                                                                                                                                              |
| smoothExtinction                         | _Number_   | `.3`        | Time of smooth extinction. if `0` then no smooth extinction. (value in seconds)                                                                                                                                                                                                                       |
| disableWheelZoom                         | _Boolean_  | `false`     |                                                                                                                                                                                                                                                                                                       |

### API

| name           | note                                      |
|----------------|-------------------------------------------|
| .prepare()     | Reinitialize script                       |
| .zoomUp()      | Zoom on one step (see option `speed`)     |
| .maxZoomUp()   | Zoom to max scale                         |
| .zoomDown()    | Zoom out on one step (see option `speed`) |
| .maxZoomDown() | Zoom to min scale                         |
| .destroy()     | Destroy object                            |

### LICENSE

vanilla-js-wheel-zoom is licensed under the <a href="http://choosealicense.com/licenses/gpl-3.0">GPLv3</a> license for all open source applications. A commercial license is required for all commercial applications (including sites, themes and apps you plan to sell).
