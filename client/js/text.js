'use strict';

var canvas;
var tmp_canvas;
var ctx;
var tmp_ctx;
var pixels;
var blacks = [];

var threshold = 8;

module.exports.create = function(options) {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');

    tmp_canvas = document.createElement('canvas');
    tmp_ctx = tmp_canvas.getContext('2d');

    tmp_canvas.width = options.width;
    tmp_canvas.height = Math.round(options.font_size * 1.2);
    canvas.height = tmp_canvas.height;

    tmp_ctx.fillStyle = '#fff';
    tmp_ctx.fillRect(0, 0, tmp_canvas.width, tmp_canvas.height);

    tmp_ctx.font = options.font_size + 'px ' + options.font;

    tmp_ctx.textAlign = 'center';
    tmp_ctx.textBaseline = 'middle';
    tmp_ctx.fillStyle = '#000';
    tmp_ctx.fillText(options.text, tmp_canvas.width / 2, tmp_canvas.height / 2);

    pixels = tmp_ctx.getImageData(0, 0, tmp_canvas.width, tmp_canvas.height);

    var crop_left = tmp_canvas.width;
    var crop_right = 0;

    var x = 0;

    for (var i = 0; i < pixels.data.length; i += 4) {
        if (pixels.data[i] < threshold &&
            pixels.data[i+1] < threshold &&
            pixels.data[i+2] < threshold) {

            x = (i / 4) - (Math.floor((i / 4) / tmp_canvas.width) * tmp_canvas.width);

            blacks.push({
                x: x,
                y: Math.floor((i / 4) / tmp_canvas.width)
            });

            crop_left = x < crop_left ? x : crop_left;
            crop_right = x > crop_right ? x : crop_right;
        }
    }

    crop_left = crop_left - 10 < 0 ? 0 : crop_left - 10;
    crop_right += 10;

    canvas.width = crop_right - crop_left;

    ctx.drawImage(tmp_canvas,
                  crop_left, 0,
                  crop_right - crop_left, tmp_canvas.height,
                  0, 0,
                  crop_right - crop_left, tmp_canvas.height);

    if (options.debug) {
        document.getElementById('intro_wrapper').appendChild(canvas);
    }

    return blacks;
}

module.exports.exit = function() {

}
