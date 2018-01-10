
module.exports = (baseConfig) => {

baseConfig.module.rules.push({
  exclude: [/\.js$/, /\.html$/, /\.json$/, /\.ejs$/],
  loader: require.resolve('file-loader'),
  oneOf: [
  {
    test: /\.css$/,
    use: [
      require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 1,
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebookincubator/create-react-app/issues/2677
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
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
  }],
  options: {
    name: 'static/media/[name].[hash:8].[ext]',
  },
})

return baseConfig;
}
