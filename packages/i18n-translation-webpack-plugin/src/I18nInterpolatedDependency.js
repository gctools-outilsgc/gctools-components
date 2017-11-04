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

function I18nInterpolatedDependency(ex, tglobal, domain) {
  const loaderStr = encodeURI(`${loader}?domain=${domain}`);
  this.request = `${loaderStr}!./<I18nWebpackPlugin>`;
  this.module = null;

  this.userRequest = this.request;
  this.Class = I18nInterpolatedDependency;
  this.expr = ex;
  this.tglobal = tglobal;
  this.domain = domain;
}

I18nInterpolatedDependency.prototype = Object.create(Dependency.prototype);
I18nInterpolatedDependency.prototype.type = 'i18n';
I18nInterpolatedDependency.prototype.constructor = I18nInterpolatedDependency;
I18nInterpolatedDependency.prototype.isEqualResource =
  function isEqualResource(other) {
    return other instanceof I18nInterpolatedDependency ?
      this.request === other.request : false;
  };

class I18nTemplate {
  // eslint-disable-next-line class-methods-use-this
  apply(dep, source) {
    if (!dep.expr) return;
    const [range1, range2] = dep.expr.callee.range;
    let content = '';
    if (dep.module) {
      content = `(
        /* this was injected by i18n */
        function localizedInterpolatedString() {
          var l = __webpack_require__(${JSON.stringify(dep.module.id)});
          return l.interpolate.bind(l);
        }
      )()(${JSON.stringify(dep.domain)},`;
      source.replace(range1, range2, content);
    }
  }
}
I18nInterpolatedDependency.Template = I18nTemplate;

module.exports = I18nInterpolatedDependency;
