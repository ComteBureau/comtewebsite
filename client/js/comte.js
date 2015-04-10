"use strict";

var dom             = require('dom');
var viewport        = require('viewport');
var tab             = require('tab');
var experiment      = require('experiments/text_attract');

module.exports = function comte() {

    var canvas = dom.id('intro');

    experiment.init(canvas);

    tab.visibility(function(is_visible) {
        if (is_visible) {
            experiment.play();
        } else {
            experiment.pause();
        }

        document.title = is_visible ? 'Active' : 'Paused';
    });

    viewport.visibility(canvas, function(is_visible) {
        if (is_visible) {
            experiment.play();
        } else {
            experiment.pause();
        }
       document.body.style.background = is_visible ? '#ccc' : '#f00';
    });

    window.requestAnimationFrame(update);
}

function update() {
    if (experiment.update()) {
        window.requestAnimationFrame(update);
    }
}
