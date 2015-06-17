'use strict';

var React = require('react');
var Link = require('react-router').Link;

var Navigation = React.createClass({

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    render: function() {
        var isActive = this.context.router.isActive;
        var homeClass = isActive('/') ? 'selected' : '';
        var collectClass = isActive('/collect') ? 'selected' : '';
        var resultsClass = isActive('/results') ? 'selected' : '';
        return (
            <ul className="navigation">
                <li className={homeClass}><Link to='/'>Wheelie</Link></li>
                <li className={collectClass}><Link to='/collect'>Collect</Link></li>
                <li className={resultsClass}><Link to='/results'>Results</Link></li>
            </ul>
        );
    }

});

module.exports = Navigation;
