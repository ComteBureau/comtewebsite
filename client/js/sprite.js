'use strict';

var pixelratio      = require('pixelratio');

var Sprite = {
    init: function() {
        this._canvas = document.createElement('canvas');
        this._canvas.width = (this.options.width * pixelratio.ratio) + 2;
        this._canvas.height = (this.options.height * pixelratio.ratio) + 2;

        this.ctx = this._canvas.getContext('2d');

        this.ctx.fillStyle = this.options.color;
        if (this.options.width === 1 &&
            this.options.height === 1) {
            this.ctx.rect(0, 0, 1, 1);
        } else {
            this.ctx.arc((this.options.width / 2) + 1,
                         (this.options.height / 2) + 1,
                         this.options.width / 2,
                         0, Math.PI * 2);
        }
        this.ctx.fill();
    }
};

Object.defineProperty(Sprite, 'canvas', {
    get: function() {
        return this._canvas;
    },
    set: function(value) {
        this._canvas = value;
    },
});

module.exports.circle = function(options) {
    var instance = Object.create(Sprite, {
        options: {
            value: options
        }
    });
    instance.init();
    return instance;
}
