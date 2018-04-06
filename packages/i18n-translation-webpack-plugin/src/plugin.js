/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */

import ConstDep from 'webpack/lib/dependencies/ConstDependency';
import NullFactory from 'webpack/lib/NullFactory';
import ParserHelpers from 'webpack/lib/ParserHelpers';

import I18nNormalModuleFactory from './I18nNormalModuleFactory';
import I18nDep from './I18nDependency';
import I18nIdep from './I18nInterpolatedDependency';

import {
  buildPoFiles,
  buildPotHash,
  ensureDirExists,
  createGettextConfig
} from './po-builder';

const path = require('path');

/**
 * I18N Translation Webpack plugin
 *
 * Provides automatic creation of familiar gettext based translation files,
 * while automatically injecting the translation strings into your application
 * bundle.  Various levels of code splitting are supported.
 *
 */

class I18nTranslationWebpackPlugin {
  constructor(options) {
    this.pot_files = {};
    this.options = Object.assign({
      languages: ['en_CA', 'fr_CA'],
      i18n_dir: 'i18n',
      extract_text_test: /\.(js|jsx)$/,
      extract_text_exclude: /node_modules/,
      codeSplitting: 'language',
      translate_global: '__',
      interpolate_global: '___',
      localizer_global: 'localizer',
      localizer_window: false,
    }, options);
  }

  apply(compiler) {
    const context = compiler.context || process.cwd();

    const i18nDir = path.join(context, this.options.i18n_dir);
    ensureDirExists(i18nDir);
    this.pot_files = buildPotHash(i18nDir);
    this.gtc_config = createGettextConfig(context, this.options.i18n_dir);

    if (!compiler.options.module.rules) {
      // eslint-disable-next-line no-param-reassign
      compiler.options.module.rules = [];
    }
    compiler.options.module.rules.push({
      test: this.options.extract_text_test,
      use: { loader: 'gettext-loader' },
      exclude: this.options.extract_text_exclude,
    });

    compiler.plugin('done', () => {
      if (this.gtc_config) {
        this.gtc_config.remove();
        delete this.gtc_config;
      }
    });

    compiler.plugin('compilation', (compilation, params) => {
      const { normalModuleFactory } = params;
      const i18nFactory = new I18nNormalModuleFactory(normalModuleFactory);

      compilation.dependencyFactories.set(I18nDep, i18nFactory);
      compilation.dependencyFactories.set(I18nIdep, i18nFactory);
      compilation.dependencyFactories.set(ConstDep, new NullFactory());

      compilation.dependencyTemplates.set(I18nDep, new I18nDep.Template());
      compilation.dependencyTemplates.set(I18nIdep, new I18nIdep.Template());
      compilation.dependencyTemplates.set(ConstDep, new ConstDep.Template());

      compilation.plugin('build-module', () => {
        const {
          translate_global: name,
          interpolate_global: interpolate,
        } = this.options;
        const interpolateReplaces = [];
        params.normalModuleFactory.plugin('parser', (parser) => {
          parser.plugin(`call ${name}`, function I18nTranslate(expr) {
            const ikey = (interpolateReplaces.indexOf(expr.range[0]) >= 0);
            const { resource } = parser.state.module;
            let dep = false;
            if (expr.arguments.length === 1) {
              const [arg] = expr.arguments;
              const key = this.evaluateExpression(arg).string;
              const domain = path.relative(context, resource);
              dep = new I18nDep(expr, key, domain, undefined, ikey);
              dep.loc = expr.loc;
            } else if (expr.arguments.length === 2) {
              const [arg1, arg2] = expr.arguments;
              const key = this.evaluateExpression(arg1).string;
              const value = this.evaluateExpression(arg2).number;
              const domain = path.relative(context, resource);
              dep = new I18nDep(expr, key, domain, value, ikey);
              dep.loc = expr.loc;
            }
            if (dep) this.state.current.addDependency(dep);
            return true;
          });
          parser.plugin(`call ${interpolate}`, function I18nInterpolated(ex) {
            const { resource } = parser.state.module;
            if (ex.arguments.length > 1) {
              const domain = path.relative(context, resource);
              const dep = new I18nIdep(ex, name, domain);
              dep.loc = ex.loc;
              this.state.current.addDependency(dep);
              const findLocalizedKey = (node) => {
                if (node.type === 'CallExpression') {
                  if (node.callee.name === dep.tglobal) {
                    interpolateReplaces.push(node.callee.range[0]);
                  }
                  if (node.arguments) {
                    for (let x = 0; x < node.arguments.length; x += 1) {
                      findLocalizedKey(node.arguments[x]);
                    }
                  }
                }
              };
              findLocalizedKey(dep.expr.arguments[0]);
            }
            return false;
          });

          const {
            localizer_global: loc,
            languages: availableLanguages,
          } = this.options;

          parser.plugin(
            `expression ${loc}`,
            function I18nGlobal(expr) {
              const pathToLocalizer = path.join(__dirname, 'localizer.js');
              const config = { availableLanguages };

              const ex = `
                require(${JSON.stringify(pathToLocalizer)}).default(
                  ${JSON.stringify(config)}
                )
              `;
              if (!ParserHelpers.addParsedVariableToModule(this, loc, ex)) {
                return false;
              }
              ParserHelpers.toConstantDependency(loc).bind(this)(expr);
              return true;
            },
          );
        });
      });
    });

    compiler.plugin('after-resolvers', () => {
      compiler.resolvers.normal.plugin('resolve', (request, callback) => {
        if (request.request === './<I18nWebpackPlugin>') {
          this.pot_files = buildPoFiles(
            path.join(context, this.options.i18n_dir),
            this.pot_files,
            this.options.languages,
          );

          const filename = path.join(__dirname, 'localizer.js');

          callback(null, {
            path: filename,
            module: true,
            file: false,
            resolved: true,
          });
        } else {
          callback();
        }
      });
    });
  }
}

module.exports = I18nTranslationWebpackPlugin;
