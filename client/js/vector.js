'use strict';

var Vector = {
    _mag: 0,

    init: function() {},

    set: function(x, y) {
        this.x = x;
        this.y = y;
        return this;
    },

    subtract: function(v) {
        this.x = this.x - v.x;
        this.y = this.y - v.y;
        return this;
    },

    add: function(v) {
        this.x = this.x + v.x;
        this.y = this.y + v.y;
        return this;
    },

    normalize: function() {
        this._mag = this.magnitude();
        if (this._mag !== 0) {
            this.divide(this._mag);
        }
        return this;
    },

    magnitude: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    divide: function(f) {
        f = parseFloat(f);
        this.x = this.x / f;
        this.y = this.y / f;
        return this;
    },

    multiply: function(f) {
        f = parseFloat(f);
        this.x = this.x * f;
        this.y = this.y * f;
        return this;
    },

    limit: function(f) {
        f = parseFloat(f);
        if (this.magnitude() > f) {
            this.normalize();
            this.multiply(f);
        }
        return this;
    }
};

var Vectors = {
    create: function(x, y) {
        var instance = Object.create(Vector, {
            x: {
                value:      typeof x !== 'number' ? 0 : x,
                writable:   true
            },
            y: {
                value:      typeof y !== 'number' ? 0 : y,
                writable:   true
            }
        });
        instance.init();
        return instance;
    },

    subtract: function(a, b) {
        tmp.a.set(a.x, a.y);
        return tmp.a.subtract(b);
    },

    add: function(a, b) {
        tmp.a.set(a.x, a.y);
        return tmp.a.add(b);
    }
};

var tmp = {
    a: Vectors.create()
};

module.exports = Vectors;
