'use strict';

var PIXI            = require('pixi.js');
var pixelratio      = require('pixelratio');

var width = 0;
var height = 0;
var stage;
var renderer;
var ratio;

var sixteen_nine = 0.5625;
var sixteen_seven = 0.4375;

var dead_rtx;
var dead_container;
var dead_sprite;

var r = {
    setup: function(color, container) {

        width = document.documentElement.clientWidth;
        height = window.innerHeight;

        stage = new PIXI.Container();
        renderer = PIXI.autoDetectRenderer(width, height);
        renderer.backgroundColor = color;
        container.appendChild(renderer.view);

        dead_container = new PIXI.Container();
        dead_rtx = new PIXI.RenderTexture(renderer, width, height);
        dead_sprite = new PIXI.Sprite(dead_rtx);
        stage.addChild(dead_sprite);

        ratio = pixelratio.get_ratio(renderer.view);
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

    canvas: function() {
        return renderer.view;
    },

    stage: function() {
        return stage;
    },

    width: function() {
        return width;
    },

    height: function() {
        return height;
    },

    ratio: function() {
        return ratio;
    },
};

module.exports = r;
