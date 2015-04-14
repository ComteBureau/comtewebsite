'use strict';

var eventlistener   = require('eventlistener');

var scale = {
    current_width: 0,
    current_height: 0,
    new_width: 0,
    new_height: 0,
    change_width: 0,
    change_height: 0
};
var cooldown_time = 200; // ms
var event_time = 0;
var timer;

module.exports = function(cb) {
    scale.current_width = document.documentElement.clientWidth;
    scale.current_height = document.documentElement.clientHeight;

    eventlistener.add(window, 'resize', function(event) {
        event_time = Date.now();

        scale.new_width = event.currentTarget.document.documentElement.clientWidth;
        scale.new_height = event.currentTarget.document.documentElement.clientHeight;

        if (typeof timer === 'undefined') {
            timer = window.setInterval(resize_handler.bind(cb), 100);
        }
    }, 'on');
}

function resize_handler() {
    if (Date.now() - event_time >= cooldown_time) {
        window.clearInterval(timer);
        timer = undefined;

        scale.change_width = scale.new_width / scale.current_width;
        scale.change_height = scale.new_height / scale.current_height;

        this(scale);

        scale.current_width = document.documentElement.clientWidth;
        scale.current_height = document.documentElement.clientHeight;
    }
}
