/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */

const fs = require('fs');
const path = require('path');
const Plugin = require('./plugin');


/**
 * Loader responsible for injecting language data into bundle, and for code
 * splitting.
 */
module.exports = function I18nWebpackLoader() {
  if (this.cacheable) {
    this.cacheable();
  }
  const validCodeSplitting = [
    'language', 'domain', 'language+domain', 'all', 'none',
  ];

  let options = {};
  this.options.plugins.forEach((p) => {
    if (p instanceof Plugin) {
      [{ options }] = [p];
    }
  });

  const { languages } = options;
  const { context } = this._compiler;
  const root = path.join(context, options.i18n_dir);

  if (!options.codeSplitting
    || validCodeSplitting.indexOf(options.codeSplitting) === -1) {
    options.codeSplitting = 'language';
  }

  let requires = [];
  requires = [
    'module.exports = function(lang, domain, cb) {\n',
  ];

  Object.keys(languages).forEach((l) => {
    const lang = languages[l];
    const filepath = path.join(root, `${lang}/LC_MESSAGES`);

    requires = requires.concat([
      `  if (lang == '${lang}') {\n`,
    ]);

    if (options.codeSplitting === 'none') {
      requires = requires.concat([
        `  var req = require.context('${root}', true, /.*\\.po$/);\n`,
        `  cb(req('${filepath}/' + domain + '.po'));`,
      ]);
    } else if (options.codeSplitting === 'all') {
      requires = requires.concat([
        '  require.ensure([], function(require) {\n',
        `    cb(require('${root}' + lang + '/LC_MESSAGES/'`,
        '     + domain + \'.po\'));\n',
        '  });\n',
      ]);
    } else if (options.codeSplitting === 'language') {
      // code split by language
      const chunk = `/* webpackChunkName: "${lang}" */ `;
      const loader = '!json-loader!po-loader?format=jed1.x!';
      requires = requires.concat([
        `import(${chunk} '${loader}${filepath}/'+domain+'.po').then(cb);`,
      ]);
    } else if (options.codeSplitting === 'domain') {
      // code split by domain
      const poFiles = fs
        .readdirSync(path.join(root, filepath))
        .filter(file => (file.indexOf('.po') > 2));
      Object.keys(poFiles).forEach((po) => {
        const domain = poFiles[po].slice(0, -3);
        requires = requires.concat([
          `    if (domain == '${domain}') {\n`,
          '      require.ensure([], function(require) {\n',
          `      var req = require.context('${root}',true,/\\.\\/${lang}`,
          `\\/LC_MESSAGES\\/${domain.replace('.', '\\.')}\\.po/);\n`,
          `        cb(req('${path.join(filepath, domain)}' + '.po'`,
          '));\n',
          `      }, '${domain}');\n`,
          '    }\n',
        ]);
      });
    } else if (options.codeSplitting === 'language+domain') {
      // code split by domain AND language.
      const poFiles = fs
        .readdirSync(path.join(root, filepath))
        .filter(file => (file.indexOf('.po') > 2));
      const co = `${root}${path.sep}${lang}/LC_MESSAGES/`;
      Object.keys(poFiles).forEach((po) => {
        const domain = poFiles[po].slice(0, -3);
        requires = requires.concat([
          `    if (domain == '${domain}') {\n`,
          '      require.ensure([], function(require) {\n',
          `      var req = require.context('${co}', `,
          `false, /\\.\\/${domain.replace('.', '\\.')}\\.po/);\n`,
          `        cb(req('./${domain}' + '.po'`,
          '));\n',
          `      }, '${lang}-${domain}');\n`,
          '    }\n',
        ]);
      });
    }
    requires = requires.concat([
      '  }\n',
    ]);
  });

  requires = requires.concat(['}']);
  return requires.join('');
};
