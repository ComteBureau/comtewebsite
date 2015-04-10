(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

if (document.readyState === 'complete' ||
    document.readyState === 'interactive') {
    window.setTimeout(_boot, 0);
} else {
    document.addEventListener('DOMContentLoaded', _boot, false);
    window.addEventListener('load', _boot, false);
}

function _boot() {
    if (!document.body) {
        window.setTimeout(_boot, 20);
    } else {
        document.removeEventListener('DOMContentLoaded', _boot);
        window.removeEventListener('load', _boot);

        // var extensions = require('utils/extensions');
        var comte = require('./comte.js');
        comte();
    }
};

},{"./comte.js":2}],2:[function(require,module,exports){
"use strict";

var dom             = require('./dom.js');
var viewport        = require('./viewport.js');
var tab             = require('./tab.js');
var experiment      = require('./experiments/text_attract.js');

module.exports = function comte() {

    var canvas = dom.id('intro');

    experiment.init(canvas);

    tab.visibility(function(is_visible) {
        if (is_visible) {
            experiment.play();
            run();
        } else {
            experiment.pause();
        }

        document.title = is_visible ? 'Active' : 'Paused';
    });

    viewport.visibility(canvas, function(is_visible) {
        if (is_visible) {
            experiment.play();
            run();
        } else {
            experiment.pause();
        }
       // document.body.style.background = is_visible ? '#ccc' : '#f00';
    });

    run();
}

function update() {
    if (experiment.update()) {
        run();
    }
}

function run() {
    window.requestAnimationFrame(update);
}

},{"./dom.js":3,"./experiments/text_attract.js":5,"./tab.js":11,"./viewport.js":15}],3:[function(require,module,exports){
"use strict";

var dom = {
    id: function(id_name) {
        return document.getElementById(id_name);
    }
};

module.exports = dom;

},{}],4:[function(require,module,exports){
"use strict";

module.exports.add = function(element, event_name, callback, prefix) {

    if (typeof element.addEventListener !== 'undefined') {
        return element.addEventListener(event_name, callback, false);
    }

    if (typeof prefix !== 'undefined') {
        event_name = prefix + event_name;
    }

    if (typeof element.attachEvent !== 'undefined') {
        return element.attachEvent(event_name, handler);
    }

    return undefined;
}

},{}],5:[function(require,module,exports){
'use strict';

var sprite          = require('./../sprite.js');
var pixelratio      = require('./../pixelratio.js');
var text            = require('./../text.js');
var particle        = require('./../particle.js');
var spawnpoints     = require('./../spawnpoints.js');
var lookuptables    = require('./../lookuptables.js');

var target_coords = [];
var particles = [];
var dead_particles = [];
var canvas;
var ctx;
var paused = false;
var dead_count = 0;

var canvas_color = '#fff';
var num_spawnpoints = 8;
var num_particles = 1000;

var experiment = {
    init: function(a_canvas) {

        canvas = a_canvas;
        ctx = canvas.getContext('2d');
        canvas.width = document.documentElement.clientWidth;
        canvas.height = canvas.width * 0.5625;
        pixelratio(canvas);

        clear_canvas();

        var circle = sprite.circle({
            width:  2,
            height: 2,
            color:  'rgba(0, 0, 0, 0.2)'
        });

        target_coords = text.create({
            width:          canvas.width,
            height:         canvas.height,
            min_font_size:  12,
            max_font_size:  40,
            font:           'Helvetica',
            text:           'Think people',
            ratio:          pixelratio.ratio,
            debug:          false
        });

        var s_points = spawnpoints.create(canvas.width, canvas.height, num_spawnpoints);
        var particle_i = 0;
        var amount = 0;

        s_points.forEach(function(sp) {
            // ctx.drawImage(circle.canvas,
            //                 (sp.x - (circle.canvas.width / 2)) / pixelratio.ratio,
            //                 (sp.y - (circle.canvas.height / 2)) / pixelratio.ratio);

            amount = num_particles * sp.weight;

            for (var i=0; i<amount; i++) {
                var deg = Math.floor(Math.random() * 360);
                var radius = Math.random() * sp.size * 0.5 * (4 + sp.weight);
                var coord = lookuptables.get_coord(deg, radius);

                // ctx.drawImage(circle.canvas,
                //               (sp.x / pixelratio.ratio) + coord.x,
                //               (sp.y / pixelratio.ratio) + coord.y,
                //               circle.canvas.width,
                //               circle.canvas.height);

                particle_i++;

                // ctx.drawImage(circle.canvas,
                //               target.x,
                //               target.y,
                //               circle.canvas.width,
                //               circle.canvas.height);

                particles.push(particle.create(circle, {
                    target: target_coords[Math.floor(Math.random() * target_coords.length)],
                    pos:    {
                        x:  (sp.x / pixelratio.ratio) + coord.x,
                        y:  (sp.y / pixelratio.ratio) + coord.y
                    }
                }));

            }
        });

    },

    update: function() {
        if (paused) {
            return false;
        }

        clear_canvas();
        dead_count = 0;

        // if (dead_particles.length > 0) {
        //     var dead = dead_particles[0];
        //     for (var d=0; d<particles.length; d++) {
        //         if (particles[d] === dead) {
        //             break;
        //         }
        //     }
        //     particles.splice(d, 1);
        //     dead_particles.splice(0, 1);
        // }

        // if (particles.length === 0) {
        //     paused = true;
        // }

        particles.forEach(function(particle) {
            if (particle.alive) {
                particle.update();
            } else {
                ++dead_count;
                // kill(particle);
            }
            particle.draw(ctx);
        });

        label(dead_count + '/' + particles.length, 10, 20);

        if (dead_count === particles.length) {
            console.log('particles dead');
            paused = true;
        }

        return true;
    },

    pause: function() {
        paused = true;
    },

    play: function() {
        paused = false;
    }
};

function clear_canvas() {
    ctx.fillStyle = canvas_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function label(caption, x, y) {
    ctx.font = '12 px Helvetica';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#000';
    ctx.fillText(caption, x, y);
}

function kill(particle) {
    var exists = false;
    for (var i=0; i<dead_particles.length; i++) {
        if (dead_particles[i] === particle) {
            exists = true;
            break;
        }
    }

    if (!exists) {
        dead_particles.push(particle);
    }
}

module.exports = experiment;


},{"./../lookuptables.js":6,"./../particle.js":7,"./../pixelratio.js":8,"./../spawnpoints.js":9,"./../sprite.js":10,"./../text.js":12}],6:[function(require,module,exports){
'use strict';

var radians = [];
var x_values = [];
var y_values = [];

var rad_per_deg = (Math.PI * 2) / 360;

for (var i=0; i<360; i++) {
    radians.push(rad_per_deg * i);
}

radians.forEach(function(rad) {
    x_values.push(Math.cos(rad));
    y_values.push(Math.sin(rad));
});

module.exports.get_coord = function(deg, radius) {
    deg = parseInt(deg) || 0;
    radius = radius || 1;

    return {
        x: x_values[deg] * radius,
        y: y_values[deg] * radius
    };
}

},{}],7:[function(require,module,exports){
"use strict";

var vector  = require('./vector.js');
var utils   = require('./utils.js');

var tmp = {
    desired: null,
    desired_mag: null,
    steer: null
};

var particle = {

    position: null,
    velocity: null,
    acceleration: null,

    speed:      0,
    max_speed:  Math.round((Math.random() * 50) + 50),
    max_force:  200,
    alive:      true,

    init: function(pos) {
        this.position = vector.create(pos.x, pos.y);
        this.velocity = vector.create();
        this.acceleration = vector.create();
    },

    update: function() {
        if (!this.alive) {
            return;
        }

        this.seek(this.target);
        this.velocity.add(this.acceleration).limit(this.max_speed);
        this.position.add(this.velocity);
        this.acceleration.multiply(0);

        if (tmp.desired_mag <= 10 &&
            this.velocity.magnitude() <= 1) {
            this.position.set(this.target.x, this.target.y);
            this.velocity.set(0, 0);
            this.alive = false;
        }
    },

    applyForce: function(force) {
        this.acceleration.add(force);
    },

    seek: function(target) {
        tmp.desired = vector.subtract(this.target, this.position);
        tmp.desired_mag = tmp.desired.magnitude();

        this.speed = tmp.desired_mag < 100 ?
            utils.map(tmp.desired_mag, 0, 100, 0, this.max_speed) :
            this.max_speed;

        tmp.desired
            .normalize()
            .multiply(this.speed);

        tmp.steer = vector
            .subtract(tmp.desired, this.velocity)
            .limit(this.max_force);

        this.applyForce(tmp.steer);
    },

    draw: function(ctx) {
        ctx.drawImage(this.sprite.canvas, this.position.x, this.position.y);
    }
};

module.exports.create = function create(sprite, options) {
    var instance = Object.create(particle, {
        sprite: {
            writable:   false,
            value:      sprite
        },
        target: {
            value:      options.target
        }
    });

    instance.init(options.pos);
    return instance;
}

},{"./utils.js":13,"./vector.js":14}],8:[function(require,module,exports){
'use strict';

var width;
var height;
var ctx;
var ratio;

var PixelRatio = function(canvas) {

    ctx = canvas.getContext('2d');

    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                            ctx.mozBackingStorePixelRatio ||
                            ctx.msBackingStorePixelRatio ||
                            ctx.oBackingStorePixelRatio ||
                            ctx.backingStorePixelRatio || 1;

    // Pixel ratio is larger than 1 when on a screen with high pixel density
    ratio = devicePixelRatio / backingStoreRatio;

    if (devicePixelRatio !== backingStoreRatio) {

        width = canvas.width;
        height = canvas.height;

        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        // now scale the context to counter
        // the fact that we've manually scaled
        // our canvas element
        ctx.scale(ratio, ratio);
    }
}

module.exports = PixelRatio;

Object.defineProperty(PixelRatio, 'ratio', {
    get: function() {
        return ratio;
    }
});

},{}],9:[function(require,module,exports){
'use strick';

var spawnpoints = [];

var cols = 8;
var rows = 4;

module.exports.create = function(width, height, num_spawnpoints) {
    var col_width = width / cols;
    var row_height = height / rows;
    var x;
    var y;
    var x_offset;
    var y_offset;
    var col_width_offset = col_width * 0.8;
    var row_height_offset = row_height * 0.8;

    for (var i=0; i<(cols * rows); i++) {
        x = i % cols;
        y = Math.floor(i / cols);

        x_offset = (Math.random() * col_width_offset) - (col_width_offset * 0.5);
        y_offset = (Math.random() * row_height_offset) - (row_height_offset * 0.5);

        spawnpoints.push({
            size:   Math.min(col_width_offset, row_height_offset),
            x:      (col_width * x) + x_offset + (col_width / 2),
            y:      (row_height * y) + y_offset + (row_height / 2)
        });
    }

    trim(spawnpoints, num_spawnpoints);
    weight(spawnpoints);

    return spawnpoints;
}

function weight(list) {
    var weights = [];
    var total = 0;
    var r;

    for (var i=0; i<list.length; i++) {
        r = Math.random();
        weights.push(r);
        total += r;
    }

    var scale = 1 / total;

    list.forEach(function(item, n) {
        item.weight = weights[n] * scale;
    });
}

function trim(list, num) {
    var r;

    while (list.length > num) {
        r = Math.floor(Math.random() * list.length);
        list.splice(r, 1);
    }
}

Object.defineProperty(module.exports, 'list', {
    get: function() {
        return spawnpoints;
    }
});

},{}],10:[function(require,module,exports){
'use strict';

var pixelratio      = require('./pixelratio.js');

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

},{"./pixelratio.js":8}],11:[function(require,module,exports){
'use strict';

var eventlistener = require('./eventlistener.js');

var hidden;
var visibilityChange;

module.exports.visibility = function(callback) {

    if (typeof document.hidden !== 'undefined') {
        // Opera 12.10 and Firefox 18 and later support
        hidden = 'hidden';
        visibilityChange = 'visibilitychange';

    } else if (typeof document.mozHidden !== 'undefined') {
        hidden = 'mozHidden';
        visibilityChange = 'mozvisibilitychange';

    } else if (typeof document.msHidden !== 'undefined') {
        hidden = 'msHidden';
        visibilityChange = 'msvisibilitychange';

    } else if (typeof document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden';
        visibilityChange = 'webkitvisibilitychange';
    }

    if (typeof document[hidden] !== 'undefined') {
        eventlistener.add(document, visibilityChange, function() {
            callback(!document[hidden]);
        });
    }
}

},{"./eventlistener.js":4}],12:[function(require,module,exports){
'use strict';

module.exports.create = function(options) {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    if (options.debug) {
        document.body.appendChild(canvas);
    }

    canvas.width = options.width;
    canvas.height = options.height;

    // TODO: Take width into account, too.
    // Make sure there's some padding on the sides
    var font_size = Math.round(canvas.height * 0.3);
    font_size = Math.max(font_size, options.min_font_size);
    font_size = Math.min(font_size, options.max_font_size);

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = font_size + 'px ' + options.font;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText(options.text,
                 canvas.width / (2 * options.ratio),
                 canvas.height / (2 * options.ratio));

    var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var blacks = [];
    var threshold = 8;

    for (var i = 0; i < pixels.data.length; i += 4) {
        if (pixels.data[i] < threshold &&
            pixels.data[i+1] < threshold &&
            pixels.data[i+2] < threshold) {

            blacks.push({
                x: (i / 4) - (Math.floor((i / 4) / canvas.width) * canvas.width),
                y: Math.floor((i / 4) / canvas.width)
            });
        }
    }

    return blacks;
}

},{}],13:[function(require,module,exports){
'use strict';

var Utils = {
    map: function(value, from_min, from_max, to_min, to_max) {
        value = Utils.clamp(value, from_min, from_max);
        var pct = (value - from_min) / (from_max - from_min);
        return (pct * (to_max - to_min)) + to_min;
    },

    clamp: function(value, min, max) {
        min = min || 0;
        max = max || 1;
        return Math.min(Math.max(value, min), max);
    }
};

module.exports = Utils;

},{}],14:[function(require,module,exports){
'use strict';

var Vector = {
    _mag: 0,

    init: function() {},

    set: function(x, y) {
        this.x = x;
        this.y = y;
        return this;
    },

    subtract: function(v) {
        this.x = this.x - v.x;
        this.y = this.y - v.y;
        return this;
    },

    add: function(v) {
        this.x = this.x + v.x;
        this.y = this.y + v.y;
        return this;
    },

    normalize: function() {
        this._mag = this.magnitude();
        if (this._mag !== 0) {
            this.divide(this._mag);
        }
        return this;
    },

    magnitude: function() {
        return this.x * this.x + this.y * this.y;
    },

    divide: function(f) {
        f = parseFloat(f);
        this.x = this.x / f;
        this.y = this.y / f;
        return this;
    },

    multiply: function(f) {
        f = parseFloat(f);
        this.x = this.x * f;
        this.y = this.y * f;
        return this;
    },

    limit: function(f) {
        f = parseFloat(f);
        if (this.magnitude() > f) {
            this.normalize();
            this.multiply(f);
        }
        return this;
    }
};

var Vectors = {
    create: function(x, y) {
        var instance = Object.create(Vector, {
            x: {
                value:      typeof x !== 'number' ? 0 : x,
                writable:   true
            },
            y: {
                value:      typeof y !== 'number' ? 0 : y,
                writable:   true
            }
        });
        instance.init();
        return instance;
    },

    subtract: function(a, b) {
        tmp.a.set(a.x, a.y);
        return tmp.a.subtract(b);
    },

    add: function(a, b) {
        tmp.a.set(a.x, a.y);
        return tmp.a.add(b);
    }
};

var tmp = {
    a: Vectors.create()
};

module.exports = Vectors;

},{}],15:[function(require,module,exports){
"use strict";

var eventlistener = require('./eventlistener.js');

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

},{"./eventlistener.js":4}]},{},[1]);
