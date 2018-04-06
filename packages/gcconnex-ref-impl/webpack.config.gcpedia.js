const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssFlexBugFixes = require('postcss-flexbugs-fixes');
const eslintFormatter = require('react-dev-utils/eslintFormatter');

const path = require('path');

const cssFilename = 'static/css/[name].css';
const shouldUseSourceMap = false;

module.exports = {
  target: 'web',
  entry: ['babel-polyfill', 'whatwg-fetch', './gcpedia/main.js'],
  devtool: shouldUseSourceMap ? 'source-map' : false,
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new UglifyJSPlugin({
      sourceMap: shouldUseSourceMap,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new CopyWebpackPlugin([
      { from: 'gcpedia/Recommendations.php', to: './' },
      // { from: 'gcpedia/main.js', to: './' },
    ]),
    new ExtractTextPlugin({
      filename: cssFilename,
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'gcpedia.js',
    library: 'refimpl',
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),

            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: path.resolve(__dirname, 'src'),
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
          }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(Object.assign(
              {
                fallback: require.resolve('style-loader'),
                use: [
                  {
                    loader: require.resolve('css-loader'),
                    options: {
                      importLoaders: 1,
                      minimize: true,
                      sourceMap: shouldUseSourceMap,
                    },
                  },
                  {
                    loader: require.resolve('postcss-loader'),
                    options: {
                      ident: 'postcss',
                      plugins: () => [
                        postcssFlexBugFixes,
                        autoprefixer({
                          browsers: [
                            '>1%',
                            'last 4 versions',
                            'Firefox ESR',
                            'not ie < 9', // React doesn't support IE8 anyway
                          ],
                          flexbox: 'no-2009',
                        }),
                      ],
                    },
                  },
                ],
              },
              {},
            )),
          }, {
            loader: require.resolve('file-loader'),
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            options: {
              name: '[name].[hash:8].[ext]',
              useRelativePath: true,
              outputPath: './dist',
              publicPath: '../',
            },
          },
        ],
      },
    ],
  },
};
