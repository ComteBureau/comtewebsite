"use strict";

var Promise         = require('promise');

module.exports = function home(app, res) {
    return new Promise(function (resolve, reject) {

        app.bookmarks.get(res.locals.ctx)
            .then(function(bookmarks) {

                res.content.home = {
                    company:    company(app, bookmarks.about),
                    about:      about_us(app, bookmarks.about)
                };

                resolve(res);

            }, function(err) {
                reject('Could not get home page');
            });
    });
}

function company(app, about) {
    if (!about) {
        return;
    }

    return {
        name:               about.getText('about.company_name'),
        tagline:            about.getText('about.company_tagline'),
        email:              about.getText('about.company_email'),
        telephone:          about.getText('about.company_telephone'),
        visiting_address:   about.getStructuredText('about.company_visiting_address'),
        location:           about.getGeoPoint('about.company_location')
    };
}

function about_us(app, about) {
    if (!about) {
        return;
    }

    // console.log(about.get('about.about_background_color').value);

    return {
        title:              about.getText('about.about_title'),
        description:        about.getStructuredText('about.about_description'),
        photo:              app.utils.getImage(about.get('about.about_photo')),
        background_color:   about.get('about.about_background_color').value
    };
}
