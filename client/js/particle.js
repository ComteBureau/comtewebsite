"use strict";

var particle = {
    init: function() {
        this.x = (this.target_x + Math.round(Math.random() * 100)) - 100;
        this.y = (this.target_y + Math.round(Math.random() * 100)) - 100;
    },

    update: function() {
        var x_dir = this.target_x - this.x;
        this.x += x_dir * 0.01;
        var y_dir = this.target_y - this.y;
        this.y += y_dir * 0.01;
    },

    draw: function(ctx) {
        ctx.drawImage(this.sprite, this.x - 1, this.y - 1);
    }
};

module.exports.create = function create(sprite, x, y) {
    var p = Object.create(particle, {
        sprite: {
            writable:   false,
            value:      sprite
        },
        target_x: {
            value:      x
        },
        target_y: {
            value:      y
        }});

    p.init();
    return p;
}
