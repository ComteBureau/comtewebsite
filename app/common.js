"use strict";

var color_chars = '#0123456789abcdef';

module.exports.getColor = function(color) {
    return !color ? '' : color.value;
}

module.exports.parseColor = function(color) {
    if (!color) {
        return '#ffffff';
    }

    var chars = color_chars.split('');
    var new_col = color.value
        .toLowerCase()
        .split('')
        .map(function(c) {
            return chars.indexOf(c) > -1 ? c : undefined;
        });

    return new_col.join('').slice(0,7);
}

module.exports.getDate = function(date) {
    return !date ? new Date() : date;
}

module.exports.getText = function(txt) {
    return !txt ? '' : txt;
}
