'use strict';

var _ = require('lodash');
var createStore = require('fluxible/addons').createStore;

var EventsStore = createStore({

    storeName: 'EventsStore',

    handlers: {
        'SUBMIT_EVENTS_END': 'submitEventsEnd'
    },

    initialize: function () {
        this.events = [];
        this.eventsMap = {};
    },

    submitEventsEnd: function (events) {
        console.log('EventsStore.submitEventsEnd', events);
        this.events.push(events);
        this.eventsMap[events._id] = events;
        this.emitChange();
    },

    getAll: function () {
        return this.events;
    },

    getById: function (id) {
        return this.eventsMap[id];
    },

    dehydrate: function () {
        return {
            events: this.events
        };
    },

    rehydrate: function (state) {
        this.events = state.events;
        this.eventsMap = {};
        _.each(this.events, function (events) {
            this.eventsMap[events._id] = events;
        }, this);
    }

});


module.exports = EventsStore;
