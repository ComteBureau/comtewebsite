var Handlebars = require('handlebars');

module.exports.lowercase = function(context, options) {
    return new Handlebars.SafeString(context.toLowerCase());
}

module.exports.imagestyle = function(name, el, photo) {
    var style = "<style type='text/css'>"+

        el+"#"+name+" {"+
            "background-image: url("+photo.main+");"+
            "background-position: 50% 50%;"+
            "background-size: cover;"+
        "}"+

        "@media only screen and (max-width: 1440px) {"+
            el+"#"+name+" {"+
                "background-image: url("+photo.large+");"+
                "background-position: 50% 50%;"+
                "background-size: cover;"+
            "}"+
        "}"+

        "@media only screen and (max-width: 720px) {"+
            el+"#"+name+" {"+
                "background-image: url("+photo.medium+");"+
                "background-position: 50% 50%;"+
                "background-size: cover;"+
            "}"+
        "}"+

        "@media only screen and (max-width: 375px) {"+
            el+"#"+name+" {"+
                "background-image: url("+photo.small+");"+
                "background-position: 50% 50%;"+
                "background-size: cover;"+
            "}"+
        "}"+

    "</style>";
    return new Handlebars.SafeString(style);
}

// Iterates a list of works and outputs rows of works where each row
// has an increasing number of works. Max number of works on a row is 4.

// If you start with one column, you'll end up with a grid like this:
// _____________
// |___________|
// |_____|_____|
// |___|___|___|
// |__|__|__|__|

// If you start with two columns, you'll end up with:
// _____________
// |_____|_____|
// |___|___|___|
// |__|__|__|__|

module.exports.workslist = function(works, options) {
    // Set number of columns to start with
    var cols = 2;
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
        data.weight = 1 / cols;
        data.description = items.length === 1 ? 'full' :
                           items.length === 2 ? 'half' :
                           items.length === 3 ? 'third' :
                           items.length === 4 ? 'fourth' :
                           'none';

        output += options.fn({row: items}, {data: data});

        // Cap number of columns
        cols = Math.min(parseInt(cols + 1), max_cols);
    }

    return new Handlebars.SafeString(output);
}
