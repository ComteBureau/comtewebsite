'use strict';

var eventlistener   = require('eventlistener');

var scale = {
    current_width: 0,
    current_height: 0,
    new_width: 0,
    new_height: 0,
    change_x: 0,
    change_y: 0
};
var cooldown_time = 300; // ms
var event_time = 0;
var timer;
var listener = null;

module.exports.listen = function(_listener) {
    listener = _listener;

    scale.current_width = document.documentElement.clientWidth;
    scale.current_height = window.innerHeight;

    eventlistener.add(window, 'resize', function(event) {
        event_time = Date.now();

        scale.new_width = document.documentElement.clientWidth;
        scale.new_height = window.innerHeight;

        if (typeof timer === 'undefined') {
            timer = window.setInterval(resize_handler, 100);
        }
    }, 'on');
}

function resize_handler() {
    if (Date.now() - event_time >= cooldown_time) {
        window.clearInterval(timer);
        timer = undefined;

        scale.change_x = scale.new_width / scale.current_width;
        scale.change_y = scale.new_height / scale.current_height;

        scale.current_width = document.documentElement.clientWidth;
        scale.current_height = window.innerHeight;

        if (listener) {
            listener(scale);
        }
    }
}
