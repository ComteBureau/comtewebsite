'use strict';

var eventlistener = require('eventlistener');

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
