const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const config = require('config');
const alias = config.alias;
const NODE_ENV = process.env.NODE_ENV;
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCSS = new ExtractTextPlugin("[name].css");

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
  new ExtractTextPlugin("[name].css"),
  commonsPlugin
];
const isOnline = NODE_ENV ? NODE_ENV==='production' : config.isOnline;
if(isOnline){
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
      sourceMap: false,
      test: /\.(js|jsx)$/
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

  entry: getEntries(config.path.template),
  output: {
    path: path.join(__dirname, config.path.publicPath),
    filename: '[name].js',
    chunkFilename: "[name].chunk.js",
    publicPath: config.path.publicPath+"/" || "static"
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test:   /\.s?css$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules!postcss')
      }
    ]
  },
  postcss: function () {
    return [require('autoprefixer'), require('precss')];
  },
  plugins: plugins,
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: alias
  },
  devtool: isOnline ? null :'cheap-module-source-map'
}
