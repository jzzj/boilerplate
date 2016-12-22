var webpack = require("webpack");
var config = require("config");
var resDumpService = require('res-dump-service');
var templatePath = config.path.template;
var extname = require('path').extname;
var fs = require('fs');

var webpackConfig = require("../webpack.config.js");

Object.keys(webpackConfig.entry).forEach(function (key) {
    webpackConfig.entry[key] = [].concat(webpackConfig.entry[key]).concat(['res-dump-service/client', 'webpack-hot-middleware/client']);
});

var compiler = webpack(webpackConfig);

var webpackMiddleware = require("webpack-dev-middleware");

var hotMiddleware = require("webpack-hot-middleware")(compiler, {
    log: console.log, 
    path: '/__webpack_hmr', 
    heartbeat: 10 * 1000
});

var devMiddleware = webpackMiddleware(compiler, {
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
});


//init some routes.
var resDumpMiddleware = resDumpService({
    webpackConfig: webpackConfig,
    commonFileName: "common",
    makeShortcut: true
});

function doMiddleware(middleware){
    return function *(next){
        wrap.call(this, this.req, this.res)
        const req = this.req;
        const res = this.res;
        yield action.call(this);

        function *action(){
            var nextCalled = false;
            yield new Promise(function(resolve, reject){
                var result = middleware(req, res, function(){
                    nextCalled = true;
                    onFulliflled();
                });
                if(result && typeof result.then === 'function'){
                    result.then(onFulliflled);
                }else{
                    onFulliflled();
                }
                var called = false;
                function onFulliflled(){
                    if(!called){
                        resolve();
                    }
                }
            });
            
            if(nextCalled){
                yield next;
            }
        }
    }
}

// wrap req/res to compatible with express usage.
// warning: dont use these on production!!
function wrap(req, res){
    var ctx = this;
    Object.assign(req, {
        get: this.get.bind(this),
        protocol: this.protocol,
        originalUrl: this.originalUrl
    });

    var originalSetHeader = res.setHeader;
    Object.assign(res, {
        send: function(content){
            ctx.body = content;
        },

        sendFile: function(file){
            try{
                var stats = fs.statSync(file);
            }catch(e){
                console.error(e.stack);
                ctx.body = e.stack;
                return ctx.status = 500;
            }
            if(!stats){
                return ctx.status = 500;
            }
            if (!stats.isFile()) {
                return ctx.status = 403;
            }
            // always use status 200
            ctx.response.status = 200;
            ctx.response.lastModified = stats.mtime;
            ctx.response.length = stats.size;
            ctx.response.type = extname(file);
            ctx.body = fs.createReadStream(file);
        },

        set: this.set.bind(this),

        setHeader: function(){
            if(!ctx.headerSent){
                return originalSetHeader.apply(res, arguments);
            }
        }
    });
}

module.exports = function(app, proxy){
    /*
    *  if you want to proxy some requests
    *  there some options for you: https://github.com/popomore/koa-proxy, https://github.com/KualiCo/koa-pixie-proxy
    *  here, I left blank to you
    */
    // koa generator function
    app.use(doMiddleware(hotMiddleware));

    app.use(doMiddleware(devMiddleware));

    app.use(doMiddleware(resDumpMiddleware));
}