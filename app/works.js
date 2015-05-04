"use strict";

var Promise         = require('promise');
var common          = require('./common');

module.exports.latest = function latest_works(app, res, options) {
    res.content = res.content || {};
    res.content.works = [];
    res.content.clients = [];

    options = options || {};

    // Change according to the number of tiles in the work list grid
    options.limit = 9;
    options.sort = 'published desc';

    return query(app, res.locals.ctx, options, function(results) {
        res.content.works = results.works;
        res.content.clients = results.clients;
        return res.content;
    });
}

module.exports.single = function single_work(app, id, res, options) {
    res.content = res.content || {};
    res.content.work = {};
    res.content.clients = [];

    options = options || {};
    options.id = id;

    return query(app, res.locals.ctx, options, function(results) {
        res.content.work = results.works[0];
        res.content.clients = results.clients;
        return res.content;
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
    if (!options.id) {
        options.type = 'work';
    }
    options.limit = options.limit || undefined;
    options.sort = options.sort ?
                   '[my.work.'+options.sort+']' :
                   undefined;

    app.query(ctx, options)
    .then(function(works) {
        cb(null, {
            works:      get_works(works.results, app),
            clients:    get_clients(works.results, app)
        });

    }, function(reason) {
        cb(reason);
    });
};

function get_works(list, app) {
    return list.map(function(work, i) {
        return {
            i:                  i,
            id:                 work.id,
            link:               app.linkresolver.document('work', work),
            date:               work.getDate('work.published'),
            title:              work.getText('work.title'),
            description:        work.getStructuredText('work.description'),
            logo:               app.utils.getImage(work.get('work.logo')),
            client_name:        work.getText('work.client_name'),
            main_photo:         app.utils.getImage(work.get('work.main_photo')),
            background_color:   common.getColor(work.get('work.background_color')),

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

    list.forEach(function(work) {
        name = work.getText('work.client_name');
        if (!exists(unique, name)) {
            unique.push({
                name: name,
                logo: app.utils.getImage(work.get('work.logo'))
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
