'use strict';

var eventlistener   = require('eventlistener');

var scale = {
    current_width: 0,
    current_height: 0,
    new_width: 0,
    new_height: 0,
    change: 0
};
var cooldown_time = 300; // ms
var event_time = 0;
var timer;
var ar = 0.5625;
var is_resizing = false;
var has_resized = false;

module.exports.init = function() {
    scale.current_width = document.documentElement.clientWidth;
    scale.current_height = scale.current_width * ar;

    eventlistener.add(window, 'resize', function(event) {
        is_resizing = true;
        event_time = Date.now();

        scale.new_width = event.currentTarget.document.documentElement.clientWidth;
        scale.new_height = scale.new_width * ar;

        if (typeof timer === 'undefined') {
            timer = window.setInterval(resize_handler, 100);
        }
    }, 'on');
}

Object.defineProperty(module.exports, 'is_resizing', {
    get: function() {
        return is_resizing;
    }
});

Object.defineProperty(module.exports, 'scale', {
    get: function() {
        return scale;
    }
});

Object.defineProperty(module.exports, 'has_resized', {
    get: function() {
        return has_resized;
    },
    set: function(value) {
        has_resized = value;
    }
});

function resize_handler() {
    if (Date.now() - event_time >= cooldown_time) {
        window.clearInterval(timer);
        timer = undefined;

        scale.change = scale.new_width / scale.current_width;

        is_resizing = false;
        has_resized = true;

        scale.current_width = document.documentElement.clientWidth;
        scale.current_height = scale.current_width * ar;
    }
}
