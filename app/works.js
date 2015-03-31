"use strict";

var Promise         = require('promise');
var common          = require('./common');

module.exports.latest = function latest_works(app, res, options) {
    res.content = res.content || {};
    res.content.works = [];

    options = options || {};
    options.limit = 10;
    options.sort = 'published desc';

    return new Promise(function (resolve, reject) {
        get(app, res, options, resolve, reject);
    });
}

function get(app, res, options, resolve, reject) {
    options = options || {};
    if (!options.id) {
        options.type = 'work';
    }
    options.limit = options.limit || undefined;
    options.sort = options.sort ?
                   '[my.work.'+options.sort+']' :
                   undefined;

    app.query(res.locals.ctx, options)
    .then(function(works) {

        get_works(works.results, res.content.works, app);
        resolve(res.content.works);

    }, function(reason) {
        reject(reason);
    });
};

function get_works(list, content, app) {
    list.forEach(function(work, i) {

        content.push({
            i:                  i,
            id:                 work.id,
            link:               app.linkresolver.document('work', work),
            date:               work.getDate('work.published'),
            title:              work.getText('work.title'),
            description:        work.getStructuredText('work.description'),
            logo:               app.utils.getImage(work.get('work.logo')),
            main_photo:         app.utils.getImage(work.get('work.main_photo')),
            background_color:   common.getColor(work.get('work.background_color')),

            links:              app.utils.iterateGroup({
                document:   work,
                path:       'work.links'
            }, function(link, i) {
                return {
                    link:       link.getLink('link').value.url
                }
            }),

            photos:             app.utils.iterateGroup({
                document:   work,
                path:       'work.photos'
            }, function(photo, i) {
                return {
                    photo:      app.utils.getImage(photo.get('photo'))
                }
            })
        });
    });
}
