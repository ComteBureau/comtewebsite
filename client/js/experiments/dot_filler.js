'use strict';

var dom             = require('dom');
var gfx             = require('gfx');
var particle        = require('particle');
var spawnpoints     = require('spawnpoints');
var lookuptables    = require('lookuptables');
var PIXI            = require('pixi.js');

var particles = [];
var dead_particles = [];
var dead_index = 0;
var renderer = {};
var paused = false;
var total_dead = 0;
var total = 0;
var circle_gfx;
var dot_gfx;
var dot_scale = 0;
var logo_rect;
var dot_radius;
var target;
var s_points;
var amount = 0;
var deg;
var radius;
var coord;

var num_spawnpoints = 8;
var num_particles = 100;
var dot;

var experiment = {

    // expose settings publicly, let all child object read settings without cachin to allow
    // realtime manipulation
    settings: {
        particle_speed: 0
    },

    init: function(a_renderer) {

        renderer = a_renderer;

        if (typeof circle_gfx === 'undefined') {
            circle_gfx = gfx.circle({
                radius: 10,
                color:  0x000000,
                alpha:  1
            });
        }

        logo_rect = dom.id('logo').getBoundingClientRect();
        dot_radius = (logo_rect.height / 2);

        target = {
            x: ((logo_rect.left + logo_rect.width) * renderer.ratio) + dot_radius,
            y: ((logo_rect.top - dot_radius) * renderer.ratio) + dot_radius
        };

        if (typeof dot_gfx === 'undefined') {
            dot_gfx = gfx.circle({
                radius: dot_radius,
                color:  0x000000,
                alpha:  1
            });
        }

        dot = new PIXI.Sprite(dot_gfx.generateTexture());
        dot.anchor.x = 0.5;
        dot.anchor.y = 0.5;
        dot.position.x = target.x;
        dot.position.y = target.y;
        dot.scale.x = 0;
        dot.scale.y = 0;
        renderer.stage.addChild(dot);

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

                particles.push(particle.create(renderer.stage, circle_gfx, {
                    target: {
                        x: target.x,
                        y: target.y
                    },
                    pos: {
                        x: sp.x + coord.x,
                        y: sp.y + coord.y
                    }
                }));
            }
        });

        total = particles.length;
    },

    update: function() {
        if (paused) {
            return false;
        }

        dead_index = -1;

        particles.forEach(function(particle, i) {
            if (particle.alive) {
                particle.update();
            } else {
                dead_index = i;
            }
        });

        total_dead = total - particles.length;
        dot_scale = total_dead / total;
        dot.scale.x = dot_scale;
        dot.scale.y = dot_scale;

        renderer.renderer.render(renderer.stage);

        if (dead_index > -1) {
            particles.splice(dead_index, 1);
        }

        if (particles.length === 0) {
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

        particles.forEach(function(particle) {
            particle.exit();
            particle = null;
        });
        particles = [];

        dead_particles.forEach(function(dp) {
            dp.exit();
            dp = null;
        });
        dead_particles = [];

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

        particles.forEach(function(particle) {
            particle.offset(change);
        });

        dot.position.x *= change;
        dot.position.y *= change;

        return this;
    }
};

module.exports = experiment;

