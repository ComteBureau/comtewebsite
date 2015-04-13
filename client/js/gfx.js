'use strict';

var pixelratio      = require('pixelratio');
var PIXI            = require('pixi.js');

// TODO: Add scaling with pixelratio?
module.exports.circle = function(options) {
    options = options || {};
    options.color = options.color || 0x000000;
    options.alpha = options.alpha || 1;
    options.radius = options.radius || 5;

    var circle_gfx = new PIXI.Graphics();
    circle_gfx.beginFill(options.color, options.alpha);
    circle_gfx.drawCircle(options.radius, options.radius, options.radius);
    circle_gfx.endFill();

    return circle_gfx;
}
