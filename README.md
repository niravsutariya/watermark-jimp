# watermark-jimp
A powerful watermark library based on Jimp for node.js. This can be used to overlay a "image" watermark in another image or text with text color and text opacity and position.

### Installation

	'npm install watermark-jimp'

### Server-side usage

```javascript
var watermark = require('watermark-jimp');

watermark.addWatermark('/path/to/image/source/file','/path/to/image/watermark/logo', options);

watermark.addTextWatermark('/path/to/image/source/file', options);
```

### API

#### addWatermark(imageSource, watermarkSource, options)

API to overlay watermark in given image. It takes three arguments : 
1. path of the image source file
2. path of the watermark source file
2. options object. This argument is optional


**Options**

Various options supported by this API are :
- **ratio** - To specify watermark text. Default is 'Sample watermark'.
- **opacity** - To specify value between 0.1 to 1 of watermark image. Default is '1'.
- **dstPath** - To specify the output path. Default is 'watermark-jimp.jpg'.
- **position** - To specify the position of watermark. Default is 'center'
    **Supported position value to be:** 'top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'

**Example**

```javascript
var watermark = require('watermark-jimp');

watermark.addWatermark('./img/source.jpg', './img/watermark-logo.png').then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
});
```

**Different Options**

```javascript

//
// Options to specify output path
//
var watermark = require('watermark-jimp');
var options = {
    'ratio': 0.6,// Should be less than one
    'opacity': 0.6, //Should be less than one
    'dstPath' : './watermark.jpg', //Path of destination image file
    'position' : 'center' //Should be 'top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'
};
watermark.addWatermark('./img/source.jpg', './img/watermark-logo.png', options);

```

#### addTextWatermark(imageSource, options)

API to overlay watermark in given image. It takes two arguments : 
1. path of the image
2. options object. This argument is optional


**Options**

Various options supported by this API are :
- **text** - To specify the text to be overlaid on the source image.
- **color** - To specify color of watermark text. Default is '#ffffff'.
- **opacity** - To specify value between 0.1 to 1 of watermark text. Default is '1'.
- **textSize** - To specify size of text over the main image, value ranged from 1 to 8.
- **dstPath** - To specify the output path. Default is 'watermark-jimp.jpg'.
- **position** - To specify the position of watermark. Default is 'center'.
    **Supported position value to be:** 'top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'

**Example**

```javascript
var watermark = require('watermark-jimp');

watermark.addTextWatermark('./img/source.jpg').then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
});
```

**Different Options**

```javascript

//
// Options to specify output path
//
var watermark = require('watermark-jimp');
var options = {
    'text': 'watermark-test',
    'textSize': 6, //Should be between 1-8
    'opacity': 0.5, //Should be between 0.1 to 1
    'color': "#ffffff", //Should be hax code
    'dstPath' : './watermark-jimp.jpg', //Path of destination image file
    'position' : 'center' //Should be 'top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'
};
watermark.addTextWatermark('./img/source.jpg', options);
```

### Inspiration
[https://github.com/niravsutariya/watermark-jimp](https://github.com/niravsutariya/watermark-jimp)

### License(MIT)

MIT License

Copyright (c) 2023 Nirav Sutariya

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
