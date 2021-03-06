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
var renderer = {};
var paused = false;
var dead_count = 0;
var circle_gfx;
var s_points;
var amount = 0;
var deg;
var radius;
var coord;
var target;

var num_spawnpoints = 8;
var num_particles = 200;

var experiment = {
    init: function(a_renderer) {

        renderer = a_renderer;

        if (typeof circle_gfx === 'undefined') {
            circle_gfx = gfx.circle({
                radius: 2,
                color:  0x000000,
                alpha:  1
            });
        }

        target_coords = text.create({
            width:          renderer.width,
            height:         renderer.height,
            min_font_size:  12,
            max_font_size:  40,
            font:           'Helvetica',
            text:           'Think people',
            debug:          false
        });

        s_points = spawnpoints.create(renderer.width * renderer.ratio,
                                      renderer.height * renderer.ratio,
                                      num_spawnpoints);
        amount = 0;

        s_points.forEach(function(sp) {
            amount = Math.round(num_particles * sp.weight);

            for (var i=0; i<amount; i++) {
                deg = Math.floor(Math.random() * 360);
                radius = Math.random() * sp.size * 0.5 * (4 + sp.weight);
                coord = lookuptables.get_coord(deg, radius);
                target = target_coords[Math.floor(Math.random() * target_coords.length)];

                particles.push(particle.create(renderer.stage, circle_gfx, {
                    target: {
                        x: target.x * renderer.ratio,
                        y: target.y * renderer.ratio
                    },
                    pos: {
                        x: sp.x + coord.x,
                        y: sp.y + coord.y
                    }
                }));
            }
        });
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

        renderer.renderer.render(renderer.stage);

        if (dead_count === particles.length) {
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
        particles.forEach(function(particle) {
            particle.exit();
            particle = null;
        });
        particles = [];
        target_coords.forEach(function(tc) {
            tc = null;
        });
        target_coords = [];
        dead_particles.forEach(function(dp) {
            dp.exit();
            dp = null;
        });
        dead_particles = [];
        dead_count = 0;
        text.exit();
        renderer.stage.removeChildren();
    },

    scale: function(change) {
        renderer.width *= change;
        renderer.height *= change;

        renderer.renderer.resize(renderer.width * renderer.ratio,
                                 renderer.height * renderer.ratio);

        renderer.renderer.view.style.width = renderer.width + 'px';
        renderer.renderer.view.style.height = renderer.height + 'px';

        particles.forEach(function(particle) {
            particle.offset(change);
        });

        return this;
    }
};

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

