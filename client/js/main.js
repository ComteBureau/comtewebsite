"use strict";

var eventlistener = require('eventlistener');

if (document.readyState === 'complete' ||
    document.readyState === 'interactive') {
    window.setTimeout(_boot, 0);
} else {
    eventlistener.add(document, 'DOMContentLoaded', _boot);
    eventlistener.add(window, 'load', _boot, 'on');
}

function isOK() {
    var elem = document.createElement('canvas');
    var canvas_ok = !!(elem.getContext && elem.getContext('2d'));
    var bi = get_browser_info();
    console.log(bi.name, bi.version);
    return (canvas_ok && bi.name !== 'MSIE') ||
           (canvas_ok && bi.name === 'MSIE' && bi.version === 11);
}

function get_browser_info() {
    var ua = navigator.userAgent,
             tem,
             M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return {
            name: 'IE',
            version: (tem[1]||'')
        };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/);
        if (tem != null) {
            return {
                name: 'Opera',
                version: tem[1]
            };
        }
    }

    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1]);
    }
    return {
        name: M[0],
        version: M[1]
    };
}

function _boot() {
    if (!document.body) {
        window.setTimeout(_boot, 20);
    } else {
        eventlistener.remove(document, 'DOMContentLoaded', _boot);
        eventlistener.remove(window, 'load', _boot, 'on');

        var resources           = require('resources');
        var frontpage           = require('frontpage');
        var dots                = require('dots');
        var scrollto            = require('scrollto');
        var raf                 = require('raf');
        var section_buttons     = require('section_buttons');

        raf();

        if (document.body.getAttribute('id') !== null) {
            scrollto.enable({
                selector: 'div#menu a'
            },{
                selector: 'img#arrow',
                target:   'section#about'
            },{
                selector: 'a#btn_process',
                target:   'section#process'
            },{
                selector: 'a#btn_partners',
                target:   'section#partners'
            },{
                selector: 'a#btn_process_close',
                target:   'section#about'
            },{
                selector: 'a#btn_partners_close',
                target:   'section#people'
            });
        }

        resources({
            font: [{
                cache_name: 'Comte',
                file:       '/public/css/fonts.css'
            }]
        });

        frontpage();

        dots(isOK());

        var hash = (window.location.href.split('#')[1] || null);
        if (hash !== null) {
            var btn = section_buttons.get(hash);
            if (typeof btn !== 'undefined') {
                section_buttons.expand(btn);
            }
            var el = document.getElementById(hash);
            var t = window.setTimeout(function() {
                window.scrollBy(0, el.getBoundingClientRect().top);
                window.clearTimeout(t);
            }, 100);
        }
    }
};
