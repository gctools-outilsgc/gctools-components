module.exports = {
  module: {
    loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
    }]
  },
  externals: {
    'express': 'require("express")',
    'optional': 'require("optional")',
    'node-zookeeper-client': 'require("node-zookeeper-client")',
    'should': 'require("should")',
    'bufferutil': 'require("bufferutil")',
    'utf-8-validate': 'require("utf-8-validate")',
  }
}
