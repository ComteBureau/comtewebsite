"use strict";

var raf             = require('raf');
var dom             = require('dom');
var viewport        = require('viewport');
var tab             = require('tab');
var experiments     = require('experiments/index');
var resize          = require('resize');
var renderer_setup  = require('renderer');

var stop = false;
var experiment;
var canvas;
var renderer;

module.exports = function dots(canvas_supported) {

    if (!canvas_supported) {
        return;
    }

    raf();

    var wrapper = dom.id('intro_wrapper');
    wrapper.style.height = 'auto';

    renderer = renderer_setup(0xFFFFFF, wrapper);
    canvas = renderer.renderer.view;

    experiment = experiments.citylike;
    experiment.init(renderer);

    tab.visibility(function(is_visible) {
        if (is_visible) {
            experiment.play();
            run();
        } else {
            experiment.pause();
        }

        document.title = is_visible ? 'Active' : 'Paused';
    });

    viewport.visibility(canvas, function(is_visible) {
        if (is_visible) {
            experiment.play();
            run();
        } else {
            experiment.pause();
        }
    });

    resize.init();
    run();
}

function update() {
    if (stop) {
        return;
    }

    if (!resize.is_resizing) {
        if (resize.has_resized) {
            experiment.scale(resize.scale.change);
            resize.has_resized = false;
        } else {
            experiment.update();
        }
    }

    run();
}

function run() {
    window.requestAnimationFrame(update);
}
