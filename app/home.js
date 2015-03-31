"use strict";

var Promise         = require('promise');
var common          = require('./common');

module.exports = function home(app, res) {
    return new Promise(function (resolve, reject) {

        app.bookmarks.get(res.locals.ctx)
            .then(function(bookmarks) {

                res.content.home = {
                    company:    company(app, bookmarks.about),
                    about:      section(app, bookmarks.about, 'about'),
                    office:     section(app, bookmarks.about, 'office'),
                    process:    process(app, bookmarks.about),
                    people:     peeps(app, bookmarks.about),
                    clients:    section(app, bookmarks.about, 'clients')
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
        tagline:            content.getText('about.company_tagline'),
        email:              content.getText('about.company_email'),
        telephone:          content.getText('about.company_telephone'),
        visiting_address:   content.getStructuredText('about.company_visiting_address'),
        location:           content.getGeoPoint('about.company_location')
    };
}

function section(app, content, name) {
    if (!content) {
        return;
    }

    return {
        title:              content.getText('about.'+name+'_title'),
        description:        content.getStructuredText('about.'+name+'_description'),
        photo:              app.utils.getImage(content.get('about.'+name+'_photo')),
        background_color:   common.getColor(content.get('about.'+name+'_background_color'))
    };
}

function process(app, content) {
    if (!content) {
        return;
    }

    var proc = {
        title:              content.getText('about.process_title'),
        description:        content.getStructuredText('about.process_description'),
        photo:              app.utils.getImage(content.get('about.process_photo')),
        background_color:   common.getColor(content.get('about.process_background_color'))
    };

    proc.steps = app.utils.iterateGroup({
        document:   content,
        path:       'about.process_steps'
    }, function(step, i) {

        return {
            title:          step.getText('step_title'),
            description:    step.getStructuredText('step_description'),
            icon:           app.utils.getImage(step.get('step_icon')),
            i:              i
        };

    });

    return proc;
}

function peeps(app, content) {
    if (!content) {
        return;
    }

    var people_content = {
        title:              content.getText('about.people_title'),
        description:        content.getStructuredText('about.people_description'),
        photo:              app.utils.getImage(content.get('about.people_photo')),
        background_color:   common.getColor(content.get('about.people_background_color'))
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
