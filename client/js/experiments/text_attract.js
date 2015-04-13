'use strict';

var gfx             = require('gfx');
var pixelratio      = require('pixelratio');
var text            = require('text');
var particle        = require('particle');
var spawnpoints     = require('spawnpoints');
var lookuptables    = require('lookuptables');
var PIXI            = require('pixi.js');

var target_coords = [];
var particles = [];
var dead_particles = [];
var canvas_size = {
    width:  0,
    height: 0
};
var stage;
var renderer;
var paused = false;
var dead_count = 0;

var canvas_color = 0xFFFFFF;
var num_spawnpoints = 8;
var num_particles = 1000;

var experiment = {
    init: function(wrapper_el) {

        // TODO: Create a module for setting up a renderer. Handle hidpi stuff there
        canvas_size.width = document.documentElement.clientWidth;
        canvas_size.height = canvas_size.width * 0.5625;

        stage = new PIXI.Stage(canvas_color);
        renderer = PIXI.autoDetectRenderer(canvas_size.width,
                                           canvas_size.height);

        var ratio = pixelratio.get_ratio(renderer.view);
        renderer.resize(canvas_size.width * ratio,
                        canvas_size.height *ratio);

        wrapper_el.appendChild(renderer.view);

        renderer.view.style.width = canvas_size.width + 'px';
        renderer.view.style.height = canvas_size.height + 'px';

        var circle_gfx = gfx.circle({
            radius: 2,
            color:  0x000000,
            alpha:  1
        });

        target_coords = text.create({
            width:          canvas_size.width,
            height:         canvas_size.height,
            min_font_size:  12,
            max_font_size:  40,
            font:           'Helvetica',
            text:           'Think people',
            debug:          false
        });

        var s_points = spawnpoints.create(canvas_size.width * ratio,
                                          canvas_size.height * ratio,
                                          num_spawnpoints);
        // var particle_i = 0;
        var amount = 0;

        s_points.forEach(function(sp) {
            amount = Math.round(num_particles * sp.weight);

            for (var i=0; i<amount; i++) {
                var deg = Math.floor(Math.random() * 360);
                var radius = Math.random() * sp.size * 0.5 * (4 + sp.weight);
                var coord = lookuptables.get_coord(deg, radius);
                var target = target_coords[Math.floor(Math.random() * target_coords.length)];

                // particle_i++;

                particles.push(particle.create(stage, circle_gfx, {
                    target: {
                        x: target.x * ratio,
                        y: target.y * ratio
                    },
                    pos: {
                        x: sp.x + coord.x,
                        y: sp.y + coord.y
                    }
                }));
            }
        });

        return renderer.view;
    },

    update: function() {
        if (paused) {
            return false;
        }

        dead_count = 0;

        particles.forEach(function(particle) {
            if (particle.alive) {
                particle.update();
            } else {
                ++dead_count;
            }
        });

        renderer.render(stage);

        // label(dead_count + '/' + particles.length, 10, 20);

        if (dead_count === particles.length) {
            console.log('particles dead');
            paused = true;
        }

        return true;
    },

    pause: function() {
        paused = true;
    },

    play: function() {
        paused = false;
    }
};

function label(caption, x, y) {
    ctx.font = '12 px Helvetica';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#000';
    ctx.fillText(caption, x, y);
}

function kill(particle) {
    var exists = false;
    for (var i=0; i<dead_particles.length; i++) {
        if (dead_particles[i] === particle) {
            exists = true;
            break;
        }
    }

    if (!exists) {
        dead_particles.push(particle);
    }
}

module.exports = experiment;

