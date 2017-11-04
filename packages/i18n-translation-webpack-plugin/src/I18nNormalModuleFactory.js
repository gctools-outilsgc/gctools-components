/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */

function I18nNormalModuleFactory(factory) {
  this.factory = factory;
}

I18nNormalModuleFactory.prototype.create =
  function create(context, dependency, callback) {
    this.factory.create(context, dependency, (err, module) =>
      callback(null, module));
  };

module.exports = I18nNormalModuleFactory;
