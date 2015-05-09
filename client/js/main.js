"use strict";

var eventlistener = require('eventlistener');

if (document.readyState === 'complete' ||
    document.readyState === 'interactive') {
    window.setTimeout(_boot, 0);
} else {
    eventlistener.add(document, 'DOMContentLoaded', _boot);
    eventlistener.add(window, 'load', _boot, 'on');
}

function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

function _boot() {
    if (!document.body) {
        window.setTimeout(_boot, 20);
    } else {
        eventlistener.remove(document, 'DOMContentLoaded', _boot);
        eventlistener.remove(window, 'load', _boot, 'on');

        var resources   = require('resources');
        var frontpage   = require('frontpage');
        var dots        = require('dots');

        resources({
            font: [{
                cache_name: 'Comte',
                file:       '/public/css/fonts.css'
            }]
        });

        frontpage();

        dots(isCanvasSupported());
    }
};
