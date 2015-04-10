'use strict';

var width;
var height;
var ctx;
var ratio;

var PixelRatio = function(canvas) {

    ctx = canvas.getContext('2d');

    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                            ctx.mozBackingStorePixelRatio ||
                            ctx.msBackingStorePixelRatio ||
                            ctx.oBackingStorePixelRatio ||
                            ctx.backingStorePixelRatio || 1;

    // Pixel ratio is larger than 1 when on a screen with high pixel density
    ratio = devicePixelRatio / backingStoreRatio;

    if (devicePixelRatio !== backingStoreRatio) {

        width = canvas.width;
        height = canvas.height;

        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        // now scale the context to counter
        // the fact that we've manually scaled
        // our canvas element
        ctx.scale(ratio, ratio);
    }
}

module.exports = PixelRatio;

Object.defineProperty(PixelRatio, 'ratio', {
    get: function() {
        return ratio;
    }
});
