'use strict';

function boot() {
    if (!document.body) {
        window.setTimeout(boot, 20);
    } else {
        document.removeEventListener('DOMContentLoaded', boot);
        window.removeEventListener('load', boot);

        load_css('/public/css/style.css');
        load_font('Comte', '/public/css/fonts.css');
    }
}

function ready(state) {
    return document.readyState === state;
}

function load_css(path) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = path;
    var h = document.getElementsByTagName('head')[0];
    h.appendChild(l);
}

function add_font(font_name) {
    var style = document.createElement('style');
    style.rel = 'stylesheet';
    var h = document.getElementsByTagName('head')[0];
    h.appendChild(style);
    style.textContent = localStorage[font_name];
}

function load_font(font_name, path) {
    try {
        if (localStorage[font_name]) {
            add_font(font_name);
        } else {
            var request = new XMLHttpRequest();
            request.open('GET', path, true);

            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    localStorage[font_name] = request.responseText;
                    add_font(font_name);
                }
            }

            request.send();
        }
    } catch(ex) {
        // maybe load the font synchronously for woff-capable browsers
        // to avoid blinking on every request when localStorage is not available
    }
}

if (ready('complete') || ready('interactive')) {
    window.setTimeout(boot, 0);
} else {
    document.addEventListener('DOMContentLoaded', boot, false);
    window.addEventListener('load', boot, false);
}
