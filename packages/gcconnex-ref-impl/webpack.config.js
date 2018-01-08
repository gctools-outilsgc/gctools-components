const path = require('path');

module.exports = {
  target: 'web',
  entry: ['./index.js', './apollo.js'],
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
  },
};
