"use strict";

module.exports.add = function(element, event_name, callback, prefix) {

    if (typeof element.addEventListener !== 'undefined') {
        return element.addEventListener(event_name, callback, false);
    }

    if (typeof prefix !== 'undefined') {
        event_name = prefix + event_name;
    }

    if (typeof element.attachEvent !== 'undefined') {
        return element.attachEvent(event_name, callback);
    }

    return undefined;
}

module.exports.remove = function(element, event_name, callback, prefix) {

    if (typeof element.removeEventListener !== 'undefined') {
        return element.removeEventListener(event_name, callback, false);
    }

    if (typeof prefix !== 'undefined') {
        event_name = prefix + event_name;
    }

    if (typeof element.detachEvent !== 'undefined') {
        return element.detachEvent(event_name, callback);
    }

    return undefined;
}
