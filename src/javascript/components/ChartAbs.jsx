'use strict';

var React = require('react');

var ChartDelta = React.createClass({

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {
        this.drawChart();
    },

    getAbs: function (buffer) {
        var values = [];
        var maxAbs = Number.MIN_VALUE;
        var minAbs = Number.MAX_VALUE;
        for (var i = 0; i < buffer.length; i++) {
            var delta = buffer[i].y;
            maxAbs = Math.max(maxAbs, delta);
            minAbs = Math.min(minAbs, delta);
            values.push(delta);
        }
        return {
            values: values,
            maxAbs: maxAbs,
            minAbs: minAbs
        }
    },

    drawChart: function () {
        var buffer = this.props.data;
        var width = this.props.width;
        var height = this.props.height;
        var ctx = React.findDOMNode(this).getContext('2d');
        var tick = width / buffer.length;
        var deltas = this.getAbs(buffer);
        var scale = height / (deltas.maxAbs - deltas.minAbs);
        ctx.save();
        ctx.clearRect(0, 0, width, height);
        ctx.translate(0, deltas.maxAbs * scale);
        ctx.scale(1, -scale);
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
