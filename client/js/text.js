'use strict';

var main_canvas;
var tmp_canvas;
var main_ctx;
var tmp_ctx;
var pixels;
var blacks = [];

var threshold = 1;

module.exports.create = function(options) {
    main_canvas = document.createElement('canvas');
    main_ctx = main_canvas.getContext('2d');

    tmp_canvas = document.createElement('canvas');
    tmp_ctx = tmp_canvas.getContext('2d');

    tmp_canvas.width = document.documentElement.clientWidth;
    tmp_canvas.height = Math.round(options.font_size * 1.2);

    tmp_ctx.fillStyle = '#fff';
    tmp_ctx.fillRect(0, 0, tmp_canvas.width, tmp_canvas.height);

    tmp_ctx.font = options.font_size + 'px ' + options.font;

    tmp_ctx.textAlign = 'center';
    tmp_ctx.textBaseline = 'middle';
    tmp_ctx.fillStyle = '#000';
    tmp_ctx.fillText(options.text, tmp_canvas.width / 2, tmp_canvas.height / 2);

    var crop = get_crop(tmp_canvas, tmp_ctx, threshold);

    scale(main_canvas, main_ctx, {
        original: {
            width:  crop.right - crop.left,
            height: tmp_canvas.height,
            canvas: tmp_canvas,
            crop: {
                left:   crop.left - 10 < 0 ? 0 : crop.left - 10,
                width:  (crop.right - crop.left) + 20
            }
        },
        limit: {
            width:  options.width,
            height: options.height
        }
    });

    pixels = main_ctx.getImageData(0, 0, main_canvas.width, main_canvas.height);

    for (var i = 0; i < pixels.data.length; i += 4) {
        if (pixels.data[i] < threshold &&
            pixels.data[i+1] < threshold &&
            pixels.data[i+2] < threshold) {

            blacks.push({
                x: (i / 4) % main_canvas.width,
                y: Math.floor((i / 4) / main_canvas.width)
            });
        }
    }

    return {
        coords: blacks,
        center: {
            x: main_canvas.width / 2,
            y: main_canvas.height / 2
        },
        size: {
            width:  main_canvas.width,
            height: main_canvas.height
        }
    };
}

module.exports.exit = function() {

}

function get_crop(canvas, ctx, threshold) {
    var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var crop = {
        left:   canvas.width,
        right:  0
    };
    var x = 0;

    for (var i = 0; i < pixels.data.length; i += 4) {
        if (pixels.data[i] < threshold &&
            pixels.data[i+1] < threshold &&
            pixels.data[i+2] < threshold) {

            x = (i / 4) % canvas.width;

            crop.left = x < crop.left ? x : crop.left;
            crop.right = x > crop.right ? x : crop.right;
        }
    }

    return crop;
}

function scale(canvas, ctx, options) {
    var ar = options.original.height / options.original.width;
    var dim = {
        width:  0,
        height: 0
    };

    // Scale by width or height?
    if (ar * options.original.width > options.limit.height) {
        // use height as base
        ar = options.original.width / options.original.height;
        dim.width = ar * options.limit.height;
        dim.height = options.limit.height;
    } else {
        // use width as base
        dim.height = ar * options.limit.width;
        dim.width = options.limit.width;
    }

    if (dim.width < options.original.width) {
        dim.height = options.original.width * ar;
        dim.width = options.original.width;
    }

    // Resize canvas to draw to
    canvas.width = dim.width;
    canvas.height = dim.height;

    // Draw scaled text
    ctx.drawImage(options.original.canvas,
                  options.original.crop.left, 0,
                  options.original.crop.width, options.original.height,
                  0, 0,
                  canvas.width, canvas.height);
}
