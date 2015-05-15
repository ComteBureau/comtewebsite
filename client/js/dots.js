"use strict";

var raf             = require('raf');
var dom             = require('dom');
var viewport        = require('viewport');
var tab             = require('tab');
var experiments     = require('experiments/index');
var resize          = require('resize');
var renderer        = require('renderer');

var stop = false;
var experiment;
var canvas;

module.exports = function dots(canvas_supported) {

    if (!canvas_supported) {
        return;
    }

    raf();

    var wrapper = dom.id('intro_wrapper');
    if (!wrapper) {
        return;
    }

    wrapper.style.height = 'auto';

    renderer.setup(0xFFFFFF, wrapper);
    canvas = renderer.canvas();

    experiment = experiments.citylike;
    experiment.init();

    tab.visibility(function(is_visible) {
        experiment[is_visible ? 'play' : 'pause']();
        document.title = is_visible ? 'Active' : 'Paused';
    });

    viewport.visibility(canvas, function(is_visible) {
        experiment[is_visible ? 'play' : 'pause']();
    });

    resize.init();
    run();
}

function update() {
    if (experiment.paused()) {
        return run();
    }

    if (stop) {
        return;
    }

    if (!resize.is_resizing) {
        if (resize.has_resized) {
            experiment.scale(resize.scale.change);
            resize.has_resized = false;
        } else {
            if (!experiment.update()) {
                stop = true;
            }
        }
    }

    run();
}

function run() {
    window.requestAnimationFrame(update);
}
