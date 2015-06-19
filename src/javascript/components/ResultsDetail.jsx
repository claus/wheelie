'use strict';

var _ = require('lodash');
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

    renderTable: function () {
        var doc = this.getStore(EventsStore).getById(this.props.params.id);
        var firstItem = doc.events[0];
        var yTotal = 0;
        var rows = _.map(doc.events, function(item, i) {
            var time = (Math.round((item.time - firstItem.time) * 1000) / 1000).toFixed(3);
            var timeDelta = ((i > 0) ? Math.round((item.time - doc.events[i - 1].time) * 1000) / 1000 : 0).toFixed(3);
            var y = Math.round(item.y);
            var yDelta = (i > 0) ? y - Math.round(doc.events[i - 1].y) : 0;
            yTotal += item.y;
            return (
                <tr key={Math.round(item.time * 1000)}>
                    <td>{time}</td>
                    <td>{timeDelta}</td>
                    <td>{yTotal}</td>
                    <td>{y}</td>
                    <td>{yDelta}</td>
                    <td>{item.mode}</td>
                </tr>
            );
        });
        return (
            <table>
                <thead>
                    <tr>
                        <th>ms</th>
                        <th>∆ms</th>
                        <th>y</th>
                        <th>∆y</th>
                        <th>∆∆y</th>
                        <th>mode</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
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
                {this.renderTable()}
            </div>
        );
    }

});

module.exports = ResultsDetail;
