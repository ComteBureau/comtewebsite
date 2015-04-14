'use strict';

var PIXI            = require('pixi.js');
var pixelratio      = require('pixelratio');

var r = {};

module.exports = function(color, container) {
    r.width = document.documentElement.clientWidth;
    r.height = r.width * 0.5625;

    r.stage = new PIXI.Stage(color);
    r.renderer = PIXI.autoDetectRenderer(r.width, r.height);

    r.ratio = pixelratio.get_ratio(r.renderer.view);
    r.renderer.resize(r.width * r.ratio, r.height * r.ratio);

    container.appendChild(r.renderer.view);

    r.renderer.view.style.width = r.width + 'px';
    r.renderer.view.style.height = r.height + 'px';

    return r;
}
