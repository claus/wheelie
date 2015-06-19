'use strict';

var EventsStore = require('../stores/EventsStore');

module.exports = function (context, payload, done) {
    var eventsStore = context.getStore(EventsStore);
    context.dispatch('LOAD_EVENTS_START');
    context.service.read('events', {}, {}, function (err, events) {
        context.dispatch('LOAD_EVENTS_END', events);
        done();
    });
};
