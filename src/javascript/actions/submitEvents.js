'use strict';

var EventsStore = require('../stores/EventsStore');

module.exports = function (context, payload, done) {
    var eventsStore = context.getStore(EventsStore);
    context.dispatch('SUBMIT_EVENTS_START');
    context.service.create('events', {}, payload, function (err, events) {
        context.dispatch('SUBMIT_EVENTS_END', events);
        done();
    });
    /*
    context.service.create('events', {}, {}, function (err, messages) {
        context.dispatch('RECEIVE_MESSAGES', messages);
        context.executeAction(openThread, payload, function() {
            context.dispatch('SHOW_CHAT_END');
            done();
        })
    });

    if (Object.keys(messageStore.getAll()).length === 0) {
        fetchMessages(context, payload, done);
    } else {
        context.dispatch('SUBMIT_EVENTS_START');
        done();
    }
    */
    done();
};
