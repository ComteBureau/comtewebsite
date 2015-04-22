var Handlebars = require('handlebars');

module.exports.lowercase = function(context, options) {
    return new Handlebars.SafeString(context.toLowerCase());
}

module.exports.imagestyle = function(name, photo) {
    var style = "<style type='text/css'>"+

        "#"+name+" {"+
            "background-image: url("+photo.main+");"+
        "}"+

        "@media only screen and (max-width: 1440px) {"+
            "#"+name+" {"+
                "background-image: url("+photo.large+");"+
            "}"+
        "}"+

        "@media only screen and (max-width: 720px) {"+
            "#"+name+" {"+
                "background-image: url("+photo.medium+");"+
            "}"+
        "}"+

        "@media only screen and (max-width: 375px) {"+
            "#"+name+" {"+
                "background-image: url("+photo.small+");"+
            "}"+
        "}"+

    "</style>";
    return new Handlebars.SafeString(style);
}

// Iterates a list of works and outputs rows of works where each row
// has an increasing number of works. Max number of works on a row is 4.
module.exports.workslist = function(works, options) {
    var cols = 1;
    var output = '';
    var max_cols = 4;

    // Make sure works array is never greater than 10 entities
    works = works.slice(0, 10);

    // Keep going as long as there are works to sample
    while (works.length > 0) {
        // Extract as many works as there are columns on the current row
        var items = works.splice(0, cols);
        var data = Handlebars.createFrame(options.data || {});
        data.width = 100 / items.length;

        output += options.fn({row: items}, {data: data});

        // Cap number of columns
        cols = Math.min(parseInt(cols + 1), max_cols);
    }

    return new Handlebars.SafeString(output);
}
