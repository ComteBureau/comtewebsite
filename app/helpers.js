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

    // <ul>
    //     <li>
    //         <div>Num: {{i}}</div>
    //         <div>ID: {{id}}</div>
    //         <a href="{{link}}">{{link}}</a>
    //         <div>Date: {{date}}</div>
    //         <h1>{{title}}</h1>
    //         {{ashtml description}}
    //         <img src="{{logo.small}}">
    //         <img src="{{main_photo.small}}">
    //         {{#if links}}
    //         <ul>
    //             {{#each links}}
    //             <li><a href="{{link}}">{{link}}</a></li>
    //             {{/each}}
    //         </ul>
    //         {{/if}}
    //         {{#if photos}}
    //         <ul>
    //             {{#each photos}}
    //             <li><img src="{{photo.small}}"></li>
    //             {{/each}}
    //         </ul>
    //         {{/if}}
    //     </li>
    // </ul>

// Iterates a list of works and outputs rows of works where each row
// has an increasing number of works. Max number of works on a row is 4.

// This works for now, but the function should rather return an array of
// row object containing the works for each row. That way we can create
// a more clear separation of functionality and style. Style/markup
// goes in html, and the helper structures the data.
module.exports.workslist = function(works) {
    var cols = 1;
    var output = '';
    var max_cols = 4;

    // Make sure works array is never greater than 10 entities
    works = works.slice(0, 10);

    // Keep going as long as there are works to sample
    while (works.length > 0) {
        // Extract as many works as there are columns on the current row
        var items = works.splice(0, cols);

        output += "<ul>";
        items.forEach(function(item) {
            // Calculate the percentage width using the number of items
            // on the row
            output +=
                "<li style='width: " + (100 / items.length) + "%;'>" +
                "<a href='" + item.link + "'>" +
                "<img src='" + item.main_photo.small + "'>" +
                "</a>" +
                "</li>";
        });
        output += "</ul>";

        // Cap number of columns
        cols = Math.min(parseInt(cols + 1), max_cols);
    }

    return new Handlebars.SafeString(output);
}
