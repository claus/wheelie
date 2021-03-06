'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var EventsStore = require('../stores/EventsStore');
var submitEvents = require('../actions/submitEvents');
var ChartAbs = require('./ChartAbs');
var ChartDelta = require('./ChartDelta');

var wheelTimeoutId;
var buffer = [];

var Collect = React.createClass({

    mixins: [FluxibleMixin],

    statics: {
        storeListeners: [EventsStore]
    },

    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
        return {
            step: 'idle',
            isCollecting: false,
            buffer: []
        };
    },

    onWheel: function () {
        var now = performance.now();
        var buffer = this.state.buffer.concat();
        buffer.push({
            x: event.deltaX || 0,
            y: event.deltaY || 0,
            z: event.deltaZ || 0,
            mode: event.deltaMode || 0,
            time: now
        });
        this.setState({ buffer: buffer });
        clearTimeout(wheelTimeoutId);
        wheelTimeoutId = setTimeout(this.onWheelTimeout, 500);
    },

    onStart: function () {
        this.setState({
            step: 'collecting',
            isCollecting: true,
            buffer: []
        });
    },

    onWheelTimeout: function () {
        this.setState({
            step: 'finished',
            isCollecting: false
        });
    },

    onSubmit: function () {
        this.context.executeAction(submitEvents, {
            createdAt: new Date(),
            userAgent: navigator.userAgent,
            events: this.state.buffer.concat()
        });
        this.setState({
            step: 'submitting',
            isCollecting: false,
            buffer: []
        });
    },

    onChange: function () {
        this.setState({
            step: 'thanks',
            isCollecting: false
        });
    },

    renderStep: function () {
        switch (this.state.step) {
            case 'idle':
                return (<button className="btn green" onClick={this.onStart}>Start</button>);
            case 'collecting':
                if (this.state.buffer.length) {
                    return (<div><p>Collecting data.. {this.state.buffer.length}</p></div>);
                } else {
                    return (
                        <div>
                            <p>
                                Use your input device (TrackPad, MouseWheel, etc.) to scroll down once,
                                as you would if you wanted to scroll down one page.
                            </p>
                            <p>
                                Data collection stops automatically after 500ms of inactivity.
                            </p>
                            <p>
                                Touch events are not supported, we are currently only interested in non-touch.
                            </p>
                            <p className="cta">
                                Please start scrolling now!
                            </p>
                        </div>
                    );
                }
            case 'finished':
                return (
                    <div>
                        <p>
                            Done collecting data. {this.state.buffer.length} events captured.
                        </p>
                        <p className="btn-container">
                            <button className="btn red" onClick={this.onStart}>Retry</button>
                            <button className="btn green" onClick={this.onSubmit}>Submit</button>
                        </p>
                        <div className="canvas-container">
                            <ChartAbs width={950} height={150} data={this.state.buffer} />
                        </div>
                        <div className="canvas-container">
                            <ChartDelta width={950} height={150} data={this.state.buffer} />
                        </div>
                    </div>
                );
            case 'submitting':
                return (<div><p>Submitting..</p></div>);
            case 'thanks':
                return (
                    <div>
                        <p>Thanks!</p>
                        <p className="btn-container">
                            <button className="btn red" onClick={this.onStart}>Retry</button>
                        </p>
                    </div>
                );
        }
    },

    render: function () {
        return (
            <div className="page collect" onWheel={this.state.isCollecting ? this.onWheel : null}>
                <h1>Collect data.</h1>
                {this.renderStep()}
            </div>
        );
    }

});

module.exports = Collect;
