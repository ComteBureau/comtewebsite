var Handlebars = require('handlebars');

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
