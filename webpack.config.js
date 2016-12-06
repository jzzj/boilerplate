const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const config = require('config');
const fs = require("fs");
const alias = config.alias;
const NODE_ENV = process.env.NODE_ENV;
const ResDumpPlugin = require('res-dump-plugin');
const publicPath = config.path.publicPath;
const templatePath = config.path.template;
const cdnPath = (config.cdn || "").replace(/\/$/, "");

const commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
  name: "common",
  // (the commons chunk name)

  filename: "common.js",
  // (the filename of the commons chunk)

  // minChunks: 3,
  // (Modules must be shared between 3 entries)

  // chunks: ["pageA", "pageB"],
  // (Only use these entries)
});
var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: NODE_ENV ? `'${NODE_ENV}'` : '"development"',
      IS_BROWSER: JSON.stringify(true)
    }
  }),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DllReferencePlugin({
    context: __dirname,
    //                                                  core is relative to vendor.webpack.js entry field, check it yourself
    manifest: require(path.join(__dirname, 'manifest', 'core-'+NODE_ENV+'-manifest.json')),
  }),
  commonsPlugin
];
const isOnline = NODE_ENV ? NODE_ENV==='production' : config.isOnline;
const entries = getEntries(config.path.page);
if(isOnline){
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      output: {
        comments: false,
      },
      sourceMap: false,
      test: /\.(js|jsx)$/
    }));
    plugins.push(new webpack.optimize.DedupePlugin());
    // html/css/img resources reference hash etc.
    plugins.push(new ResDumpPlugin({
      commonFile: "common"
    }));
}

function getEntries(dir){
  dir = dir.replace(/\/$/, '');
  var entries = {};
  glob
    .sync(dir + "/**")
    .filter(function (f) {
      return !/node_modules/.test(f)
    })
    .filter(function(f) {
      return /index.jsx?$/.test(f)
    })
    .forEach(function (f) {
      var name = path.relative(dir, f).replace(/.(js|jsx)$/, '');
      entries[name] = [f];
    });
  return entries;
}

module.exports = {
  // Disable handling of unknown requires
  unknownContextRegExp: /$^/,
  unknownContextCritical: false,

  // Disable handling of requires with a single expression
  exprContextRegExp: /$^/,
  exprContextCritical: false,

  entry: entries,
  output: {
    path: path.join(__dirname, publicPath),
    filename: '[name].js',
    chunkFilename: "chunk-[id]/[chunkhash:8].chunk.js",
    // make sure that publicPath end up with /
    publicPath: (publicPath+"/").replace(/\/\/$/, '/')
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: plugins,
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: alias
  },
  devtool: isOnline ? null :'cheap-module-source-map'
}
