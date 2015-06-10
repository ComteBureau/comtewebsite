'use strict';

var eventlistener       = require('eventlistener');
var classList           = require('dom-classlist');

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
            classList(btn.el_wrap).add('expanded');
            classList(btn.el_wrap).remove('contracted');
        }, 100);
        classList(btn.el_section).add('show');
        classList(btn.el_section).remove('hide');
    },

    contract: function(btn) {
        classList(btn.el_wrap).add('contracted');
        classList(btn.el_wrap).remove('expanded');
        classList(btn.el_section).add('hide');
        classList(btn.el_section).remove('show');
    },

    states: function(name) {
        return typeof name === 'undefined' ? __btn_states : __btn_states[name];
    },

    get: function(section) {
        return __btn_states[section];
    }
};

module.exports = section_buttons;

function btn_exists(el_id) {
    return (
        document.getElementById(el_id) !== null &&
        document.getElementById('btn_'+el_id) !== null
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
