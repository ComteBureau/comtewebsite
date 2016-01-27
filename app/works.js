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
            limit:  50,
            sort:   'work.published desc'
        }),
        query(app, res.locals.ctx, {
            type: 'client',
            limit: 200
        })
    ])
    .then(function (results) {

        console.log('[app/work.js] : Got works and clients');

        res.content.works = get_works(results[0], app);
        console.log('[app/work.js] : Work content OK');

        res.content.clients = get_clients(results[1], app);
        console.log('[app/work.js] : Client content OK');


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

// Shouldn't be like this. Linkresolver should be a part of
// prismic-website and handled automatically
function linkResolver(ctx, doc, isBroken) {
    if (isBroken) return '#broken';
    return '/work/' + doc.slug + '/' + doc.id;
};

function htmlSerializer(element, content) {
    // Don't wrap images in a <p> tag
    if (element.type == 'image') {
        return '<img src="' + element.url + '" alt="' + element.alt + '">';
    }

    if (element.type == 'hyperlink') {
        return '<a target="_blank" href="' + element.url + '">' + content + '</a>';
    }

    // Return null to stick with the default behavior
    return null;
};

function get_works(list, app) {
    return list
        .filter(function(obj) {
            return obj.type === 'work';
        })
        .map(function(work, i) {

            // Shit fix!
            // Should run ALL prismic getters through a module that
            // sets default values for any property that's not defined
            var excerpt = work.getStructuredText('work.description');
            if (excerpt) {
                excerpt = excerpt.getFirstParagraph().text;
            }

            var description = work.getStructuredText('work.description');
            if (description) {
                description = description.asHtml(linkResolver, htmlSerializer);
            } else {
                description = '';
            }

            console.log('[app/work.js] work', i, '-----------------------------');
            console.log('[app/work.js] id:', work.id);
            console.log('[app/work.js] link:', app.linkresolver.document('work', work, true));
            console.log('[app/work.js] data:', common.getDate(work.getDate('work.published')));
            console.log('[app/work.js] tags:', common.getText(work.getText('work.tags')));
            console.log('[app/work.js] title:', common.getText(work.getText('work.title')));
            console.log('[app/work.js] subtitle:', common.getText(work.getText('work.subtitle')));
            console.log('[app/work.js] description:', common.getText(description));
            console.log('[app/work.js] excerpt:', excerpt);
            console.log('[app/work.js] logo:', app.utils.getImage(work.get('work.logo')));
            console.log('[app/work.js] client name:', work.getText('work.client_name'));
            console.log('[app/work.js] main photo:', app.utils.getImage(work.get('work.main_photo')));
            console.log('[app/work.js] backgroundColor:', common.parseColor(work.get('work.background_color')));
            console.log('[app/work.js] foregroundColor:', common.parseColor(work.get('work.foreground_color')));
            console.log('[app/work.js] publishedDate:', common.getDate(work.getDate('work.published')));

            return {
                i:                  i,
                id:                 work.id,
                link:               app.linkresolver.document('work', work, true),
                date:               common.getDate(work.getDate('work.published')),
                tags:               common.getText(work.getText('work.tags')),
                title:              common.getText(work.getText('work.title')),
                subtitle:           common.getText(work.getText('work.subtitle')),
                description:        common.getText(description),
                excerpt:            excerpt,
                logo:               app.utils.getImage(work.get('work.logo')),
                client_name:        work.getText('work.client_name'),
                main_photo:         app.utils.getImage(work.get('work.main_photo')),
                background_color:   common.parseColor(work.get('work.background_color')),
                foreground_color:   common.parseColor(work.get('work.foreground_color')),

                photos:             app.utils.iterateGroup({
                    document:   work,
                    path:       'work.photos'
                }, function(photo, i) {

                    // console.log('[app/work.js] photo:', app.utils.getImage(photo.get('photo')));

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
        .forEach(function(client, i) {
            name = client.getText('client.name');

            console.log('[app/works.js] Client name', name);

            if (!exists(unique, name)) {
                logo = app.utils.getImage(client.get('client.logo'));
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
