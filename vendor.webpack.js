const path = require('path');
const config = require('config');
const webpack = require('webpack');
const NODE_ENV = process.env.NODE_ENV;

var webpackConfig = {
  entry: {
    'core': [path.resolve(__dirname, './client/vendor/core.js')],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ],
  },
  resolve: {
    alias: config.alias
  },
  output: {
    filename: '[name].lib.js',
    path: path.join(__dirname, 'client/vendor'),
    library: '[name]'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DllPlugin({
      path: path.join(__dirname, 'manifest', '[name]-'+NODE_ENV+'-manifest.json'),
      name: '[name]'
    })
  ]
};

if(!config.isOnline){
  webpackConfig.devtool = 'cheap-module-source-map';
  var files = Object.keys(webpackConfig.entry).map(function(key){
    return webpackConfig.entry[key][0];
  });
  
  /*
  // TODO. Support in next generation.
  //only deal with chagne event!
  chokidar.watch(files, {
    ignored: /\.map/
  })
    .on('change', function(file){
      console.log(file, "has been changed.", 'Will recomplie...');
      complie();
    });
  */
}else{
  webpackConfig.plugins = webpackConfig.plugins.concat([
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false,
        },
        output: {
          comments: false,
        },
        sourceMap: false
      })
    ]);
}

var complier = webpack(webpackConfig);
function complie(){
  complier.run(function(err, stats) {
    if(err){
      console.error(err);
    }else{
      console.log('lib build completed! Hash:', stats.hash,' Cost:', stats.endTime - stats.startTime,'ms');
    }
  });
}

complie();
