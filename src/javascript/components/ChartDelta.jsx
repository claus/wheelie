'use strict';

var React = require('react');

var ChartDelta = React.createClass({

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {
        this.drawChart();
    },

    getDeltas: function (buffer) {
        var values = [0];
        var maxDelta = Number.MIN_VALUE;
        var minDelta = Number.MAX_VALUE;
        for (var i = 1; i < buffer.length; i++) {
            var delta = buffer[i - 1].y - buffer[i].y;
            maxDelta = Math.max(maxDelta, delta);
            minDelta = Math.min(minDelta, delta);
            values.push(delta);
        }
        return {
            values: values,
            maxDelta: maxDelta,
            minDelta: minDelta
        }
    },

    drawChart: function () {
        var buffer = this.props.data;
        var width = this.props.width;
        var height = this.props.height;
        var ctx = React.findDOMNode(this).getContext('2d');
        var tick = width / buffer.length;
        var deltas = this.getDeltas(buffer);
        var scale = height / (deltas.maxDelta - deltas.minDelta);
        ctx.save();
        ctx.clearRect(0, 0, width, height);
        ctx.translate(0, deltas.maxDelta * scale);
        ctx.scale(1, scale);
        for (var i = 0; i < deltas.values.length; i++) {
            ctx.fillStyle = '#88f';
            ctx.fillRect(
                tick * i,
                0,
                tick,
                deltas.values[i]
            );
        }
        ctx.beginPath();
        ctx.lineWidth = 1 / scale;
        ctx.strokeStyle = '#000';
        ctx.moveTo(0, 0);
        ctx.lineTo(width, 0);
        ctx.stroke();
        ctx.restore();
        console.log(deltas);
    },

    render: function () {
        return (
            <canvas width={this.props.width} height={this.props.height}></canvas>
        );
    }

});

module.exports = ChartDelta;
