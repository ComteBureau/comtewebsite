'use strict';

module.exports.create = function(options) {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    if (options.debug) {
        document.body.appendChild(canvas);
    }

    canvas.width = options.width;
    canvas.height = options.height;

    // TODO: Take width into account, too.
    // Make sure there's some padding on the sides
    var font_size = Math.round(canvas.height * 0.3);
    font_size = Math.max(font_size, options.min_font_size);
    font_size = Math.min(font_size, options.max_font_size);

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = font_size + 'px ' + options.font;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText(options.text, canvas.width / 2, canvas.height / 2);

    var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var blacks = [];
    var threshold = 8;

    for (var i = 0; i < pixels.data.length; i += 4) {
        if (pixels.data[i] < threshold &&
            pixels.data[i+1] < threshold &&
            pixels.data[i+2] < threshold) {

            blacks.push({
                x: (i / 4) - (Math.floor((i / 4) / canvas.width) * canvas.width),
                y: Math.floor((i / 4) / canvas.width)
            });
        }
    }

    return blacks;
}
