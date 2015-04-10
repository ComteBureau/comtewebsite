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
