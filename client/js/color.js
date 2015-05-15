'use strict';

var colors = [
    'ed4141',
    'd9a86e',
    '8bd1ca',
    '5f99b3',
    'f5c9eb'
];

var color_funcs = {
    palette: function(i) {
        i = i || Math.floor(Math.random() * colors.length);
        return '0x' + colors[i];
    },

    random: function() {
        return '0x' + Math.floor(Math.random()*16777215).toString(16);
    },
};

module.exports = color_funcs;
