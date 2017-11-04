const I18nTranslationWebpackPlugin
  = require('@gctools-components/i18n-translation-webpack-plugin');

module.exports = (baseConfig) => {
  baseConfig.plugins.push(
    new I18nTranslationWebpackPlugin({
      i18n_dir: 'stories/i18n'
    })
  );
  return baseConfig;
}
