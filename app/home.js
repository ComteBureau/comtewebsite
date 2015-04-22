"use strict";

var Promise         = require('promise');
var common          = require('./common');

module.exports = function home(app, res) {
    return new Promise(function (resolve, reject) {

        app.bookmarks.get(res.locals.ctx)
            .then(function(bookmarks) {

                res.content.home = {
                    company:    company(app, bookmarks.about),
                    contact:    contact(app, bookmarks.about),
                    about:      about(app, bookmarks.about),
                    people:     peeps(app, bookmarks.about),
                    clients:    clients(app, bookmarks.about)
                };

                resolve(res.content.home);

            }, function(err) {
                reject('Could not get home page');
            });
    });
}

function company(app, content) {
    if (!content) {
        return;
    }

    return {
        name:               content.getText('about.company_name'),
        tagline:            content.getText('about.company_tagline')
    };
}

function contact(app, content) {
    if (!content) {
        return;
    }

    return {
        email:              content.getText('about.contact_email'),
        telephone:          content.getText('about.contact_telephone'),
        visiting_address:   content.getStructuredText('about.contact_visiting_address'),
        location:           content.getGeoPoint('about.contact_location'),
        photo:              app.utils.getImage(content.get('about.contact_photo'))
    };
}

function about(app, content) {
    if (!content) {
        return;
    }

    return {
        title:                  content.getText('about.about_title'),
        subtitle:               content.getText('about.about_subtitle'),
        description_top:        content.getStructuredText('about.about_description_top'),
        description_bottom:     content.getStructuredText('about.about_description_bottom'),
        more_link:              content.getText('about.about_more_link'),
        title_insight:          content.getText('about.about_insight_title'),
        description_insight:    content.getStructuredText('about.about_insight_description'),
        title_strategy:         content.getText('about.about_strategy_title'),
        description_strategy:   content.getStructuredText('about.about_strategy_description'),
        title_design:           content.getText('about.about_design_title'),
        description_design:     content.getStructuredText('about.about_design_description')
    };
}

function clients(app, content) {
    if (!content) {
        return;
    }

    return {
        title:              content.getText('about.clients_title'),
        description:        content.getStructuredText('about.clients_description')
    };
}

function peeps(app, content) {
    if (!content) {
        return;
    }

    var people_content = {
        title:              content.getText('about.people_title'),
        description:        content.getStructuredText('about.people_description'),
        more_link:          content.getText('about.people_more_link'),
        photo:              app.utils.getImage(content.get('about.people_photo'))
    };

    people_content.list = app.utils.iterateGroup({
        document:   content,
        path:       'about.people_list'
    }, function(peep, i) {

        return {
            name:       peep.getText('employee_name'),
            title:      peep.getText('employee_title'),
            email:      peep.getText('employee_email'),
            telephone:  peep.getText('employee_telephone'),
            about:      peep.getStructuredText('employee_about'),
            photo:      app.utils.getImage(peep.get('employee_photo')),
            i:          i
        };

    });

    return people_content;
}
