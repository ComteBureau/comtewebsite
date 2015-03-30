var Handlebars = require('handlebars');

module.exports.color = function(context, options) {
    var colors = {
        'Green':    '#00ff00',
        'Blue':     '#0000ff',
        'Orange':   '#ff9900',
        'Teal':     '#008080',
        'Salmon':   '#fa8072',
        'Gray':     '#cccccc',
        'White':    '#ffffff'
    };

    var col = colors[context];
    if (typeof col === 'undefined') {
        col = colors.White;
    }

    return new Handlebars.SafeString(col);
}
