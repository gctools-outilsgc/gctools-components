/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */

/**
 * Any found translation functions are replaced with this code.
 *
 */
const Dependency = require('webpack/lib/Dependency.js');
const path = require('path');

const loader = path.join(__dirname, 'i18n.loader.js');

function I18nDependency(expr, key, domain, value, ikey) {
  const loaderStr
    = encodeURI(`${loader}?key=${key}&domain=${domain}${
      (typeof value !== 'undefined') ? `&value=${value}` : ''
    }`);
  this.request = `${loaderStr}!./<I18nWebpackPlugin>`;
  this.module = null;

  this.userRequest = this.request;
  this.Class = I18nDependency;
  this.expr = expr;
  this.key = key;
  this.domain = domain;
  this.value = value;
  this.ikey = ikey;
}

I18nDependency.prototype = Object.create(Dependency.prototype);
I18nDependency.prototype.type = 'i18n';
I18nDependency.prototype.constructor = I18nDependency;
I18nDependency.prototype.isEqualResource = function isEqualResource(other) {
  return other instanceof I18nDependency ?
    this.request === other.request : false;
};

class I18nTemplate {
  // eslint-disable-next-line class-methods-use-this
  apply(dep, source, outputOptions, requestShortener) {
    if (!dep.expr) return;
    const { range, callee: { range: [crange1, crange2] } } = dep.expr;
    const comment = outputOptions.pathinfo ?
      `/*! ${requestShortener.shorten(dep.request)} */ ` : '';
    let content = '';
    if (dep.module) {
      if (dep.ikey) {
        source.replace(crange1, crange2 - 1, '');
      } else {
        content = `(
          /* this was injected by i18n */
          function localizedString() {
            ${comment}
            var l = __webpack_require__(${JSON.stringify(dep.module.id)});
            return l.translate(
              '${dep.domain}',
              '${dep.key}'
              ${(typeof dep.value !== 'undefined') ? `,'${dep.value}'` : ''}
            );
          }
        )()`;
        source.replace(range[0], range[1] - 1, content);
      }
    }
  }
}
I18nDependency.Template = I18nTemplate;

module.exports = I18nDependency;
