'use strict';

var EventsStore = require('../stores/EventsStore');

module.exports = function (context, payload, done) {
    var eventsStore = context.getStore(EventsStore);
    context.dispatch('SUBMIT_EVENTS_START');
    context.service.create('events', {}, payload, function (err, events) {
        context.dispatch('SUBMIT_EVENTS_END', events);
        done();
    });
};
