var path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'idbcache.js',
    library: 'idbcache',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
    }]
  },
  plugins: [
    new UglifyJsPlugin()
  ]
};