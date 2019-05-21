var path = require('path');

module.exports = {
    mode: 'production',
    entry: './components/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            }
        ]
    }
}