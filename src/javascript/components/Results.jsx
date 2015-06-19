'use strict';

var _ = require('lodash');
var React = require('react');
var Link = require('react-router').Link;
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var EventsStore = require('../stores/EventsStore');
var loadEvents = require('../actions/loadEvents');

var Results = React.createClass({

    mixins: [FluxibleMixin],

    statics: {
        storeListeners: [EventsStore]
    },

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    onChange: function () {
    },

    render: function () {
        var docs = this.getStore(EventsStore).getAll();
        var links = _.map(docs, function (doc) {
            var date = new Date(doc.createdAtNum);
            return (
                <li key={doc._id}>
                    <Link to="resultsDetail" params={{ id: doc._id }}>{date.toISOString()}</Link>
                </li>
            );
        });
        return (
            <div className="page results">
                <h1>Results:</h1>
                <ul>{links}</ul>
            </div>
        );
    }

});

module.exports = Results;
