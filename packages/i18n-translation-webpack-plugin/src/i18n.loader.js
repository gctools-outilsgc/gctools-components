/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */

/* eslint-disable camelcase */
/**
 * Entrypoint to the localizer for translate functions.
 *
 */
const loaderUtils = require('loader-utils');
const Plugin = require('./plugin');

function i18nLoader() {
  let options = {};
  this.options.plugins.forEach((p) => {
    if (p instanceof Plugin) {
      [{ options }] = [p];
    }
  });

  const { localizer_global, localizer_window } = options;
  const loaderOptions = loaderUtils.getOptions(this);
  let addDomain = '';
  if (loaderOptions && loaderOptions.domain) {
    addDomain
      = `${localizer_global}.registerDomain('${loaderOptions.domain}');`;
  }
  const window = (localizer_window)
    ? `window.${localizer_window} = ${localizer_global};` : '';
  const newStr =
    `
    (function () {
      ${addDomain}
      ${window}
      module.exports = ${localizer_global};
    })();`;
  return newStr;
}

module.exports = i18nLoader;
