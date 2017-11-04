/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */

module.exports = function PluginEnvironment(context) {
  const events = [];
  let request = {};
  let callback = false;

  this.getEnvironmentStub = function getEnvironmentStub() {
    return {
      context,
      plugin: function plugin(name, handler) {
        events.push({
          name,
          handler: (req, cb) => {
            request = req;
            callback = cb;
            handler(req, cb);
          },
        });
      },
      resolvers: {
        normal: {
          plugin: function plugin(name, handler) {
            handler(request, callback);
          },
        },
      },
      options: {
        module: {
          rules: [],
        },
      },
    };
  };

  this.getEventBindings = function getEventBindings() {
    return events;
  };
};
