"use strict";

var home        = require('./home');
var works       = require('./works');
var Promise     = require('promise');

module.exports = function(app) {
    app.events.on('home', function(req, res, next) {

        Promise.all([
            home(app, res),
            works.latest(app, res)
        ])
        .then(function (results) {

            app.templates.render(res, 'main', 'home');

        }, function() {
            res.send('Home error');
        });


    });
}
