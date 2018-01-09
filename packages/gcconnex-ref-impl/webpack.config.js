const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const path = require('path');

module.exports = {
  target: 'web',
  entry: ['./src/apollo.js'],
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new UglifyJSPlugin({
      sourceMap: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'refimpl',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  externals: {
    react: 'require("react")',
    'react-dom': 'require("react-dom")',
    jsrsasign: 'require("jsrsasign")',
  },
};
