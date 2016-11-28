const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const config = require('config');
const fs = require("fs");
const getVersion = require("./lib/version").getVersion;
const mkdirp = require("./lib/util").mkdirp;
const alias = config.alias;
const NODE_ENV = process.env.NODE_ENV;
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const execSync = require('child_process').execSync;
const extractCSS = new ExtractTextPlugin("[name].css");
const publicPath = config.path.publicPath || "static";
const templatePath = config.path.template || "template";

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
const entries = getEntries(config.path.page);
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

    plugins.push(function() {
      this.plugin("done", function(statsData) {
        var stats = statsData.toJson();
        //console.log(stats);
        if (!stats.errors.length) {
          var jsEntries = ["common"].concat(Object.keys(entries).map(function(entry){
            return entry;
          }));
          var templateFiles = glob
            .sync(templatePath + "/**/*.html")
            .map(function (f) {
              return f;
            });
          var staticPagePath = config.path.page.replace(config.path.client, config.path["static"]);
          var replacements = getReplacements(stats);
          renameHashFiles(replacements);
          templateFiles.forEach(function(templateFile){
            var html = fs.readFileSync(templateFile, "utf8");
            jsEntries.forEach(function(entry){
              var tmp = replacements[entry];
              html = html.replace(tmp.jsReg, tmp.jsReplacement);
              if(tmp.cssReplacement){
                html = html.replace(tmp.cssReg, tmp.cssReplacement);
              }
            });
            
            var templateOutputPath = templateFile.replace(config.path.client, config.path["static"]);
            mkdirp(templateOutputPath.replace(/(.+\/).+$/, "$1"));
            fs.writeFileSync(templateOutputPath, html);
          });

          function getReplacements(stats){
            var cache = {};
            jsEntries.forEach(function(entry){
              var entryPath = publicPath+"/"+entry;
              var ret = stats.assetsByChunkName[entry];
              var entryJs = Array.isArray(ret) ? ret[0] : ret;
              var jsReg = new RegExp("(<script[^><]*src=)(['\"])"+entryPath+"(\\.js\\2)");
              var cssReg = new RegExp("(<link[^>/]*href=)(['\"])"+entryPath+"(\\.css\\2)");
              const jsVersion = entry=="common" ? getVersion(staticPagePath+"/"+entryJs, "md5") : getVersion(config.path.page+"/"+entryJs);
              var cssVersion = null;
              var cssPath = `${config.path.page}/${entry}.${config.complier.css}`;
              if(fs.existsSync(cssPath)){
                cssVersion = getVersion(cssPath);
              }
              cache[entry] = {
                jsReg: jsReg,
                cssReg: cssReg,
                jsReplacement: `$1$2${entryPath}.${jsVersion}$3`,
                cssReplacement: `$1$2${entryPath}.${cssVersion}$3`,
                jsVersion: jsVersion,
                cssVersion: cssVersion
              };
            });
            return cache;
          }

          function renameHashFiles(replacements){
            Object.keys(replacements).forEach(entry=>{
              var replacement = replacements[entry];
              fs.renameSync(path.join("./", publicPath, entry+".js"), path.join("./", publicPath, entry+"."+replacement.jsVersion+".js"));
              if(replacement.cssVersion){
                fs.renameSync(path.join("./", publicPath, entry+".css"), path.join("./", publicPath, entry+"."+replacement.cssVersion+".css"));
              }
            });
          }
        }
      });
    });
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
    chunkFilename: "[name].chunk.js",
    publicPath: publicPath
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
