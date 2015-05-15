'use strict';

var dom             = require('dom');
var gfx             = require('gfx');
var human           = require('human');
var spawnpoints     = require('spawnpoints');
var lookuptables    = require('lookuptables');
var text            = require('text');
var color           = require('color');
var renderer        = require('renderer');
var PIXI            = require('pixi.js');

var humans = [];
var dead_humans = [];
var dead_index = 0;
var paused = false;
var blocks = [];

var textres;
var circle_gfx;

var experiment = {

    init: function() {

        var cw = document.documentElement.clientWidth;
        var dot_radius = cw > 2000 ? 6 :
                         cw > 1600 ? 5 :
                         cw > 1100 ? 4 :
                         cw > 700 ? 3 : 2;

        circle_gfx = gfx.circle({
            radius: dot_radius,
            color:  0xFFFFFF,
            alpha:  1
        });

        var text_max_width = renderer.width() * 0.7;
        var text_max_height = renderer.height() * 0.5;

        textres = text.create({
            width:          text_max_width / dot_radius,
            height:         text_max_height / dot_radius,
            spacing:        dot_radius,
            font_size:      40,
            font:           'Helvetica',
            text:           window.comte.text,
            debug:          true
        });

        dot_radius = text_max_width / textres.size.width;

        var y_offset = (renderer.height() * 0.5) - (textres.size.height * 0.5 * dot_radius);
        var x_offset = (renderer.width() * 0.5) - (textres.size.width * 0.5 * dot_radius);

        x_offset = Math.max(0, x_offset);

        textres.coords = textres.coords.map(function(coord) {
            return {
                x: x_offset + (coord.x * dot_radius) + (Math.random() * dot_radius),
                y: y_offset + (coord.y * dot_radius) + (Math.random() * dot_radius)
            };
        });

        shuffle(textres.coords);

        var block_size = Math.max(Math.round(renderer.width() * 0.01), 20);
        var cols = Math.round(renderer.width() / block_size) + 2;
        var rows = Math.round(renderer.height() / block_size) + 2;
        var offset_h = ((cols * block_size) - renderer.width()) * -0.5;
        var offset_v = ((rows * block_size) - renderer.height()) * -0.5;
        var x = 0;
        var y = 0;

        for (var i=0; i<(cols*rows); i++) {
            blocks.push({
                x:          (x * block_size + offset_h) * renderer.ratio(),
                y:          (y * block_size + offset_v) * renderer.ratio(),
                disabled:   false,
                distance:   0,
                neighbour:  {
                    n: y > 0        ? ((y - 1) * cols) + x  : undefined,
                    e: x < cols - 1 ? (y * cols) + x + 1    : undefined,
                    s: y < rows - 1 ? ((y + 1) * cols) + x  : undefined,
                    w: x > 0        ? (y * cols) + x - 1    : undefined
                }
            });

            // var sprite = new PIXI.Sprite(circle_gfx.generateTexture());
            // sprite.anchor.x = 0.5;
            // sprite.anchor.y = 0.5;
            // sprite.alpha = 0.3;
            // sprite.position = {
            //     x: (x * block_size + offset_h) * renderer.ratio,
            //     y: (y * block_size + offset_v) * renderer.ratio
            // };
            // renderer.stage.addChild(sprite);

            x++;
            if (i > 0 && x % cols === 0) {
                x = 0;
                y++;
            }
        }
    },

    update: function() {
        if (paused) {
            return false;
        }

        if (humans.length < 40 && textres.coords.length > 0) {
            humans.push(human.create(circle_gfx, {
                target: get_target_coord(),
                pos:    blocks[Math.floor(Math.random() * blocks.length)],
                blocks: blocks,
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
            console.log('game over');
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

        humans.forEach(function(human) {
            human.exit();
            human = null;
        });
        humans = [];

        dead_humans.forEach(function(dp) {
            dp.exit();
            dp = null;
        });
        dead_humans = [];

        // renderer.stage().removeChildren();
        // renderer.removeDots();
    },

    scale: function(change) {
        // renderer.width *= change;
        // renderer.height *= change;

        // renderer.renderer.resize(renderer.width * renderer.ratio,
        //                          renderer.height * renderer.ratio);

        // renderer.renderer.view.style.width = renderer.width + 'px';
        // renderer.renderer.view.style.height = renderer.height + 'px';

        // humans.forEach(function(human) {
        //     human.offset(change);
        // });

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
