'use strict';

var eventlistener = require('eventlistener');

var listener_els = [];
var elapsed;
var duration = 1000;
var begin_y;
var end_y;
var start;

var scrollto = {
    enable: function() {
        var args = Array.prototype.slice.call(arguments);
        if (args.length === 0) {
            return;
        }

        eventlistener.add(document.body, 'click', clickElement, 'on');

        args.forEach(function(arg) {
            select(arg.selector).forEach(function(el) {
                var listener_el = {
                    element:    el
                };

                if (typeof arg.target === 'undefined') {
                    // expect element to be an anchor, and look for the hash
                    var url = el.getAttribute('href');
                    var hash_index = url.indexOf('#');
                    if (hash_index > -1) {
                        hash_index++;
                        listener_el.target = document.getElementById(url.substring(hash_index));
                    }
                } else {
                    listener_el.target = select(arg.target, 0);
                }

                listener_els.push(listener_el);
            });
        });
    }
};

function select(selector, index) {
    index = typeof index === 'undefined' ? -1 : index;
    return index > -1 ?
        Array.prototype.slice.call(document.querySelectorAll(selector))[index] :
        Array.prototype.slice.call(document.querySelectorAll(selector));
}

function clickElement(event) {
    var el = find(event.target);
    if (el !== null) {
        if (typeof el.target === 'undefined') {
            return;
        }

        event.preventDefault();
        doScroll(el.target);
    }
}

module.exports = scrollto;

function doScroll(element) {
    begin_y = getScrollTop();
    end_y = element.getBoundingClientRect().top;
    start = (new Date()).getTime();
    run();
}

function update() {
    elapsed = (new Date()).getTime() - start;
    if (elapsed < duration) {
        window.scrollTo(0, easeOutQuad(elapsed,
                                       begin_y,
                                       end_y,
                                       duration));
        run();
    }
}

function easeOutQuad(t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
}

function run() {
    window.requestAnimationFrame(update);
}

function find(element) {
    for (var i=0; i<listener_els.length; i++) {
        if (listener_els[i].element === element) {
            return listener_els[i];
        }
    }
    return null;
}

function getScrollTop() {
    if (typeof pageYOffset!= 'undefined'){
        //most browsers except IE before #9
        return pageYOffset;
    } else {
        var B = document.body; //IE 'quirks'
        var D = document.documentElement; //IE with doctype
        D = (D.clientHeight)? D : B;
        return D.scrollTop;
    }
}
