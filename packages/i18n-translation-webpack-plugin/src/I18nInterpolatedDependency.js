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

function I18nInterpolatedDependency(ex, tglobal, domain, options) {
  const loaderStr = encodeURI(`${loader}?domain=${domain}&options=${
    encodeURIComponent(JSON.stringify(options))}`);
  this.request = `${loaderStr}!./<I18nWebpackPlugin>`;

  this.userRequest = this.request;
  this.Class = I18nInterpolatedDependency;
  this.expr = ex;
  this.tglobal = tglobal;
  this.domain = domain;
}

I18nInterpolatedDependency.prototype = Object.create(Dependency.prototype);
I18nInterpolatedDependency.prototype.type = 'i18n';
I18nInterpolatedDependency.prototype.constructor = I18nInterpolatedDependency;
I18nInterpolatedDependency.prototype.getResourceIdentifier =
  function getResourceIdentifier() {
    if (this.module) {
      return this.module.id;
    }
    return this.request;
  };

class I18nITemplate {
  // eslint-disable-next-line class-methods-use-this
  apply(dep, source) {
    if (!dep.expr) return;
    const [range1, range2] = dep.expr.callee.range;
    let content = '';
    if (dep.module) {
      const moduleId = dep.getResourceIdentifier();
      content = `(
        /* this was injected by i18n */
        function localizedInterpolatedString() {
          var l = __webpack_require__(${JSON.stringify(moduleId)});
          return l.interpolate.bind(l);
        }
      )()(${JSON.stringify(dep.domain)},`;
      source.replace(range1, range2, content);
    }
  }
}
I18nInterpolatedDependency.Template = I18nITemplate;

module.exports = I18nInterpolatedDependency;
