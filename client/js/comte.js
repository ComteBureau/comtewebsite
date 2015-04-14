"use strict";

var dom             = require('dom');
var viewport        = require('viewport');
var tab             = require('tab');
var experiment      = require('experiments/text_attract');
var StatsJs         = require('stats.js');
var resize          = require('resize');

var stats;

module.exports = function comte() {

    if (typeof StatsJs !== 'undefined') {
        stats = new StatsJs();
        stats.setMode(0); // 0: fps, 1: ms
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '100px';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);
    } else {
        stats = {
            begin: function() {},
            end: function() {}
        };
    }

    var canvas = experiment.init(dom.id('intro_wrapper'));

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
       // document.body.style.background = is_visible ? '#ccc' : '#f00';
    });

    resize(function(scale) {
        experiment.scale(scale.change_width, scale.change_height);
    });

    run();
}

function update() {
    stats.begin();
    if (experiment.update()) {
        run();
    }
    stats.end();
}

function run() {
    window.requestAnimationFrame(update);
}
