var routes          = require('./app/routes.js');
var helpers         = require('./app/helpers.js');
var config          = require('./config.json');
var website         = require('prismic-website');

website.on('ready', function(app) {
    routes(app);
});

website.init(config, {
    base:       __dirname,
    helpers:    helpers
});
