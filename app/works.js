"use strict";

var Promise         = require('promise');
var common          = require('./common');

module.exports.latest = function latest_works(app, res, options) {
    res.content = res.content || {};
    res.content.works = [];
    res.content.clients = [];

    return Promise.all([
        query(app, res.locals.ctx, {
            type:   'work',
            // Change according to the number of tiles in the work list grid
            // limit:  9,
            sort:   'work.published desc'
        }),
        query(app, res.locals.ctx, {
            type: 'client'
        })
    ])
    .then(function (results) {
        res.content.works = get_works(results[0], app);
        res.content.clients = get_clients(results[1], app);
        return res.content;
    }, function() {
        return false;
    });
}

module.exports.single = function single_work(app, id, res, options) {
    res.content = res.content || {};
    res.content.work = {};
    res.content.clients = [];

    options = options || {};
    options.id = id;

    return query(app, res.locals.ctx, options)
        .then(function (results) {

            res.content.work = get_works(results, app)[0];
            return res.content;

        }, function() {
            return false;
        });
}

function query(app, ctx, options, success) {
    return new Promise(function (resolve, reject) {
        get(app, ctx, options,
            function(err, results) {
                if (err) {
                    return reject(err);
                }

                if (typeof success === 'undefined') {
                    resolve(results);
                } else {
                    resolve(success(results));
                }
            });
    });
}

function get(app, ctx, options, cb) {
    options = options || {};
    options.limit = options.limit || undefined;
    options.sort = options.sort ?
                   '[my.'+options.sort+']' :
                   undefined;

    app.query(ctx, options)
    .then(function(content) {
        cb(null, content.results);
    }, function(reason) {
        cb(reason);
    });
};

function get_works(list, app) {
    return list
        .filter(function(obj) {
            return obj.type === 'work';
        })
        .map(function(work, i) {
            return {
                i:                  i,
                id:                 work.id,
                link:               app.linkresolver.document('work', work),
                date:               work.getDate('work.published'),
                title:              work.getText('work.title'),
                subtitle:           work.getText('work.subtitle'),
                description:        work.getStructuredText('work.description'),
                excerpt:            work.getStructuredText('work.description').getFirstParagraph().text,
                logo:               app.utils.getImage(work.get('work.logo')),
                client_name:        work.getText('work.client_name'),
                main_photo:         app.utils.getImage(work.get('work.main_photo')),
                background_color:   common.parseColor(work.get('work.background_color')),
                foreground_color:   common.parseColor(work.get('work.foreground_color')),

                photos:             app.utils.iterateGroup({
                    document:   work,
                    path:       'work.photos'
                }, function(photo, i) {
                    return {
                        photo:      app.utils.getImage(photo.get('photo'))
                    }
                })
            };
        });
}

function get_clients(list, app) {
    var unique = [];
    var name;
    var logo;

    list
        .filter(function(obj) {
            return obj.type === 'client';
        })
        .forEach(function(work) {
            name = work.getText('client.name');
            if (!exists(unique, name)) {
                logo = app.utils.getImage(work.get('client.logo'));
                if (!logo) {
                    return;
                }

                unique.push({
                    name: name,
                    logo: logo
                });
            }
        });

    return unique;
}

function exists(list, name) {
    var does_exists = false;
    list.forEach(function(entry) {
        if (entry.name === name) {
            does_exists = true;
        }
    });
    return does_exists;
}
