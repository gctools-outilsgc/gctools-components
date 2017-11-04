
module.exports = (baseConfig) => {

baseConfig.module.rules.push({
  exclude: [/\.js$/, /\.html$/, /\.json$/, /\.ejs$/],
  loader: require.resolve('file-loader'),
  options: {
    name: 'static/media/[name].[hash:8].[ext]',
  },
})

return baseConfig;
}
