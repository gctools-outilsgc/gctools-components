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

function i18nLoader() {
  const loaderOptions = loaderUtils.getOptions(this);
  const options = JSON.parse(decodeURIComponent(loaderOptions.options));

  const { localizer_global, localizer_window } = options;
  let addDomain = '';
  if (loaderOptions.domain) {
    addDomain
      = `${localizer_global}.registerDomain('${loaderOptions.domain}');`;
  }
  const window = (localizer_window)
    ? `if (typeof window !== 'undefined')
      window.${localizer_window} = ${localizer_global};` : '';
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
