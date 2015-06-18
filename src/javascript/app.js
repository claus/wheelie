'use strict';

var Fluxible = require('fluxible');
var fetchrPlugin = require('fluxible-plugin-fetchr');

var app = new Fluxible({
    component: require('./components/Routes.jsx')
});

app.plug(fetchrPlugin({ xhrPath: '/api' }));

app.registerStore(require('./stores/ApplicationStore'));
app.registerStore(require('./stores/EventsStore'));

module.exports = app;
