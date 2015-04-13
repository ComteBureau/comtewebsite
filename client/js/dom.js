"use strict";

var dom = {
    id: function(id_name) {
        return document.getElementById(id_name);
    },

    tag: function(tag_name) {
        return document.getElementsByTagName(tag_name)[0];
    }
};

module.exports = dom;
