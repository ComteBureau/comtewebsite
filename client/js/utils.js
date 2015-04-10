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
