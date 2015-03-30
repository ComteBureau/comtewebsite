"use strict";

var dom = require('dom');
var particle = require('particle');

var particles = [];
var canvas;
var c_ctx;
    var canvas_color = '#fff';

module.exports = function comte() {

var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.mozHidden !== "undefined") {
  hidden = "mozHidden";
  visibilityChange = "mozvisibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

function handleVisibilityChange() {
  if (document[hidden]) {
    // videoElement.pause();
    document.title = 'paused';
  } else {
    // videoElement.play();
    document.title = 'active';
  }
}

if (typeof document.addEventListener !== "undefined") {
  if (typeof document[hidden] !== "undefined") {
      // Handle page visibility change
    document.addEventListener(visibilityChange, handleVisibilityChange, false);

    // Revert to the existing favicon for the site when the page is closed;
    // otherwise the favicon remains paused.png
      window.addEventListener("unload", function(){
        favicon.change("/public/favicon.ico");
      }, false);
    }
}


function isElementInViewport (el) {

    var rect = el.getBoundingClientRect();

    var dh = (window.innerHeight || document.documentElement.clientHeight);

    if (rect.top >= 0 && rect.top <= dh) {
        // below top
        // console.log('visible');
        return true;
    } else {
        if (rect.bottom <= dh && rect.bottom >= 0) {
            // above bottom
            // console.log('visible');
            return true;
        }
    }
    // console.log('invisible');
    return false;
}

function onVisibilityChange (el, callback) {
    return function () {
        callback(isElementInViewport(el));
        // console.log('visibility ' + isElementInViewport(el));
    }
}

var handler = onVisibilityChange(dom.id('intro'), function(visible) {
    document.body.style.background = visible ? '#ccc' : '#f00';
});

if (window.addEventListener) {
    addEventListener('DOMContentLoaded', handler, false);
    addEventListener('load', handler, false);
    addEventListener('scroll', handler, false);
    addEventListener('resize', handler, false);
} else if (window.attachEvent)  {
    attachEvent('onDOMContentLoaded', handler); // IE9+ :(
    attachEvent('onload', handler);
    attachEvent('onscroll', handler);
    attachEvent('onresize', handler);
}

// -----------------------------------

    var buffer = document.createElement('canvas');
    var circle = document.createElement('canvas');

    // TODO: create circle in a module that particle can use. Get circle via
    // sprite.get('circle'), or something
    circle.width = 2;
    circle.height = 2;
    var circle_ctx = circle.getContext('2d');

    circle_ctx.fillStyle = '#000';
    circle_ctx.arc(1, 1, circle.width / 2, 0, Math.PI * 2);
    circle_ctx.fill();


    canvas = dom.id('intro');

    var ctx = buffer.getContext('2d');
    var c = buffer;
    c_ctx = canvas.getContext('2d');

    // var ar = document.documentElement.clientWidth /
    //          document.documentElement.clientHeight;
    //          console.log(ar, document.documentElement.clientWidth, document.documentElement.clientHeight);
    //          console.log(canvas.clientWidth);

    // console.log(document.documentElement.clientWidth);
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientWidth * 0.5625;
    // canvas.width = 50;
    // canvas.height = 50;
    // console.log(canvas.clientWidth, canvas.clientHeight);

    // finally query the various pixel ratios
    var devicePixelRatio = window.devicePixelRatio || 1,
        backingStoreRatio = c_ctx.webkitBackingStorePixelRatio ||
                            c_ctx.mozBackingStorePixelRatio ||
                            c_ctx.msBackingStorePixelRatio ||
                            c_ctx.oBackingStorePixelRatio ||
                            c_ctx.backingStorePixelRatio || 1,

        ratio = devicePixelRatio / backingStoreRatio;

    // upscale the canvas if the two ratios don't match
    if (devicePixelRatio !== backingStoreRatio) {

        var oldWidth = canvas.width;
        var oldHeight = canvas.height;

        canvas.width = oldWidth * ratio;
        canvas.height = oldHeight * ratio;

        canvas.style.width = oldWidth + 'px';
        canvas.style.height = oldHeight + 'px';

        // now scale the context to counter
        // the fact that we've manually scaled
        // our canvas element
        c_ctx.scale(ratio, ratio);

    }

    if (ratio > 1) {
        canvas_color = '#0f0';
    } else {
        canvas_color = '#00f';
    }

    // buffer.width = 50;
    // buffer.height = 50;
    buffer.width = canvas.width;
    buffer.height = canvas.height;


    // TODO: Take width into account, too. Make sure there's some padding on the sides
    var font_size = Math.round(c.height * 0.3);
    if (font_size < 12) {
        font_size = 12;
    }
    if (font_size > 40) {
        font_size = 40;
    }

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, c.width, c.height);

    clear_canvas();

    ctx.font = font_size + 'px Helvetica';
    console.log(ctx.font);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText('Think people', c.width / (2 * ratio), c.height / (2 * ratio));

    var pixels = ctx.getImageData(0, 0, c.width, c.height);
    var blacks = [];
    var threshold = 8;

    for (var i = 0; i < pixels.data.length; i += 4) {
        if (pixels.data[i] < threshold &&
            pixels.data[i+1] < threshold &&
            pixels.data[i+2] < threshold) {

            // blacks.push({
            //     r: pixels.data[i],
            //     g: pixels.data[i+1],
            //     b: pixels.data[i+2]
            // });
            blacks.push({
                x: (i / 4) - (Math.floor((i / 4) / c.width) * c.width),
                y: Math.floor((i / 4) / c.width)
            });
        }
    }

    console.log(blacks.length);

    blacks.forEach(function(coord) {
        // TODO: pick a start position and pass to constructor
        particles.push(particle.create(circle, coord.x, coord.y));
    });

    window.requestAnimationFrame(update);
}

function update() {
    clear_canvas();

    particles.forEach(function(particle) {
        particle.update();
        particle.draw(c_ctx);
    });

    window.requestAnimationFrame(update);
}

function clear_canvas() {
    c_ctx.fillStyle = canvas_color;
    c_ctx.fillRect(0, 0, canvas.width, canvas.height);
}
