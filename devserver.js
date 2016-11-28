var webpack = require("webpack");
var config = require("config");
var glob = require('glob');
var templatePath = config.path.template || "template";

var webpackConfig = require("./webpack.config.js");

Object.keys(webpackConfig.entry).forEach(function (key) {
    webpackConfig.entry[key] = [].concat(webpackConfig.entry[key]).concat('webpack-hot-middleware/client');
});

var compiler = webpack(webpackConfig);

var express = require('express');
var webpackMiddleware = require("webpack-dev-middleware");

var app = new express();
(function routes(){
	glob
	    .sync(templatePath + "/**/*.html")
	    .forEach(function (f) {
	    	var route = f.replace(templatePath, "");
	    	app.get(route, function(r, res){
	    		res.sendFile(f);
	    	});
	    	if(/index\.html$/.test(f)){
	    		app.get(route.replace("index.html", ""), function(r, res){
	    			res.sendFile(f);
	    		});
	    	}
	    });
})();

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

    publicPath: config.path.publicPath || "static",
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
app.use(require("webpack-hot-middleware")(compiler, {
	log: console.log, 
	path: '/__webpack_hmr', 
	heartbeat: 10 * 1000
}));

app.listen(3000);