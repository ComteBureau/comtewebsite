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

module.exports.imagestyle = function(name, photo) {
    var style = "<style type='text/css'>"+

        "#section_"+name+" {"+
            "background-image: url("+photo.main+");"+
        "}"+

        "@media only screen and (max-width: 1440px) {"+
            "#section_"+name+" {"+
                "background-image: url("+photo.large+");"+
            "}"+
        "}"+

        "@media only screen and (max-width: 720px) {"+
            "#section_"+name+" {"+
                "background-image: url("+photo.medium+");"+
            "}"+
        "}"+

        "@media only screen and (max-width: 375px) {"+
            "#section_"+name+" {"+
                "background-image: url("+photo.small+");"+
            "}"+
        "}"+

    "</style>";
    return new Handlebars.SafeString(style);
}
