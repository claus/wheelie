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
            values.push({
                delta: delta,
                time: (i > 0) ? buffer[i].time - buffer[i - 1].time : 0
            });
        }
        return {
            duration: buffer[buffer.length - 1].time - buffer[0].time,
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
        var scaleV = height / (deltas.maxAbs - deltas.minAbs);
        var scaleH = width / deltas.duration;
        ctx.save();
        ctx.clearRect(0, 0, width, height);
        ctx.translate(0, deltas.maxAbs * scaleV);
        ctx.scale(scaleH, -scaleV);
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
