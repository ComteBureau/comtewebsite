"use strict";

var home        = require('./home');
var works       = require('./works');
var Promise     = require('promise');

module.exports = function(app) {
    app.events.on('home', function(req, res, next) {

        // app.templates.render(res, 'main', 'dots');

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

    app.events.on('work', function(req, res, next) {

        Promise.all([
            home(app, res),
            works.single(app, req.params.id, res)
        ])
        .then(function (results) {

            app.templates.render(res, 'main', 'work');

        }, function() {
            res.send('Work error');
        });

    });

    app.events.on('survey', function(req, res, next) {
        res.content = res.content || {};
        res.content.sid = req.params.sid;
        res.content.token = req.params.token;

        app.templates.render(res, 'survey', 'survey');
    });
}
