'use strict';

var React = require('react');
var Link = require('react-router').Link;

var Navigation = React.createClass({

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    render: function() {
        return (
            <ul className="navigation">
                <li><Link to='/'>Wheelie</Link></li>
                <li><Link to='/collect'>Collect</Link></li>
            </ul>
        );
    }

});

module.exports = Navigation;
