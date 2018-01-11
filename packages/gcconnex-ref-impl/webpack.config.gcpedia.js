const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');

module.exports = {
  target: 'web',
  entry: ['babel-polyfill', 'whatwg-fetch', './gcpedia/main.js'],
  plugins: [
    // new CleanWebpackPlugin(['dist']),
    new UglifyJSPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new CopyWebpackPlugin([
      { from: 'gcpedia/Recommendations.php', to: './' },
      // { from: 'gcpedia/main.js', to: './' },
    ]),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'gcpedia.js',
    library: 'refimpl',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
};
