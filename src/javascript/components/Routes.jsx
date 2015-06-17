'use strict';

var React = require('react');
var Route = require('react-router').Route;
var DefaultRoute = require('react-router').DefaultRoute;
var NotFoundRoute = require('react-router').NotFoundRoute;
var Application = require('./Application');
var Home = require('./Home');
var Collect = require('./Collect');
var Results = require('./Results');
var NotFound = require('./NotFound');

var routes = (
    <Route name="app" path="/" handler={Application}>
        <Route name="collect" handler={Collect} />
        <Route name="results" handler={Results} />
        <DefaultRoute name="home" handler={Home} />
        <NotFoundRoute handler={NotFound} />
    </Route>
);

module.exports = routes;
