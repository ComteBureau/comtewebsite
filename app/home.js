"use strict";

var Promise         = require('promise');
var common          = require('./common');

module.exports = function home(app, res) {
    return new Promise(function (resolve, reject) {

        app.bookmarks.get(res.locals.ctx)
            .then(function(bookmarks) {

                // Idea for future functionality. Interesting because I
                // put this json object in a separate file and pass it via
                // the contructor.

                // parse(app, res.content, bookmarks.about)
                //     .section('company', {
                //         name: {
                //             type: 'text',
                //             slug: 'about.company_name'
                //         }
                //     })
                //     .section('people', {
                //         list: {
                //             type: 'group',
                //             slug: 'about.people_list',
                //             items: {
                //                 name: {
                //                     type: 'text',
                //                     slug: 'employee_name'
                //                 }
                //             }
                //         }
                //     });

                res.content.home = {
                    company:    company(app, bookmarks.about),
                    contact:    contact(app, bookmarks.about),
                    about:      about(app, bookmarks.about),
                    people:     peeps(app, bookmarks.about),
                    clients:    clients(app, bookmarks.about),
                    colors:     colors(app, bookmarks.about),
                    menu:       menu(app, bookmarks.about)
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
        call_to_action:     content.getText('about.company_call_to_action'),
        the_final:          content.getText('about.company_final')
    };
}

function contact(app, content) {
    if (!content) {
        return;
    }

    return {
        email:              content.getText('about.contact_email'),
        telephone:          content.getText('about.contact_telephone'),
        visiting_address:   content.getStructuredText('about.contact_visiting_address')
    };
}

function about(app, content) {
    if (!content) {
        return;
    }

    return {
        title:                  content.getText('about.about_title'),
        subtitle:               content.getText('about.about_subtitle'),
        description:            content.getStructuredText('about.about_description'),
        more_link:              content.getText('about.about_more_link'),
        title_insight:          content.getText('about.about_insight_title'),
        description_insight:    content.getStructuredText('about.about_insight_description'),
        title_strategy:         content.getText('about.about_strategy_title'),
        description_strategy:   content.getStructuredText('about.about_strategy_description'),
        title_design:           content.getText('about.about_design_title'),
        description_design:     content.getStructuredText('about.about_design_description'),
        title_last:             content.getText('about.about_last_title'),
        description_last:       content.getStructuredText('about.about_last_description')
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

function colors(app, content) {
    if (!content) {
        return;
    }

    return {
        about_bg:           common.parseColor(content.get('about.color_about_bg')),
        about_fg:           common.parseColor(content.get('about.color_about_fg')),
        process_bg:         common.parseColor(content.get('about.color_process_bg')),
        process_fg:         common.parseColor(content.get('about.color_process_fg')),
        clients_bg:         common.parseColor(content.get('about.color_clients_bg')),
        clients_fg:         common.parseColor(content.get('about.color_clients_fg')),
        partners_bg:        common.parseColor(content.get('about.color_partners_bg')),
        partners_fg:        common.parseColor(content.get('about.color_partners_fg')),
        calltoaction_bg:    common.parseColor(content.get('about.color_calltoaction_bg')),
        calltoaction_fg:    common.parseColor(content.get('about.color_calltoaction_fg')),
        dot_a:              common.parseColor(content.get('about.color_dot_a')),
        dot_b:              common.parseColor(content.get('about.color_dot_b')),
        dot_c:              common.parseColor(content.get('about.color_dot_c')),
        dot_d:              common.parseColor(content.get('about.color_dot_d')),
        dot_e:              common.parseColor(content.get('about.color_dot_e'))
    };
}

function menu(app, content) {
    if (!content) {
        return;
    }

    return {
        about:      content.getText('about.menu_about'),
        process:    content.getText('about.menu_process'),
        works:      content.getText('about.menu_works'),
        clients:    content.getText('about.menu_clients'),
        contact:    content.getText('about.menu_contact')
    };
}
