const Jimp = require('jimp');

const defaultOptions = {
    ratio: 0.5,
    color: '#ffffff',
    opacity: 1,
    dstPath: './watermark-jimp.jpg',
    text: 'watermark-jimp',
    textSize: 1,
    position: 'center',
}


const SizeEnum = Object.freeze({
    1: Jimp.FONT_SANS_8_BLACK,
    2: Jimp.FONT_SANS_10_BLACK,
    3: Jimp.FONT_SANS_12_BLACK,
    4: Jimp.FONT_SANS_14_BLACK,
    5: Jimp.FONT_SANS_16_BLACK,
    6: Jimp.FONT_SANS_32_BLACK,
    7: Jimp.FONT_SANS_64_BLACK,
    8: Jimp.FONT_SANS_128_BLACK,
});

const PositionEnum = Object.freeze({
    1: 'top-left',
    2: 'top-center',
    3: 'top-right',
    4: 'center-left',
    5: 'center',
    6: 'center-right',
    7: 'bottom-left',
    8: 'bottom-center',
    9: 'bottom-right',
});

const ErrorTextSize = new Error("Text size must range from 1 - 8");
const ErrorScaleRatio = new Error("Scale Ratio must be less than one.");
const ErrorOpacity = new Error("Opacity must be less than one.");

const getDimensions = (H, W, h, w, ratio) => {
    let hh, ww;
    if ((H / W) < (h / w)) {
        hh = ratio * H;
        ww = hh / h * w;
    } else {
        ww = ratio * W;
        hh = ww / w * h;
    }
    return [hh, ww];
}

const checkOptions = (options) => {
    options = { ...defaultOptions, ...options };
    if (options.ratio > 1) {
        throw ErrorScaleRatio;
    }
    if (options.opacity > 1) {
        throw ErrorOpacity;
    }
    return options;
}

const getPosition = (position) => {
    switch (position) {
        case PositionEnum[1]:
            return {
                x: Jimp.HORIZONTAL_ALIGN_LEFT,
                y: Jimp.VERTICAL_ALIGN_TOP,
            };
            break;
        case PositionEnum[2]:
            return {
                x: Jimp.HORIZONTAL_ALIGN_CENTER,
                y: Jimp.VERTICAL_ALIGN_TOP,
            };
        case PositionEnum[3]:
            return {
                x: Jimp.HORIZONTAL_ALIGN_RIGHT,
                y: Jimp.VERTICAL_ALIGN_TOP,
            };
        case PositionEnum[4]:
            return {
                x: Jimp.HORIZONTAL_ALIGN_LEFT,
                y: Jimp.VERTICAL_ALIGN_MIDDLE,
            };
        case PositionEnum[5]:
            return {
                x: Jimp.HORIZONTAL_ALIGN_CENTER,
                y: Jimp.VERTICAL_ALIGN_MIDDLE,
            };
        case PositionEnum[6]:
            return {
                x: Jimp.HORIZONTAL_ALIGN_RIGHT,
                y: Jimp.VERTICAL_ALIGN_MIDDLE,
            };
        case PositionEnum[7]:
            return {
                x: Jimp.HORIZONTAL_ALIGN_LEFT,
                y: Jimp.VERTICAL_ALIGN_BOTTOM,
            };
        case PositionEnum[8]:
            return {
                x: Jimp.HORIZONTAL_ALIGN_CENTER,
                y: Jimp.VERTICAL_ALIGN_BOTTOM,
            };
        case PositionEnum[9]:
            return {
                x: Jimp.HORIZONTAL_ALIGN_RIGHT,
                y: Jimp.VERTICAL_ALIGN_BOTTOM,
            };
        default:
            return {
                x: Jimp.HORIZONTAL_ALIGN_CENTER,
                y: Jimp.VERTICAL_ALIGN_MIDDLE,
            };
    }
}

/**
 * @param {String} mainImage        - Source path of the image to be watermarked
 * @param {Object} options
 * @param {String} options.text     - String to be watermarked 
 * @param {String} options.color    - Hax color code as string for text 
 * @param {String} options.opacity  - Text opacity between 0.1 to 1 
 * @param {Number} options.textSize - Text size ranging from 1 to 8
 * @param {String} options.dstPath  - Destination path where image is to be saved
 * @param {String} options.position - Position of the watermark text
 */
module.exports.addTextWatermark = async (mainImage, options) => {
    try {
        const main = await Jimp.read(mainImage);       
        const maxHeight = main.getHeight();
        const maxWidth = main.getWidth();
		let textImage = await new Jimp(maxHeight,maxWidth, 0x0);
        if (Object.keys(SizeEnum).includes(String(options.textSize))) {
            const font = await Jimp.loadFont(SizeEnum[options.textSize]);            
            const X = 0, Y = 0;
            const position = getPosition(options.position)
            await textImage.print(font, X, Y, {
                text: options.text,
                alignmentX: position.x,
                alignmentY: position.y
            }, maxWidth, maxHeight);
            await textImage.opacity(options.opacity).color([{ apply: 'xor', params: [options.color] }]); 
            await main.blit(textImage, 0, 0)
            await main.writeAsync(options.dstPath);
            return {
                destinationPath: options.dstPath,
                imageHeight: main.getHeight(),
                imageWidth: main.getWidth(),
            };
        } else {
            throw ErrorTextSize;
        }
    } catch (err) {
        throw err;
    }
}

/**
 * @param {String} mainImage        - Source path of the image to be watermarked
 * @param {String} watermarkImage   - Watermark image which is placed in source image
 * @param {Object} options
 * @param {Float} options.ratio     - Ratio in which the watermark is overlaid
 * @param {Float} options.opacity   - Image opacity watermark during overlay
 * @param {String} options.dstPath  - Destination path where image is to be saved
 * @param {String} options.position - Position of the watermark image
 */
module.exports.addWatermark = async (mainImage, watermarkImage, options) => {
    try {
        options = checkOptions(options);
        const main = await Jimp.read(mainImage);
        const watermark = await Jimp.read(watermarkImage);
        const [newHeight, newWidth] = getDimensions(main.getHeight(), main.getWidth(), watermark.getHeight(), watermark.getWidth(), options.ratio);
        const position = getPosition(options.position);
        const positionX = (position.x === Jimp.HORIZONTAL_ALIGN_LEFT) ? 0 : ((position.x === Jimp.HORIZONTAL_ALIGN_CENTER) ? ((main.getWidth() - newWidth) / 2) : (main.getWidth() - newWidth));
        const positionY = (position.y === Jimp.VERTICAL_ALIGN_TOP) ? 0 : ((position.y === Jimp.VERTICAL_ALIGN_MIDDLE) ? ((main.getHeight() - newHeight) / 2) : (main.getHeight() - newHeight));
        await watermark.resize(newWidth, newHeight);
        await watermark.opacity(options.opacity);
        await main.composite(watermark,
            positionX,
            positionY,
            Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
        await main.quality(100).writeAsync(options.dstPath);
        return {
            destinationPath: options.dstPath,
            imageHeight: main.getHeight(),
            imageWidth: main.getWidth(),
        };
    } catch (err) {
        throw err;
    }
}
