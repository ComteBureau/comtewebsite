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
