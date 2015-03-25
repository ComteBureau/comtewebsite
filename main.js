var config          = require('./config.json');
var website         = require('prismic-website');

website.on('ready', function(app) {
    app.events.on('home', function(req, res, next) {
        app.templates.render(res, 'main', 'home');
    });
});

website.init(config, {
    base: __dirname
});
