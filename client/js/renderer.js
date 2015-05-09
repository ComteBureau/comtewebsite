'use strict';

var PIXI            = require('pixi.js');
var pixelratio      = require('pixelratio');

var r = {};
var sixteen_nine = 0.5625;
var sixteen_seven = 0.4375;

// TODO: Should be cleaned up and the API should be simplified
module.exports = function(color, container) {
    r.width = document.documentElement.clientWidth;
    r.height = r.width * sixteen_seven;

    r.stage = new PIXI.Stage(color);
    r.renderer = PIXI.autoDetectRenderer(r.width, r.height);

    r.ratio = pixelratio.get_ratio(r.renderer.view);
    r.renderer.resize(r.width * r.ratio, r.height * r.ratio);

    container.appendChild(r.renderer.view);

    r.renderer.view.style.width = r.width + 'px';
    r.renderer.view.style.height = r.height + 'px';

    return r;
}
