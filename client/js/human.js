"use strict";

var vector          = require('vector');
var utils           = require('utils');
var PIXI            = require('pixi.js');

var human = {

    desired:        null,
    desired_mag:    null,
    steer:          null,
    cur_target:     null,

    position:       null,
    velocity:       null,
    acceleration:   null,

    speed:          0,
    max_speed:      0,
    alive:          true,
    targets:        null,
    cur_target_i:   0,

    init: function(container, gfx, pos) {
        this.alive = true;
        this.targets = [];
        this.cur_target = {};

        this.max_speed = Math.round(Math.random() * 5) + 5;
        this.max_force = 20;

        this.position = vector.create(pos.x, pos.y);

        if (Math.random() > 0.5 ? true : false) {
            this.targets.push({
                x: pos.x,
                y: this.target.y
            });
        } else {
            this.targets.push({
                x: this.target.x,
                y: pos.y
            });
        }

        this.targets.push(this.target);

        this.set_target(0);

        this.velocity = vector.create();
        this.acceleration = vector.create();

        this.sprite = new PIXI.Sprite(gfx.generateTexture());
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.alpha = 1;

        container.addChild(this.sprite);
    },

    offset: function(change) {
        this.position.x *= change;
        this.position.y *= change;

        this.target.x *= change;
        this.target.y *= change;

        this.max_speed *= change;
    },

    update: function() {
        if (!this.alive) {
            return;
        }

        this.seek(this.cur_target);
        this.velocity.add(this.acceleration).limit(this.max_speed);
        this.position.add(this.velocity);
        this.acceleration.multiply(0);

        this.sprite.position = this.position;

        if (this.desired_mag < 1) {
            this.position.x = this.cur_target.x;
            this.position.y = this.cur_target.y;

            this.cur_target_i++;
            if (this.cur_target_i >= this.targets.length) {
                this.alive = false;
            } else {
                this.set_target(this.cur_target_i);
                this.velocity.multiply(0);
            }
        }
    },

    applyForce: function(force) {
        this.acceleration.add(force);
    },

    seek: function(target) {
        this.desired = vector.subtract(target, this.position);
        this.desired_mag = this.desired.magnitude();

        this.desired.normalize();

        // TODO: calc distance using pixelratio and size of dot
        this.speed = this.desired_mag < 100 ?
            utils.map(this.desired_mag, 0, 100, 0, this.max_speed) :
            this.max_speed;
        this.desired.multiply(this.speed);

        this.desired
            .normalize()
            .multiply(this.max_speed);

        this.steer = vector
            .subtract(this.desired, this.velocity)
            .limit(this.max_force);

        this.applyForce(this.steer);
    },

    set_target: function(index) {
        this.cur_target = this.targets[index];
    },

    exit: function() {
        this.alive = false;
        this.target = null;
        this.position = null;
        this.velocity = null;
        this.acceleration = null;
        this.speed = null;
        this.max_speed = null;
        this.max_force = null;
        this.alive = null;
        this.target_dist = null;
        this.sprite = null;
        this.desired = null;
        this.desired_mag = null;
        this.steer = null;
    }
};

function sign(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

module.exports.create = function create(container, gfx, options) {
    var instance = Object.create(human, {
        target: {
            value:      options.target,
            writable:   true
        },
        blocks: {
            value:      options.blocks,
            writable:   false
        }
    });

    instance.init(container, gfx, options.pos);
    return instance;
}
