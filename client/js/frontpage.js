'use strict';

var classList           = require('dom-classlist');
var dataset             = require('dataset');
var section_buttons     = require('section_buttons');
var eventlistener       = require('eventlistener');

var elements_list = [
    'menu',
    'menu_symbol',
    'menu_symbol_shape'
    // 'menu_symbol_cross'
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
    // _cross:     undefined,

    init: function(elements, listener) {
        // this._cross = elements.get('menu_symbol_cross');
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
                classList(this._shape).add('menu_symbol_active');
                this.out();
            } else {
                this.over();
            }
            classList(this._shape).remove('menu_symbol_deactive');
            classList(this._menu).add('opened');
            // classList(this._cross).add('visible');
        } else {
            classList(this._shape).remove('menu_symbol_active');
            if (!this.is_over) {
                classList(this._shape).add('menu_symbol_deactive');
                this.out();
            } else {
                this.over();
            }
            classList(this._menu).remove('opened');
            classList(this._shape).remove('visible');
        }
    },

    over: function(event) {
        this.is_over = true;
        classList(this._shape).add('menu_symbol_'+(this.active ? 'active' : 'deactive')+'_hover');
        classList(this._shape).remove('menu_symbol_'+(!this.active ? 'active' : 'deactive')+'_hover');
        classList(this._shape).remove(this.active ? 'menu_symbol_active' : 'menu_symbol_deactive');
    },

    out: function(event) {
        this.is_over = false;
        classList(this._shape).remove('menu_symbol_active_hover');
        classList(this._shape).remove('menu_symbol_deactive_hover');
        classList(this._shape).add(this.active ? 'menu_symbol_active' : 'menu_symbol_deactive');
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
            var btn = section_buttons.states(expand_name);
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

    close_buttons({
        btn: 'btn_process_close',
        section: 'process'
    },{
        btn: 'btn_partners_close',
        section: 'partners'
    });

    menu();
}

function menu() {
    classList(elements.get('menu_symbol')).remove('hidden');

    menu_symbol.init(elements, eventlistener);

    eventlistener.add(elements.get('menu'), 'click', function(event) {
        menu_symbol.click();
    });

    menu_options.init(elements.get('menu').children[0],
                      eventlistener,
                      section_buttons);
}

function close_buttons() {
    var args = Array.prototype.slice.call(arguments);
    if (args.length === 0) {
        return;
    }

    // Messy stuff! Should rewrite the section buttons module
    args.forEach(function(close) {
        var close_btn = document.getElementById(close.btn);
        if (close_btn) {
            eventlistener.add(close_btn, 'click', function(event) {
                event.preventDefault();
                var btn = section_buttons.get(close.section);
                btn.expanded = false;
                var section = document.getElementById(close.section);
                classList(section).remove('show');
                classList(section).add('hide');
            });
        }
    });
}
