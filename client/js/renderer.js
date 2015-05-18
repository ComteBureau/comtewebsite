'use strict';

var PIXI            = require('pixi.js');
var pixelratio      = require('pixelratio');

var width = 0;
var height = 0;
var stage;
var renderer;

var sixteen_nine = 0.5625;
var sixteen_seven = 0.4375;

var dead_rtx;
var dead_container;
var dead_sprite;

var r = {
    setup: function(color, container) {

        width = document.documentElement.clientWidth;
        height = window.innerHeight;

        var ratio = pixelratio.get_ratio();

        stage = new PIXI.Container();
        renderer = PIXI.autoDetectRenderer(width, height);
        renderer.backgroundColor = color;
        container.appendChild(renderer.view);

        dead_container = new PIXI.Container();
        dead_rtx = new PIXI.RenderTexture(renderer,
                                          width * ratio,
                                          height * ratio);
        dead_sprite = new PIXI.Sprite(dead_rtx);
        stage.addChild(dead_sprite);

        renderer.resize(width * ratio, height * ratio);

        renderer.view.style.width = width + 'px';
        renderer.view.style.height = height + 'px';

        // Has something to do with interaction
        var ticker = PIXI.ticker.shared;
        ticker.autoStart = false;
        ticker.stop();

        renderer.plugins.interaction.destroy()
    },

    add_dead: function(sprite) {
        dead_container.addChild(sprite);
        dead_rtx.render(dead_container);
    },

    render: function() {
        renderer.render(stage);
    },

    resize_by: function(factor) {
        renderer.resize(renderer.width * factor,
                        renderer.height * factor);
        renderer.view.style.width = renderer.width + 'px';
        renderer.view.style.height = renderer.height + 'px';
    },

    canvas: function() {
        return renderer.view;
    },

    stage: function() {
        return stage;
    },

    width: function(new_width) {
        if (typeof new_width !== 'undefined') {
            width = new_width;
        }
        return width;
    },

    height: function(new_height) {
        if (typeof new_height !== 'undefined') {
            height = new_height;
        }
        return height;
    },
};

module.exports = r;
