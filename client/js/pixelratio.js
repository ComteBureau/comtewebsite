'use strict';

var ratio = 1;

var PixelRatio = {
    get_ratio: function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        if (ctx === null) {
            ratio = 1;
            return ratio;
        }

        // Pixel ratio is larger than 1 when on a screen with high pixel density
        ratio = ((window.devicePixelRatio || 1) /
                (ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1));

        ctx = null;
        canvas = null;
        return ratio;
    },

    scale_canvas: function(canvas) {
        var width = canvas.width;
        var height = canvas.height;

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
