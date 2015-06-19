// Inspired by
// http://fluxible.io/tutorials/routing.html
// https://github.com/yahoo/flux-examples/tree/master/react-router

require('node-jsx').install({ extension: '.jsx' })

var fs = require('fs');
var express = require('express');
var expressState = require('express-state');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var debug = require('debug')('Server');
var React = require('react');
var Router = require('react-router');
var FluxibleComponent = require('fluxible/addons/FluxibleComponent');
var app = require('./src/javascript/app');
var Html = require('./src/javascript/components/Html.jsx');
var navigateAction = require('./src/javascript/actions/navigate');
var loadEvents = require('./src/javascript/actions/loadEvents');

var server = express();

var connection = mongoose.connection;
connection.on("open", dbOpen);
connection.on("error", dbError);

mongoose.connect(
  process.env.MONGOLAB_URI || "mongodb://localhost/wheelie",
  { server: { keepAlive: 1, auto_reconnect: true } }
);

function dbOpen() {

    var db = this.db;

    var modelsPath = __dirname + "/src/javascript/models";
    fs.readdirSync(modelsPath).forEach(function(file) {
        if (file.indexOf(".js") >= 0) {
            var modelName = file.replace(".js", "");
            db[modelName] = require(modelsPath + "/" + file)(mongoose);
            console.log("Model " + modelName + " initialized");
        }
    });

    expressState.extend(server);

    server.use('/', express.static(__dirname + '/build'));
    server.use(cookieParser());
    server.use(bodyParser.json());
    server.use(csrf({ cookie: true }));

    var eventsService = require('./src/javascript/services/events');
    eventsService.db = db;

    var fetchrPlugin = app.getPlugin('FetchrPlugin');
    fetchrPlugin.registerService(eventsService);
    server.use(fetchrPlugin.getXhrPath(), fetchrPlugin.getMiddleware());

    server.use(function (req, res, next) {
        var context = app.createContext({
            req: req,
            xhrContext: {
                _csrf: req.csrfToken()
            }
        });

        Router.run(app.getComponent(), req.path, function (Handler, state) {

            context.executeAction(loadEvents, {}, function (err) {
                context.executeAction(navigateAction, state, function (err) {

                    var appState = app.dehydrate(context);

                    res.expose(appState, 'App');

                    var HtmlComponent = React.createFactory(Html);
                    var HandlerComponent = React.createFactory(Handler);

                    var markup = React.renderToString(React.createElement(
                        FluxibleComponent,
                        { context: context.getComponentContext() },
                        HandlerComponent()
                    ));

                    var html = React.renderToStaticMarkup(HtmlComponent({
                        title: 'Wheelie',
                        description: 'A tool to collect and profile mouse wheel data from various input devices',
                        state: res.locals.state,
                        markup: markup
                    }));

                    res.send('<!doctype html>' + html);

                });
            });
        });
    });

    var port = process.env.PORT || 3000;
    server.listen(port);
    debug('Listening on port ' + port);
}

function dbError() {
    debug("Mongoose failed to connect");
}

process.on('exit', function () {
    console.log('Mongoose disconnecting');
    mongoose.disconnect();
    server.close();
});

