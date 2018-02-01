const autoprefixer = require('autoprefixer');

module.exports = (baseConfig) => {

// baseConfig.module.rules.push({
//   exclude: [/\.js$/, /\.html$/, /\.json$/, /\.ejs$/],
//   loader: require.resolve('file-loader'),
//   oneOf: [
//   {
//     test: /\.css$/,
//     use: [
//       require.resolve('style-loader'),
//       {
//         loader: require.resolve('css-loader'),
//         options: {
//           importLoaders: 1,
//         },
//       },
//       {
//         loader: require.resolve('postcss-loader'),
//         options: {
//           // Necessary for external CSS imports to work
//           // https://github.com/facebookincubator/create-react-app/issues/2677
//           ident: 'postcss',
//           plugins: () => [
//             require('postcss-flexbugs-fixes'),
//             autoprefixer({
//               browsers: [
//                 '>1%',
//                 'last 4 versions',
//                 'Firefox ESR',
//                 'not ie < 9', // React doesn't support IE8 anyway
//               ],
//               flexbox: 'no-2009',
//             }),
//           ],
//         },
//       },
//     ],
//   }],
//   options: {
//     name: 'static/media/[name].[hash:8].[ext]',
//   },
// })

baseConfig.module.rules.push(
    // "postcss" loader applies autoprefixer to our CSS.
    // "css" loader resolves paths in CSS and adds assets as dependencies.
    // "style" loader turns CSS into JS modules that inject <style> tags.
    // In production, we use a plugin to extract that CSS to a file, but
    // in development "style" loader enables hot editing of CSS.
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
    }
  );

  baseConfig.module.rules.push(
    {
      test: [/\.eot$/, /\.svg$/, /\.woff2?$/, /\.ttf$/],
      loader: require.resolve('url-loader'),
      options: {
        limit: 1000000,
        name: 'fonts/[name].[hash:8].[ext]',
      },
    }
  );

  baseConfig.module.rules.push(
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]',
      },
    }
  )

  return baseConfig;
}
