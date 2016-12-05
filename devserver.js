var webpack = require("webpack");
var config = require("config");
var resDumpService = require('res-dump-service');
var templatePath = config.path.template;

var webpackConfig = require("./webpack.config.js");

Object.keys(webpackConfig.entry).forEach(function (key) {
    webpackConfig.entry[key] = [].concat(webpackConfig.entry[key]).concat(['res-dump-service/client', 'webpack-hot-middleware/client']);
});

var compiler = webpack(webpackConfig);

var express = require('express');
var webpackMiddleware = require("webpack-dev-middleware");

var app = new express();

app.use(webpackMiddleware(compiler, {
    // publicPath is required, whereas all other options are optional

    noInfo: true,
    // display no info to console (only warnings and errors)

    quiet: false,
    // display nothing to the console

    lazy: false,
    // switch into lazy mode
    // that means no watching, but recompilation on every request

    watchOptions: {
        aggregateTimeout: 300,
        poll: true
    },
    // watch options (only lazy: false)

    publicPath: config.path.publicPath,
    // public path to bind the middleware to
    // use the same as in webpack

    //index: "index",
    // the index path for web server

    //headers: { "X-Custom-Header": "yes" },
    // custom headers

    stats: {
        colors: true
    },
    // options for formating the statistics

    reporter: null,
    // Provide a custom reporter to change the way how logs are shown.

    serverSideRender: false,
    // Turn off the server-side rendering mode. See Server-Side Rendering part for more info.
}));

var middleware = require("webpack-hot-middleware")(compiler, {
    log: console.log, 
    path: '/__webpack_hmr', 
    heartbeat: 10 * 1000
});


//init some routes.
app.use(resDumpService({
    webpackConfig: webpackConfig,
    commonFileName: "common"
}));
app.use(middleware);

app.listen(config.port);
console.log("=========== Server is listening on "+config.port+" ==========");