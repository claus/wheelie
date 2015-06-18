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
        var values = [{ delta: 0, time: 0 }];
        var maxDelta = Number.MIN_VALUE;
        var minDelta = Number.MAX_VALUE;
        for (var i = 1; i < buffer.length; i++) {
            var delta = buffer[i - 1].y - buffer[i].y;
            maxDelta = Math.max(maxDelta, delta);
            minDelta = Math.min(minDelta, delta);
            values.push({
                delta: delta,
                time: (i > 0) ? buffer[i].time - buffer[i - 1].time : 0
            });
        }
        return {
            duration: buffer[buffer.length - 1].time - buffer[0].time,
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
        var scaleV = height / (deltas.maxDelta - deltas.minDelta);
        var scaleH = width / deltas.duration;
        ctx.save();
        ctx.clearRect(0, 0, width, height);
        ctx.translate(0, deltas.maxDelta * scaleV);
        ctx.scale(scaleH, scaleV);
        var time = 0;
        for (var i = 0; i < deltas.values.length; i++) {
            ctx.fillStyle = '#88f';
            ctx.fillRect(
                time,
                0,
                Math.max(deltas.values[i].time - 1, 0),
                deltas.values[i].delta
            );
            time += deltas.values[i].time;
        }
        ctx.beginPath();
        ctx.lineWidth = 1 / scaleV;
        ctx.strokeStyle = '#000';
        ctx.moveTo(0, 0);
        ctx.lineTo(width, 0);
        ctx.stroke();
        ctx.restore();
        //console.log(deltas);
    },

    render: function () {
        return (
            <canvas width={this.props.width} height={this.props.height}></canvas>
        );
    }

});

module.exports = ChartDelta;
