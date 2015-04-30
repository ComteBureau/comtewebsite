"use strict";

var Promise         = require('promise');
var common          = require('./common');

module.exports.latest = function latest_works(app, res, options) {
    res.content = res.content || {};
    res.content.works = [];

    options = options || {};

    // Change according to the number of tiles in the work list grid
    options.limit = 9;
    options.sort = 'published desc';

    return query(app, res.locals.ctx, options, function(results) {
        res.content.works = results;
        return res.content.works;
    });
}

module.exports.single = function single_work(app, id, res, options) {
    res.content = res.content || {};
    res.content.work = {};

    options = options || {};
    options.id = id;

    return query(app, res.locals.ctx, options, function(results) {
        res.content.work = results[0];
        return res.content.work;
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
        cb(null, get_works(works.results, app));

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
