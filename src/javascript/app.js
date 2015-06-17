'use strict';

var Fluxible = require('fluxible');

var app = new Fluxible({
    component: require('./components/Routes.jsx')
});

app.registerStore(require('./stores/ApplicationStore'));

module.exports = app;
