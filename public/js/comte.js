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

        var resources = require('./resources.js');
        var frontpage = require('./frontpage.js');

        resources({
            css: ['/public/css/style.css'],
            font: [{
                cache_name: 'Comte',
                file:       '/public/css/fonts.css'
            }]
        });
        frontpage();

        // var comte = require('comte');
        // comte();
    }
};

},{"./frontpage.js":4,"./resources.js":5}],2:[function(require,module,exports){
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if ("document" in self) {

    // Full polyfill for browsers with no classList support
    if (!("classList" in document.createElement("_"))) {

        (function (view) {

            "use strict";

            if (!('Element' in view)) return;

            var
                  classListProp = "classList"
                , protoProp = "prototype"
                , elemCtrProto = view.Element[protoProp]
                , objCtr = Object
                , strTrim = String[protoProp].trim || function () {
                    return this.replace(/^\s+|\s+$/g, "");
                }
                , arrIndexOf = Array[protoProp].indexOf || function (item) {
                    var
                          i = 0
                        , len = this.length
                    ;
                    for (; i < len; i++) {
                        if (i in this && this[i] === item) {
                            return i;
                        }
                    }
                    return -1;
                }
                // Vendors: please allow content code to instantiate DOMExceptions
                , DOMEx = function (type, message) {
                    this.name = type;
                    this.code = DOMException[type];
                    this.message = message;
                }
                , checkTokenAndGetIndex = function (classList, token) {
                    if (token === "") {
                        throw new DOMEx(
                              "SYNTAX_ERR"
                            , "An invalid or illegal string was specified"
                        );
                    }
                    if (/\s/.test(token)) {
                        throw new DOMEx(
                              "INVALID_CHARACTER_ERR"
                            , "String contains an invalid character"
                        );
                    }
                    return arrIndexOf.call(classList, token);
                }
                , ClassList = function (elem) {
                    var
                          trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
                        , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
                        , i = 0
                        , len = classes.length
                    ;
                    for (; i < len; i++) {
                        this.push(classes[i]);
                    }
                    this._updateClassName = function () {
                        elem.setAttribute("class", this.toString());
                    };
                }
                , classListProto = ClassList[protoProp] = []
                , classListGetter = function () {
                    return new ClassList(this);
                }
            ;

            // Most DOMException implementations don't allow calling DOMException's toString()
            // on non-DOMExceptions. Error's toString() is sufficient here.
            DOMEx[protoProp] = Error[protoProp];

            classListProto.item = function (i) {
                return this[i] || null;
            };

            classListProto.contains = function (token) {
                token += "";
                return checkTokenAndGetIndex(this, token) !== -1;
            };

            classListProto.add = function () {
                var
                      tokens = arguments
                    , i = 0
                    , l = tokens.length
                    , token
                    , updated = false
                ;
                do {
                    token = tokens[i] + "";
                    if (checkTokenAndGetIndex(this, token) === -1) {
                        this.push(token);
                        updated = true;
                    }
                }
                while (++i < l);

                if (updated) {
                    this._updateClassName();
                }
            };

            classListProto.remove = function () {
                var
                      tokens = arguments
                    , i = 0
                    , l = tokens.length
                    , token
                    , updated = false
                    , index
                ;
                do {
                    token = tokens[i] + "";
                    index = checkTokenAndGetIndex(this, token);
                    while (index !== -1) {
                        this.splice(index, 1);
                        updated = true;
                        index = checkTokenAndGetIndex(this, token);
                    }
                }
                while (++i < l);

                if (updated) {
                    this._updateClassName();
                }
            };

            classListProto.toggle = function (token, force) {
                token += "";

                var
                      result = this.contains(token)
                    , method = result ?
                        force !== true && "remove"
                    :
                        force !== false && "add"
                ;

                if (method) {
                    this[method](token);
                }

                if (force === true || force === false) {
                    return force;
                } else {
                    return !result;
                }
            };

            classListProto.toString = function () {
                return this.join(" ");
            };

            if (objCtr.defineProperty) {
                var classListPropDesc = {
                      get: classListGetter
                    , enumerable: true
                    , configurable: true
                };
                try {
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                } catch (ex) { // IE 8 doesn't support enumerable:true
                    if (ex.number === -0x7FF5EC54) {
                        classListPropDesc.enumerable = false;
                        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                    }
                }
            } else if (objCtr[protoProp].__defineGetter__) {
                elemCtrProto.__defineGetter__(classListProp, classListGetter);
            }

        }(self));

    } else {

        // There is full or partial native classList support, so just check if we need
        // to normalize the add/remove and toggle APIs.

        (function () {
            "use strict";

            var testElement = document.createElement("_");

            testElement.classList.add("c1", "c2");

            // Polyfill for IE 10/11 and Firefox <26, where classList.add and
            // classList.remove exist but support only one argument at a time.
            if (!testElement.classList.contains("c2")) {
                var createMethod = function(method) {
                    var original = DOMTokenList.prototype[method];

                    DOMTokenList.prototype[method] = function(token) {
                        var i, len = arguments.length;

                        for (i = 0; i < len; i++) {
                            token = arguments[i];
                            original.call(this, token);
                        }
                    };
                };
                createMethod('add');
                createMethod('remove');
            }

            testElement.classList.toggle("c3", false);

            // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
            // support the second argument.
            if (testElement.classList.contains("c3")) {
                var _toggle = DOMTokenList.prototype.toggle;

                DOMTokenList.prototype.toggle = function(token, force) {
                    if (1 in arguments && !this.contains(token) === !force) {
                        return force;
                    } else {
                        return _toggle.call(this, token);
                    }
                };

            }

            testElement = null;
        }());

    }

}

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

var classlist           = require('./classlist.js');
var dataset             = require('dataset');
var section_buttons     = require('./section_buttons.js');
var eventlistener       = require('./eventlistener.js');

var elements_list = [
    'menu',
    'menu_symbol',
    'menu_symbol_shape',
    'menu_symbol_hover',
    'menu_symbol_cross'
];

var elements = {
    els: {},

    init: function(list) {
        list.forEach(function(el_id) {
            this.els[el_id] = document.getElementById(el_id) || undefined;
        }, this);
    },

    get: function(id) {
        return this.els[id];
    }
};

var menu_symbol = {
    // Due to click() toggling active on and off, set the active to false
    // in order to default to true.
    active:     true,

    is_over:    false,

    _shape:     undefined,
    _menu:      undefined,
    _cross:     undefined,

    init: function(elements, listener) {
        this._cross = elements.get('menu_symbol_cross');
        this._menu = elements.get('menu');
        this._shape = elements.get('menu_symbol_shape');

        listener.add(elements.get('menu_symbol'),
                     'click',
                     this.click.bind(this));

        listener.add(elements.get('menu_symbol'),
                     'mouseover',
                     this.over.bind(this),
                     'on');
        listener.add(elements.get('menu_symbol'),
                     'mouseout',
                     this.out.bind(this),
                     'on');

        this.click.call(this);
    },

    click: function(event) {
        this.active = !this.active;
        if (this.active) {
            if (!this.is_over) {
                this._shape.classList.add('menu_symbol_active');
                this.out();
            } else {
                this.over();
            }
            this._shape.classList.remove('menu_symbol_deactive');
            this._menu.classList.add('opened');
            this._cross.classList.add('visible');
        } else {
            this._shape.classList.remove('menu_symbol_active');
            if (!this.is_over) {
                this._shape.classList.add('menu_symbol_deactive');
                this.out();
            } else {
                this.over();
            }
            this._menu.classList.remove('opened');
            this._cross.classList.remove('visible');
        }
    },

    over: function(event) {
        this.is_over = true;
        this._shape.classList.add('menu_symbol_'+(this.active ? 'active' : 'deactive')+'_hover');
        this._shape.classList.remove('menu_symbol_'+(!this.active ? 'active' : 'deactive')+'_hover');
        this._shape.classList.remove(this.active ? 'menu_symbol_active' : 'menu_symbol_deactive');
    },

    out: function(event) {
        this.is_over = false;
        this._shape.classList.remove('menu_symbol_active_hover');
        this._shape.classList.remove('menu_symbol_deactive_hover');
        this._shape.classList.add(this.active ? 'menu_symbol_active' : 'menu_symbol_deactive');
    }
};

var menu_options = {
    options:        {},

    _section_btns:  undefined,

    init: function(parent, listener, section_btns) {
        this._section_btns = section_buttons;

        listener.add(parent, 'click', this.click.bind(this));

        var a;
        for (var i=0; i<parent.children.length; i++) {
            a = parent.children[i].children[0];
            this.options[a.name] = dataset(a, 'expand');
        }
    },

    click: function(event) {
        var expand_name = this.options[event.target.name];
        if (typeof expand_name === 'string') {
            var btn = section_buttons.states[expand_name];
            section_buttons.expand(btn);
        }
    }
};

module.exports = function() {
    elements.init(elements_list);
    if (typeof elements.get('menu') === 'undefined') {
        return;
    }

    section_buttons.init(['process', 'partners']);
    menu();
}

function menu() {
    elements.get('menu_symbol').classList.remove('hidden');

    menu_symbol.init(elements, eventlistener);

    eventlistener.add(elements.get('menu'), 'click', function(event) {
        menu_symbol.click();
    });

    menu_options.init(elements.get('menu').children[0],
                      eventlistener,
                      section_buttons);
}

},{"./classlist.js":2,"./eventlistener.js":3,"./section_buttons.js":6,"dataset":7}],5:[function(require,module,exports){
'use strict';

module.exports = function(res) {
    if (typeof res === 'undefined') {
        return;
    }

    if (Array.isArray(res.css)) {
        res.css.forEach(function(stylesheet) {
            load_css(stylesheet);
        });
    }

    if (Array.isArray(res.font)) {
        res.font.forEach(function(font) {
            if (!font.file) {
                return;
            }
            font.cache_name = font.cache_name || 'NoName';
            load_font(font.cache_name, font.file);
        });
    }
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

},{}],6:[function(require,module,exports){
'use strict';

var eventlistener = require('./eventlistener.js');

var __btn_states = {};

var section_buttons = {
    init: function(sections) {
        sections.forEach(function(section) {
            btn(section);
        });
    },

    expand: function(btn) {
        if (typeof btn === 'undefined') {
            return;
        }

        window.setTimeout(function() {
            btn.el_wrap.classList.add('expanded');
            btn.el_wrap.classList.remove('contracted');
        }, 100);
        btn.el_section.classList.add('show');
        btn.el_section.classList.remove('hide');
    },

    contract: function(btn) {
        btn.el_wrap.classList.add('contracted');
        btn.el_wrap.classList.remove('expanded');
        btn.el_section.classList.add('hide');
        btn.el_section.classList.remove('show');
    },
};

module.exports = section_buttons;

function btn_exists(el_id) {
    return (
        typeof document.getElementById(el_id) !== 'undefined' &&
        typeof document.getElementById('btn_'+el_id) !== 'undefined'
    );
}

function btn(btn_name) {
    if (!btn_exists(btn_name)) {
        return;
    }

    if (typeof __btn_states[btn_name] !== 'undefined') {
        return;
    }

    var btn = __btn_states[btn_name] = {};

    btn.el_section = document.getElementById(btn_name);
    btn.el_wrap = btn.el_section.children[0];
    btn.el_btn = document.getElementById('btn_'+btn_name);
    btn.expanded = false;

    section_buttons.contract(btn);

    eventlistener.add(btn.el_btn, 'click', function(event) {
        event.preventDefault();

        // Due to the use of bind(), 'this' is set to the name of
        // the button.
        var btn = __btn_states[this];
        btn.expanded = !btn.expanded;
        section_buttons[btn.expanded ? 'expand' : 'contract'](btn);

    }.bind(btn_name), false);
}

Object.defineProperty(section_buttons, 'states', {
    get: function() {
        return __btn_states;
    }
});

},{"./eventlistener.js":3}],7:[function(require,module,exports){
module.exports=dataset;

/*global document*/


// replace namesLikeThis with names-like-this
function toDashed(name) {
  return name.replace(/([A-Z])/g, function(u) {
    return "-" + u.toLowerCase();
  });
}

var fn;

if (typeof document !== "undefined" && document.head && document.head.dataset) {
  fn = {
    set: function(node, attr, value) {
      node.dataset[attr] = value;
    },
    get: function(node, attr) {
      return node.dataset[attr];
    },
    del: function (node, attr) {
      delete node.dataset[attr];
    }
  };
} else {
  fn = {
    set: function(node, attr, value) {
      node.setAttribute('data-' + toDashed(attr), value);
    },
    get: function(node, attr) {
      return node.getAttribute('data-' + toDashed(attr));
    },
    del: function (node, attr) {
      node.removeAttribute('data-' + toDashed(attr));
    }
  };
}

function dataset(node, attr, value) {
  var self = {
    set: set,
    get: get,
    del: del
  };

  function set(attr, value) {
    fn.set(node, attr, value);
    return self;
  }

  function del(attr) {
    fn.del(node, attr);
    return self;
  }

  function get(attr) {
    return fn.get(node, attr);
  }

  if (arguments.length === 3) {
    return set(attr, value);
  }
  if (arguments.length == 2) {
    return get(attr);
  }

  return self;
}

},{}]},{},[1]);
