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

> You need to center the image (or any HTML content) in the "viewport" in which scaling will take place. The "viewport" is taken automatically as the parent of the image in DOM.

> HTML content can be of any structure, but the topmost child element in the “viewport” must be one. In the example with "badge" below, it will be more clear what is meant.

🖐 If you find my plugin helpful, please <a href="https://paypal.me/bworka">donate me</a> 🤝

<a href="https://worka.github.io/vanilla-js-wheel-zoom/examples/image.html">Demo (only one image)</a>

<a href="https://worka.github.io/vanilla-js-wheel-zoom/examples/images.html">Demo (multi images)</a>

<a href="https://worka.github.io/vanilla-js-wheel-zoom/examples/html.html">Demo (html)</a>

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
#myViewport {
    display: flex;
    align-items: center;
    justify-content: center;
}
```

```html
<div id="myViewport" style="width:600px;height:600px;">
    <img id="myContent" src="https://via.placeholder.com/2400x1400" alt="image" />
</div>
```

``` javascript
WZoom.create('#myContent');
```

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

#### Badge on the image

```css
#myViewport {
    display: flex;
    align-items: center;
    justify-content: center;
}

#myBadge {
    position: absolute;
    border: solid 2px red;
    font-size: 80px;
}

#myImage {
    width: auto;
    height: auto;
    margin: auto;
}
```

``` html
<div id="myViewport" style="width:600px;height:600px;">
    <div id="myContent">
        <div id="myBadge" style="left:900px;top:500px;">Badge</div>
        <img id="myImage" src="https://via.placeholder.com/2500x1500" alt="image"/>
    </div>
</div>
```

``` javascript
WZoom.create('#myContent', {
    type: 'html',
    width: 2500,
    height: 1500,
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

Just set the CSS rotate property (and see <a href="https://worka.github.io/vanilla-js-wheel-zoom/examples/image-rotate.html">demo</a>)

#### Callbacks onMaxScaleReached() / onMinScaleReached()

There are no such, but [you can get](https://github.com/worka/vanilla-js-wheel-zoom/issues/34) the desired behavior (and see <a href="https://worka.github.io/vanilla-js-wheel-zoom/examples/scale-reached.html">demo</a>)

#### Saving image state on page reload

See <a href="https://worka.github.io/vanilla-js-wheel-zoom/examples/images.html">demo</a>

#### Playground...

<a href="https://codesandbox.io/s/worka-vanilla-js-wheel-zoom-forked-sbndwy">Have some fun 🤸‍♂️</a>

### Options

| name                  | type        | default     | note                                                                                                                                                                                                                                                                                                  |
|-----------------------|-------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type                  | _String_    | `image`     | `image` - if you need to scale only one image. In this case, there is no need to pass the parameters `width` and `height`. `html` - if you need to scale the HTML code. It is advisable to specify the parameters `width` and `height` that correspond to the original full size of the HTML content. |
| width                 | _Number_    | `null`      | For type `image` computed auto (if width set null), for type `html` need set real html content width, else computed auto.                                                                                                                                                                             |
| height                | _Number_    | `null`      | For type `image` computed auto (if height set null), for type `html` need set real html content height, else computed auto.                                                                                                                                                                           |
| minScale              | _Number_    | `null`      | The minimum scale to which the image can be zoomed.<br>If `falsy` or greater than `maxScale` then computed auto.                                                                                                                                                                                      |
| maxScale              | _Number_    | `1`         | The maximum scale to which the image can be zoomed.<br>`1` means that the image can be maximized to 100%, `2` - 200%, etc.                                                                                                                                                                            |
| speed                 | _Number_    | `1.1`       | Factor with which the image will be scaled.<br>The larger the value, the larger the step.<br>Can tend to `1`, but should not be equal to it (ex. `1.05`, `1.005`) or can be greater (ex. `1.5`, `2`, `5`, `10`)                                                                                       |
| zoomOnClick           | _Boolean_   | `true`      | Zoom to maximum (minimum) size on click.                                                                                                                                                                                                                                                              |
| zoomOnDblClick        | _Boolean_   | `false`     | Zoom to maximum (minimum) size on double click. If `true` then `zoomOnClick` = `false`                                                                                                                                                                                                                |
| prepare               | _Function_  | `undefined` | Called after the script is initialized when the image is scaled and fit into the container. Gets `WZoom` instance as the first argument.                                                                                                                                                              |
| rescale               | _Function_  | `undefined` | Called on every change of scale. Gets `WZoom` instance as the first argument.                                                                                                                                                                                                                         |
| alignContent          | _String_    | `center`    | Align content `center`, `left`, `top`, `right`, `bottom`                                                                                                                                                                                                                                              |
| smoothTime            | _Number_    | `.25`       | Time of smooth extinction. if `0` then no smooth extinction. Disabled for touch devices. (value in seconds)                                                                                                                                                                                           |
| disableWheelZoom      | _Boolean_   | `false`     |                                                                                                                                                                                                                                                                                                       |
| reverseWheelDirection | _Boolean_   | `false`     | Reverse wheel zoom direction                                                                                                                                                                                                                                                                          |
|                       |             |             |                                                                                                                                                                                                                                                                                                       |
| dragScrollable        | _Boolean_   | `true`      | If `true` -  scaled image can be dragged with the mouse to see parts of the image that are out of scale.                                                                                                                                                                                              |
| smoothTimeDrag        | _Number_    | smoothTime  | Optional override to `smoothTime` for mouse drag/pan actions.<br>Setting low (or 0) allows fluid drag actions, while maintaining zoom-smoothness from higher `smoothTime`.<br>If not provided, matches whatever `smoothTime` resolves to: `smoothTime`'s provided value or its default.               |
| onGrab                | _Function_  | `undefined` | Called after grabbing an element. Gets the `event` and `WZoom` instance as the arguments.                                                                                                                                                                                                             |
| onMove                | _Function_  | `undefined` | Called on every tick when moving element. Gets the `event` and `WZoom` instance as the arguments.                                                                                                                                                                                                     |
| onDrop                | _Function_  | `undefined` | Called after dropping an element. Gets the `event` and `WZoom` instance as the arguments.                                                                                                                                                                                                             |


### API

| name                         | note                                               |
|------------------------------|----------------------------------------------------|
| .prepare()                   | Reinitialize script                                |
| .transform(top, left, scale) | Rebuild content state with passed params           |
| .zoomUp()                    | Zoom on one step (see option `speed`)              |
| .maxZoomUp()                 | Zoom to max scale                                  |
| .zoomDown()                  | Zoom out on one step (see option `speed`)          |
| .maxZoomDown()               | Zoom to min scale                                  |
| .zoomUpToPoint({x, y})       | Zoom on one step to point (see option `speed`)     |
| .zoomDownToPoint({x, y})     | Zoom out on one step to point (see option `speed`) |
| .maxZoomUpToPoint({x, y})    | Zoom to max scale to point                         |
| .destroy()                   | Destroy object                                     |

### License

[MIT](https://choosealicense.com/licenses/mit/)
