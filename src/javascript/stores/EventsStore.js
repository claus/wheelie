'use strict';

var _ = require('lodash');
var createStore = require('fluxible/addons').createStore;

var EventsStore = createStore({

    storeName: 'EventsStore',

    handlers: {
        'LOAD_EVENTS_END': 'loadEventsEnd',
        'SUBMIT_EVENTS_END': 'submitEventsEnd'
    },

    initialize: function () {
        this.docs = [];
        this.docsMap = {};
    },

    loadEventsEnd: function (events) {
        _.each(events, function (eventsDoc) {
            this.docs.push(eventsDoc);
            this.docsMap[eventsDoc._id] = eventsDoc;
        }, this);
        this.docs.sort(function (a, b) { return b.createdAtNum - a.createdAtNum });
        this.emitChange();
    },

    submitEventsEnd: function (eventsDoc) {
        this.docs.push(eventsDoc);
        this.docs.sort(function (a, b) { return b.createdAtNum - a.createdAtNum });
        this.docsMap[eventsDoc._id] = eventsDoc;
        this.emitChange();
    },

    getAll: function () {
        return this.docs;
    },

    getById: function (id) {
        return this.docsMap[id];
    },

    dehydrate: function () {
        return {
            docs: this.docs
        };
    },

    rehydrate: function (state) {
        this.docs = state.docs.sort(function (a, b) { return b.createdAtNum - a.createdAtNum });
        this.docsMap = {};
        _.each(this.docs, function (events) {
            this.docsMap[events._id] = events;
        }, this);
    }

});


module.exports = EventsStore;
