'use strict';

var sprite          = require('sprite');
var pixelratio      = require('pixelratio');
var text            = require('text');
var particle        = require('particle');
var spawnpoints     = require('spawnpoints');
var lookuptables    = require('lookuptables');

var target_coords = [];
var particles = [];
var dead_particles = [];
var canvas;
var ctx;
var paused = false;
var dead_count = 0;

var canvas_color = '#fff';
var num_spawnpoints = 8;
var num_particles = 1000;

var experiment = {
    init: function(a_canvas) {

        canvas = a_canvas;
        ctx = canvas.getContext('2d');
        canvas.width = document.documentElement.clientWidth;
        canvas.height = canvas.width * 0.5625;
        pixelratio(canvas);

        clear_canvas();

        var circle = sprite.circle({
            width:  2,
            height: 2,
            color:  'rgba(0, 0, 0, 0.2)'
        });

        target_coords = text.create({
            width:          canvas.width,
            height:         canvas.height,
            min_font_size:  12,
            max_font_size:  40,
            font:           'Helvetica',
            text:           'Think people',
            ratio:          pixelratio.ratio,
            debug:          false
        });

        var s_points = spawnpoints.create(canvas.width, canvas.height, num_spawnpoints);
        var particle_i = 0;
        var amount = 0;

        s_points.forEach(function(sp) {
            // ctx.drawImage(circle.canvas,
            //                 (sp.x - (circle.canvas.width / 2)) / pixelratio.ratio,
            //                 (sp.y - (circle.canvas.height / 2)) / pixelratio.ratio);

            amount = num_particles * sp.weight;

            for (var i=0; i<amount; i++) {
                var deg = Math.floor(Math.random() * 360);
                var radius = Math.random() * sp.size * 0.5 * (4 + sp.weight);
                var coord = lookuptables.get_coord(deg, radius);

                // ctx.drawImage(circle.canvas,
                //               (sp.x / pixelratio.ratio) + coord.x,
                //               (sp.y / pixelratio.ratio) + coord.y,
                //               circle.canvas.width,
                //               circle.canvas.height);

                particle_i++;

                // ctx.drawImage(circle.canvas,
                //               target.x,
                //               target.y,
                //               circle.canvas.width,
                //               circle.canvas.height);

                particles.push(particle.create(circle, {
                    target: target_coords[Math.floor(Math.random() * target_coords.length)],
                    pos:    {
                        x:  (sp.x / pixelratio.ratio) + coord.x,
                        y:  (sp.y / pixelratio.ratio) + coord.y
                    }
                }));

            }
        });

    },

    update: function() {
        if (paused) {
            return false;
        }

        clear_canvas();
        dead_count = 0;

        // if (dead_particles.length > 0) {
        //     var dead = dead_particles[0];
        //     for (var d=0; d<particles.length; d++) {
        //         if (particles[d] === dead) {
        //             break;
        //         }
        //     }
        //     particles.splice(d, 1);
        //     dead_particles.splice(0, 1);
        // }

        // if (particles.length === 0) {
        //     paused = true;
        // }

        particles.forEach(function(particle) {
            if (particle.alive) {
                particle.update();
            } else {
                ++dead_count;
                // kill(particle);
            }
            particle.draw(ctx);
        });

        label(dead_count + '/' + particles.length, 10, 20);

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

function clear_canvas() {
    ctx.fillStyle = canvas_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

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

