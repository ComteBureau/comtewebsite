'use strict';

var palette = [
    '#333333',
    '#666666',
    '#999999',
    '#bbbbbb',
    '#eeeeee'
];

var color = {
    palette: function(i) {
        i = i || Math.floor(Math.random() * palette.length);
        return '0x' + palette[i].substring(1);
    },

    random: function() {
        return '0x' + Math.floor(Math.random()*16777215).toString(16);
    },
};

module.exports = color;

if (window.comte) {
    if (window.comte.palette) {
        palette = window.comte.palette;
    }
}
