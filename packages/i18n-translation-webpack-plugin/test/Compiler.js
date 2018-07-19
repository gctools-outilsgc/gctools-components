/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */

export const getCompilation = (calls) => {
  const callbacks = Object.assign({
    depF: () => {},
    depT: () => {},
    plug: () => {},
  }, calls);
  const { depF, depT } = callbacks;
  const compilation = {
    dependencyFactories: { set: depF },
    dependencyTemplates: { set: depT },
  };
  return compilation;
};

export const getParams = (calls) => {
  const callbacks = Object.assign({
    normalModuleFactoryPlug: () => {},
    parserPlug: () => {},
    evaluate: () => ({ string: '', number: 0 }),
    addDep: () => {},
    domain: 'test_domain',
    parserStatements: [],
    expr: {},
  }, calls);
  const {
    normalModuleFactoryPlug, parserPlug,
    evaluate, addDep, domain, expr, parserStatements,
  } = callbacks;
  const parserAddState = {
    current: {
      addDependency: addDep,
    },
  };
  const parser = {
    evaluateExpression: evaluate,
    hooks: {
      call: {
        for: name => ({
          tap: (_, callback) => {
            if (parserStatements.indexOf(name) >= 0) {
              Object.assign(parser.state, parser.state, parserAddState);
              parserPlug(name, callback(expr));
            }
          },
        }),
      },
      expression: {
        for: () => ({
          tap: () => {},
        }),
      },
    },
    plugin: (name, callback) => {
      if (parserStatements.indexOf(name) >= 0) {
        const parsedObject = {
          evaluateExpression: evaluate,
          state: {
            current: {
              addDependency: addDep,
            },
          },
        };
        const bound = callback.bind(parsedObject);
        parserPlug(name, bound(expr));
      }
    },
    state: {
      module: {
        resource: domain,
      },
    },
  };
  const params = {
    normalModuleFactory: {
      hooks: {
        parser: {
          for: name => ({
            tap: (_, callback) => {
              normalModuleFactoryPlug(name);
              callback(parser);
            },
          }),
        },
      },
      plugin: (name, callback) => {
        normalModuleFactoryPlug(name);
        callback(parser);
      },
    },
  };
  return params;
};
