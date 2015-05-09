"use strict";

var vector          = require('vector');
var utils           = require('utils');
var PIXI            = require('pixi.js');

var tmp = {
    desired: null,
    desired_mag: null,
    steer: null
};

var particle = {

    position: null,
    velocity: null,
    acceleration: null,

    speed:          0,
    max_speed:      0,
    max_force:      0,
    alive:          true,
    target_dist:    5,

    init: function(container, gfx, pos) {
        this.alive = true;

        this.max_speed = Math.round((Math.random() * 100) + 100);
        this.max_force = 8000;
        this.target_dist = 5;

        this.position = vector.create(pos.x, pos.y);
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

        // this.seek(this.target);
        // this.velocity.add(this.acceleration).limit(this.max_speed);
        // this.position.add(this.velocity);
        // this.acceleration.multiply(0);

        // if (tmp.desired_mag <= this.target_dist &&
        //     this.velocity.magnitude() <= 1) {
        //     this.position.set(this.target.x, this.target.y);
        //     this.velocity.set(0, 0);
        //     this.alive = false;
        // }

        this.sprite.position = this.position;
    },

    applyForce: function(force) {
        this.acceleration.add(force);
    },

    seek: function(target) {
        tmp.desired = vector.subtract(this.target, this.position);
        tmp.desired_mag = tmp.desired.magnitude();

        this.speed = tmp.desired_mag < 100 ?
            utils.map(tmp.desired_mag, 0, 100, 0, this.max_speed) :
            this.max_speed;

        tmp.desired
            .normalize()
            .multiply(this.speed);

        tmp.steer = vector
            .subtract(tmp.desired, this.velocity)
            .limit(this.max_force);

        this.applyForce(tmp.steer);
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
        tmp = {
            desired: null,
            desired_mag: null,
            steer: null
        };
    }
};

module.exports.create = function create(container, gfx, options) {
    var instance = Object.create(particle, {
        target: {
            value:      options.target,
            writable:   true
        }
    });

    instance.init(container, gfx, options.pos);
    return instance;
}
