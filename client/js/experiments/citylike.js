'use strict';

var dom             = require('dom');
var gfx             = require('gfx');
var human           = require('human');
var spawnpoints     = require('spawnpoints');
var lookuptables    = require('lookuptables');
var text            = require('text');
var color           = require('color');
var renderer        = require('renderer');
var pixelratio      = require('pixelratio');
var PIXI            = require('pixi.js');

var humans = [];
var dead_humans = [];
var dead_index = 0;
var paused = false;
var blocks = [];
var renderer_w;
var renderer_h;

var textres;
var circle_gfx;
var text_ar = 1;

var max = 0;
var old_height = 0;
var scale_y = 0;

var experiment = {

    init: function() {

        var cw = document.documentElement.clientWidth;
        var dot_radius = cw > 2000 ? 6 :
                         cw > 1600 ? 5 :
                         cw > 1100 ? 4 :
                         cw > 700 ? 3 : 2;

        renderer_w = renderer.width() * pixelratio.ratio();
        renderer_h = renderer.height() * pixelratio.ratio();

        circle_gfx = gfx.circle({
            radius: dot_radius,
            color:  0xFFFFFF,
            alpha:  1
        }).generateTexture();

        var text_max_width = renderer_w * 0.7;
        var text_max_height = renderer_h * 0.5;

        textres = text.create({
            width:          text_max_width / dot_radius,
            height:         text_max_height / dot_radius,
            spacing:        dot_radius,
            font_size:      40,
            font:           'Helvetica',
            text:           window.comte.text,
            debug:          true
        });

        text_ar = textres.size.height / textres.size.width;
        renderer.setup_dead(text_ar);

        dot_radius = text_max_width / textres.size.width;

        textres.coords = textres.coords.map(function(coord) {

            // var sprite = new PIXI.Sprite(circle_gfx);
            // sprite.anchor.x = 0.5;
            // sprite.anchor.y = 0.5;
            // sprite.alpha = 0.1;
            // sprite.position = {
            //     x: coord.x * dot_radius,
            //     y: coord.y * dot_radius
            // };
            // renderer.stage().addChild(sprite);

            return {
                x: coord.x * dot_radius,
                y: coord.y * dot_radius
            };
        });

        max = textres.coords.length * 0.5;
        shuffle(textres.coords);
    },

    update: function() {
        if (paused) {
            return false;
        }

        if (humans.length < 40 && textres.coords.length > 0) {
        // if (humans.length < 80 && textres.coords.length > max) {
            humans.push(human.create(circle_gfx, {
                target: get_target_coord(),
                pos:    {
                    x: ((Math.random() * renderer.width()) - (renderer.width() * 0.5)) * pixelratio.ratio(),
                    y: ((Math.random() * renderer.height()) - (renderer.height() * 0.5)) * pixelratio.ratio()
                },
                tint:   color.palette()
            }));
        }

        dead_index = -1;

        humans.forEach(function(human, i) {
            if (human.alive) {
                human.update();
            } else {
                dead_index = i;
            }
        });

        renderer.render();

        if (dead_index > -1) {
            humans.splice(dead_index, 1);
        }

        if (humans.length === 0) {
            paused = true;
        }

        return true;
    },

    pause: function() {
        paused = true;
    },

    paused: function() {
        return paused;
    },

    play: function() {
        paused = false;
    },

    exit: function() {
        paused = true;

        // humans.forEach(function(human) {
        //     human.exit();
        //     human = null;
        // });
        // humans = [];

        // dead_humans.forEach(function(dp) {
        //     dp.exit();
        //     dp = null;
        // });
        // dead_humans = [];

        // renderer.stage().removeChildren();
        // renderer.removeDots();
    },

    scale: function(change_x, change_y) {
        old_height = renderer.dead_sprite().height;

        renderer.scale(change_x, change_y);

        scale_y = renderer.dead_sprite().height / old_height;

        textres.coords.forEach(function(c) {
            c.x = c.x * change_x;
            c.y = c.y * scale_y;
        });

        humans.forEach(function(human) {
            human.offset(change_x, scale_y);
        });

        return this;
    }
};

module.exports = experiment;

function get_target_coord() {
    if (textres.coords.length > 0) {
        return textres.coords.shift();
    }
    return null;
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
