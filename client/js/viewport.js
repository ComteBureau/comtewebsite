"use strict";

var eventlistener = require('eventlistener');

var rect;
var dh;
var handler;

module.exports.visibility = function(element, callback) {

    handler = function() {
        callback(isElementInViewport(element));
    };

    eventlistener.add(window, 'DOMContentLoaded', handler, 'on');
    eventlistener.add(window, 'load', handler, 'on');
    eventlistener.add(window, 'scroll', handler, 'on');
    eventlistener.add(window, 'resize', handler, 'on');
}

function isElementInViewport(el) {
    rect = el.getBoundingClientRect();
    dh = (window.innerHeight || document.documentElement.clientHeight);

    return (rect.top >= 0 && rect.top <= dh) ||
           (rect.bottom <= dh && rect.bottom >= 0);
}
