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

            console.log(app.config.url());

            return {
                i:                  i,
                id:                 work.id,
                // link:               linkresolver('work', work),
                link:               app.linkresolver.document('work', work),
                date:               common.getDate(work.getDate('work.published')),
                tags:               common.getText(work.getText('work.tags')),
                title:              common.getText(work.getText('work.title')),
                subtitle:           common.getText(work.getText('work.subtitle')),
                description:        common.getText(work.getStructuredText('work.description').asHtml(linkResolver, htmlSerializer)),
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



// function linkresolver(route_name, doc) {
//     var route = '/work/:slug/:id';

//     if (typeof route === 'undefined') {
//         return null;
//     }

//     var url = route.split('/').map(function(param) {
//         if (param.charAt(0) === ':') {

//             if (param.charAt(param.length - 1) === '?') {
//                 var optional;

//                 if (Object.prototype.toString.call(doc) === '[object Object]') {
//                     optional = doc[param.slice(1, param.length - 1)];
//                 }

//                 return typeof optional !== 'undefined' ? optional : null;

//             } else {
//                 var required;

//                 if (Object.prototype.toString.call(doc) === '[object Object]') {
//                     required = doc[param.slice(1)];
//                 }

//                 return typeof required !== 'undefined' ? required : 'PARAM_ERROR';
//             }
//         }

//         return param;
//     });

//     console.log('configurl', configurl());
//     console.log('url', url, url.join('/'));

//     var str = configurl() + url.join('/');
//     if (str.charAt(str.length - 1) !== '/') {
//         str += '/';
//     }

//     console.log('linkesolver str', str);

//     return str;
// }

// var production = process.env.NODE_ENV === 'production';
// var development = process.env.NODE_ENV === 'development';

// function configurl() {
//     if (not(undef(process.env.LOCAL))) {
//         if (bool(process.env.LOCAL)) {
//             return 'http://localhost:5000';
//         }
//     }

//     return production ?
//             'http://www.comte.no' :
//             'http://comte.herokuapp.com';
// }

// function undef(value) {
//     return typeof value === 'undefined';
// }

// function not(value) {
//     return !value;
// }

// function bool(str) {
//     if (str == void 0) return false;
//     return str.toLowerCase() === 'true';
// }
