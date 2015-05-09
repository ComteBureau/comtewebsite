'use strict';

var width;
var height;
var ctx;
var ratio = 1;

var PixelRatio = {
    get_ratio: function(canvas) {

        ctx = canvas.getContext('2d');
        if (ctx === null) {
            ratio = 1;
            return ratio;
        }

        var devicePixelRatio = window.devicePixelRatio || 1;
        var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                                ctx.mozBackingStorePixelRatio ||
                                ctx.msBackingStorePixelRatio ||
                                ctx.oBackingStorePixelRatio ||
                                ctx.backingStorePixelRatio || 1;

        // Pixel ratio is larger than 1 when on a screen with high pixel density
        ratio = devicePixelRatio / backingStoreRatio;
        return ratio;
    },

    scale_canvas: function(canvas) {
        width = canvas.width;
        height = canvas.height;

        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    },

    ratio: function() {
        return ratio;
    }
};

module.exports = PixelRatio;

// Object.defineProperty(PixelRatio, 'ratio', {
//     get: function() {
//         return ratio;
//     }
// });
