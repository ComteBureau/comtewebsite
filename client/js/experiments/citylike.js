'use strict';

var dom             = require('dom');
var gfx             = require('gfx');
var human           = require('human');
var spawnpoints     = require('spawnpoints');
var lookuptables    = require('lookuptables');
var text            = require('text');
var PIXI            = require('pixi.js');

var humans = [];
var dead_humans = [];
var target_coords = [];
var dead_index = 0;
var renderer = {};
var paused = false;
var total_dead = 0;
var total = 0;
var circle_gfx;
var target;
var s_points;
var amount = 0;
var deg;
var radius;
var coord;

var num_spawnpoints = 8;
var num_particles = 800;
var dot;

var target_c;

var experiment = {

    settings: {
        particle_speed: 0
    },

    init: function(a_renderer) {

        renderer = a_renderer;

        circle_gfx = gfx.circle({
            radius: 2,
            color:  0x000000,
            alpha:  1
        });

        target_c = gfx.circle({
            radius: 5,
            color:  0xFF0000,
            alpha:  1
        });

        target_coords = text.create({
            width:          renderer.width,
            height:         renderer.height,
            font_size:      32,
            font:           'Helvetica',
            text:           'Think people',
            debug:          false
        });

        // console.log('target_coords', target_coords.length);

        var block_size = Math.max(Math.round(renderer.width * 0.01), 20);
        var cols = Math.round(renderer.width / block_size) + 2;
        var rows = Math.round(renderer.height / block_size) + 2;
        var offset_h = ((cols * block_size) - renderer.width) * -0.5;
        var offset_v = ((rows * block_size) - renderer.height) * -0.5;
        var x = 0;
        var y = 0;
        var blocks = [];

        for (var i=0; i<(cols*rows); i++) {
            blocks.push({
                x:          (x * block_size + offset_h) * renderer.ratio,
                y:          (y * block_size + offset_v) * renderer.ratio,
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

        // var rnd_t;
        // var rnd_s;
        var instance;

        for (var n=0; n<num_particles; n++) {
            // rnd_t = Math.floor(Math.random() * blocks.length);
            // rnd_s = Math.floor(Math.random() * blocks.length);

            // console.log('start '+blocks[rnd_s].x+'/'+blocks[rnd_s].y+' '+
            //             'end '+blocks[rnd_t].x+'/'+blocks[rnd_t].y);

            // var target_sprite = new PIXI.Sprite(target_c.generateTexture());
            // target_sprite.anchor.x = 0.5;
            // target_sprite.anchor.y = 0.5;
            // target_sprite.position = {
            //     x: blocks[rnd_t].x,
            //     y: blocks[rnd_t].y
            // };
            // renderer.stage.addChild(target_sprite);

            humans.push(human.create(renderer.stage, circle_gfx, {
                target: blocks[Math.floor(Math.random() * blocks.length)],
                pos:    blocks[Math.floor(Math.random() * blocks.length)],
                blocks: blocks
            }));
        }

        total = humans.length;
    },

    update: function() {
        if (paused) {
            return false;
        }

        dead_index = -1;

        humans.forEach(function(human, i) {
            if (human.alive) {
                human.update();
            } else {
                dead_index = i;
            }
        });

        total_dead = total - humans.length;

        renderer.renderer.render(renderer.stage);

        if (dead_index > -1) {
            humans.splice(dead_index, 1);
        }

        if (humans.length === 0) {
            console.log('game over');
            paused = true;
        }

        return this;
    },

    pause: function() {
        paused = true;
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

        total = 0;
        dot = null;

        renderer.stage.removeChildren();
    },

    scale: function(change) {
        renderer.width *= change;
        renderer.height *= change;

        renderer.renderer.resize(renderer.width * renderer.ratio,
                                 renderer.height * renderer.ratio);

        renderer.renderer.view.style.width = renderer.width + 'px';
        renderer.renderer.view.style.height = renderer.height + 'px';

        humans.forEach(function(human) {
            human.offset(change);
        });

        // dot.position.x *= change;
        // dot.position.y *= change;

        return this;
    }
};

module.exports = experiment;

