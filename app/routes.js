"use strict";

var home        = require('./home');
var Promise     = require('promise');

module.exports = function(app) {
    app.events.on('home', function(req, res, next) {

        Promise.all([
            home(app, res)
        ])
        .then(function (results) {

            app.templates.render(res, 'main', 'home');

        }, function() {
            res.send('Home error');
        });


    });
}
