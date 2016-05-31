var webpack = require("webpack"),
    fs = require('fs'),
    pkg = JSON.parse(fs.readFileSync('./package.json')),
    license;

license = fs.readFileSync('../../LICENSE')
  .toString()
  .split(/\s+---\s+/, 1)[0];

module.exports = {
  context: __dirname,
  entry: "./src",
  output: {
    path: __dirname + "/dist",
    filename: pkg.name + ".min.js"
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, loader: 'babel?presets[]=es2015' }
    ]
  },
  devtool: '#sourcemap',
  externals: {
    "window": "window"
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.BannerPlugin(license)
  ]
};
