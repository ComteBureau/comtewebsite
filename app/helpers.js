var Handlebars = require('handlebars');

module.exports.color = function(context, options) {
    var colors = {
        'Green':    '#6CE0A2',
        'Blue':     '#82CDFF',
        'Orange':   '#FFE494',
        'Teal':     '#64D8DE',
        'Salmon':   '#fa8072',
        'Gray':     '#cccccc',
        'White':    '#ffffff'
    };

    var col;
    if (typeof context === 'undefined' ||
        typeof colors[context] === 'undefined') {
        col = colors.White;
    } else {
        col = colors[context];
    }

    return new Handlebars.SafeString(col);
}

module.exports.lowercase = function(context, options) {
    return new Handlebars.SafeString(context.toLowerCase());
}
