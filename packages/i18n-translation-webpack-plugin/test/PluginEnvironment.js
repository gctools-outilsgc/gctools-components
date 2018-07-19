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
    const tappable = {
      tap: function plugin(name, handler) {
        events.push({
          name,
          handler: (req, cb) => {
            request = req;
            callback = cb;
            handler(req, cb);
          },
        });
      },
    };
    return {
      context,
      hooks: {
        done: tappable,
        compilation: tappable,
        afterResolvers: tappable,
      },
      resolverFactory: {
        hooks: {
          resolver: {
            for: () => ({
              tap: (_, cb) => {
                cb({
                  hooks: {
                    resolve: {
                      tapAsync: (name, callb) => {
                        callb(request, name, callback);
                      },
                    },
                  },
                });
              },
            }),
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
