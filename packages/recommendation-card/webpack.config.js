const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssFlexBugFixes = require('postcss-flexbugs-fixes');
const eslintFormatter = require('react-dev-utils/eslintFormatter');

const path = require('path');

const shouldUseSourceMap = false;

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'recommendationCard',
    libraryTarget: 'umd',
  },
  devtool: shouldUseSourceMap ? 'source-map' : false,
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new UglifyJSPlugin({
      sourceMap: shouldUseSourceMap,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
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
            use: [
              { loader: require.resolve('style-loader') },
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
          }, {
            test: [/\.eot$/, /\.svg$/, /\.woff2?$/, /\.ttf$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 1000000,
              name: 'fonts/[name].[hash:8].[ext]',
            },
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
  // externals: {
  //   react: {
  //     root: 'React',
  //     commonjs2: 'react',
  //     commonjs: 'react',
  //     amd: 'react',
  //     umd: 'react',
  //   },
  //   'react-dom': {
  //     root: 'ReactDOM',
  //     commonjs2: 'react-dom',
  //     commonjs: 'react-dom',
  //     amd: 'react-dom',
  //     umd: 'react-dom',
  //   },
  //   '/^library\/.+$/': {},
  // },
  externals: [
    'react',
    'react-dom',
    'material-ui',
    /^material-ui\/.+$/,
    'material-ui-community-icons',
    /^'material-ui-community-icons\/.+$/,
    'font-awesome',
    /^font-awesome\/.+$/,
    'prop-types',
    'react-apollo',
    'react-circular-progressbar',
    'react-d3-cloud',
    'react-dotdotdot',
    'react-fontawesome',
    'react-masonry-component',
    'react-star-rating-component',
    'react-tooltip',
  ],
};
