"use strict";

var dom             = require('dom');
var viewport        = require('viewport');
var tab             = require('tab');
var experiments     = require('experiments/index');
var resize          = require('resize');
var renderer        = require('renderer');

var stop = false;
var experiment;
var canvas;
var scaled = false;
var change_x = 1;
var change_y = 1;

module.exports = function dots(canvas_supported) {

    if (!canvas_supported) {
        return;
    }

    var wrapper = dom.id('intro_wrapper');
    if (!wrapper) {
        return;
    }

    wrapper.style.height = 'auto';

    renderer.setup(0xFFFFFF, wrapper);
    canvas = renderer.canvas();

    experiment = experiments.citylike;
    experiment.init();

    resize.listen(function(scale) {
        change_x = scale.change_x;
        change_y = scale.change_y;
        experiment.scale(change_x, change_y);
    });

    tab.visibility(function(is_visible) {
        experiment[is_visible ? 'play' : 'pause']();
    });

    viewport.visibility(canvas, function(is_visible) {
        experiment[is_visible ? 'play' : 'pause']();
    });

    run();
}

function update() {
    if (experiment.paused()) {
        return run();
    }

    if (stop) {
        return;
    }

    if (!experiment.update()) {
        stop = true;
    }

    run();
}

function run() {
    window.requestAnimationFrame(update);
}
