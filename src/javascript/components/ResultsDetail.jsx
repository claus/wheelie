'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var EventsStore = require('../stores/EventsStore');
var ChartAbs = require('./ChartAbs');
var ChartDelta = require('./ChartDelta');

var ResultsDetail = React.createClass({

    mixins: [FluxibleMixin],

    statics: {
        storeListeners: [EventsStore]
    },

    onChange: function () {
    },

    render: function() {
        var doc = this.getStore(EventsStore).getById(this.props.params.id);
        var date = new Date(doc.createdAtNum);
        return (
            <div className="page result-details">
                <h1>Result {date.toISOString()}:</h1>
                <p>UserAgent: {doc.userAgent}</p>
                <div className="canvas-container">
                    <ChartAbs width={950} height={150} data={doc.events} />
                </div>
                <div className="canvas-container">
                    <ChartDelta width={950} height={150} data={doc.events} />
                </div>
            </div>
        );
    }

});

module.exports = ResultsDetail;
