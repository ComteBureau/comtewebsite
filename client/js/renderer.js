'use strict';

var PIXI            = require('pixi.js');
var pixelratio      = require('pixelratio');
var gfx             = require('gfx');

var width = 0;
var height = 0;
var stage;
var renderer;

var sixteen_nine = 0.5625;
var sixteen_seven = 0.4375;

var dead_rtx;
var dead_container;
var dead_sprite;
var dead_coords = [];
var dead_scale_y = 1;

var scaled = false;
var dead_ar = 1;

var r = {
    setup: function(color, container) {

        width = document.documentElement.clientWidth;
        height = window.innerHeight;

        var ratio = pixelratio.get_ratio();

        stage = new PIXI.Container();
        stage.x = width * 0.5 * ratio;
        stage.y = height * 0.5 * ratio;

        renderer = PIXI.autoDetectRenderer(width, height);
        renderer.backgroundColor = color;
        container.appendChild(renderer.view);

        renderer.resize(width * ratio, height * ratio);

        renderer.view.style.width = width + 'px';
        renderer.view.style.height = height + 'px';

        // Has something to do with interaction
        var ticker = PIXI.ticker.shared;
        ticker.autoStart = false;
        ticker.stop();

        renderer.plugins.interaction.destroy();
    },

    render: function() {
        // TODO: test without
        if (scaled) {
            dead_rtx.clear();
            dead_rtx.render(dead_container);
            scaled = false;
        }

        renderer.render(stage);
    },

    scale: function(change_x, change_y) {
        width = document.documentElement.clientWidth;
        height = window.innerHeight;

        renderer.resize(width * pixelratio.ratio(),
                        height * pixelratio.ratio());

        renderer.view.style.width = width + 'px';
        renderer.view.style.height = height + 'px';

        stage.position.x = width * 0.5 * pixelratio.ratio();
        stage.position.y = height * 0.5 * pixelratio.ratio();

        dead_scale_y = (width * pixelratio.ratio() * dead_ar) / dead_sprite.height;

        dead_container.children.forEach(function(child) {
            child.position.x = child.position.x * change_x;
            child.position.y = child.position.y * dead_scale_y;
        });

        dead_rtx.resize(width * pixelratio.ratio(),
                        width * pixelratio.ratio() * dead_ar, true);

        dead_sprite.width = width * pixelratio.ratio();
        dead_sprite.height = width * pixelratio.ratio() * dead_ar;

        dead_rtx.clear();
        dead_rtx.render(dead_container);

        scaled = true;
    },

    dead_sprite: function() {
        return dead_sprite;
    },

    canvas: function() {
        return renderer.view;
    },

    stage: function() {
        return stage;
    },

    center: function() {
        return {
            x: width * 0.5 * pixelratio.ratio(),
            y: height * 0.5 * pixelratio.ratio()
        };
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

    add_dead: function(sprite) {
        sprite.position.x = sprite.position.x + dead_sprite.width * 0.5;
        sprite.position.y = sprite.position.y + dead_sprite.height * 0.5;
        dead_container.addChild(sprite);
        dead_rtx.render(dead_container);
    },

    setup_dead: function(ar) {
        dead_ar = ar;

        dead_rtx = new PIXI.RenderTexture(renderer,
                                          width * pixelratio.ratio(),
                                          width * pixelratio.ratio() * ar);

        dead_sprite = new PIXI.Sprite(dead_rtx);
        dead_sprite.anchor.x = 0.5;
        dead_sprite.anchor.y = 0.5;

        dead_container = new PIXI.Container();
        stage.addChild(dead_sprite);
    }
};

module.exports = r;
