'use strict';

var React = require('react');

var Home = React.createClass({

    render: function() {
        return (
            <div>
                <h1>Welcome to Wheelie!</h1>
                <p>Made in <a href="http://madeinhaus.com/">HAUS</a></p>
            </div>
        );
    }

});

module.exports = Home;
