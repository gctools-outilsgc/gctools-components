/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 *
 *
 * Build po files
 * This file invokes the Python module "pot-builder" to create or update
 * .po files based on the .pot files in the i18n directory.
 *
 * It should be invoked via npm run build:locale from the webapp folder.
 */

/* eslint-disable no-console */

const virtualenv = require('virtualenv');
const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');
const md5File = require('md5-file');

const packagePath = require.resolve('../package.json');
const env = virtualenv(packagePath);

/**
 * Using `virtualenv` spawn the included pot-builder python module to generate
 * or update .po files based on the supplied .pot files.
 *
 * @param { path: string, filename: string, languages: Array<string> } config
 */
export default function buildPo(config) {
  // TODO: submit MR to virtualenv to support spawnsync
  const pathToVirtualenvPython = path.join(
    env._virtualenvHome, // eslint-disable-line no-underscore-dangle
    'bin',
    'python',
  );

  const args = ['-m', 'build'];
  args.push(JSON.stringify(config));

  const output = childProcess.spawnSync(pathToVirtualenvPython, args);
  if (output.status !== 0) {
    console.log('An error has occured trying to build the .po files.');
    if (output.stderr) {
      console.log(output.stderr.toString());
    }
    if (output.error) {
      console.log(output.error);
      throw new Error(output.error);
    }
  }
  if (output.stdout) {
    console.log(output.stdout.toString());
  }
}

// Generate an object hash for each PO file...
// TODO: doesn't webpack do this?
export const buildPotHash = (i18nDir) => {
  const generateHash = (dir) => {
    const files = fs.readdirSync(dir);
    let potHash = {};
    Object.keys(files).forEach((f) => {
      const filename = path.join(dir, files[f]);
      if (filename.indexOf('.pot') > 2) {
        potHash[filename] = md5File.sync(filename);
      } else if (fs.statSync(filename).isDirectory()) {
        potHash = Object.assign(
          generateHash(filename),
          potHash,
        );
      }
    });
    return potHash;
  };
  return generateHash(i18nDir);
};

/**
 * Test if the specified directory exists, if not create it.
 * @param string i18nDir Directory to test
 */
export const ensureDirExists = (i18nDir) => {
  if (!fs.existsSync(i18nDir)) {
    const { sep } = path;
    const initDir = path.isAbsolute(i18nDir) ? sep : '';
    i18nDir.split(sep).reduce((parentDir, childDir) => {
      const curDir = path.resolve(parentDir, childDir);
      if (!fs.existsSync(curDir)) {
        fs.mkdirSync(curDir);
      }
      return curDir;
    }, initDir);
  }
};

/**
 * Scan all the .pot files to determine what .po files needs to be rebuilt.
 *
 * @param string i18nDir Directory where .pot files can be found
 * @param Array<String> potFiles Previous hash values to compare against
 * @param Array<String> languages Languages to build for
 */
export const buildPoFiles = (i18nDir, potFiles, languages) => {
  const currentHash = buildPotHash(i18nDir);
  // If the .pot files were changed, rebuild the .po files.
  if (JSON.stringify(currentHash) !== JSON.stringify(potFiles)) {
    Object.keys(currentHash).forEach((y) => {
      if (!potFiles[y] || potFiles[y] !== currentHash[y]) {
        const filename =
          path.relative(path.join(i18nDir, 'templates'), y);
        buildPo({
          path: i18nDir,
          languages,
          filename,
        });
      }
    });
    return buildPotHash(i18nDir);
  }
  return currentHash;
};

/**
 * The gettext-loader module requires a file at the root of the project to
 * function.  This method creates that file, and later deletes it.
 *
 * @param {*} rootDir Root directory of project
 * @param {*} i18nDir Location of i18n files
 * @returns { remove: () => void } Method that can be used to delete the file.
 */
export const createGettextConfig = (rootDir, i18nDir) => {
  // Create the gettext-loader config file.
  // TODO: Yuck.
  const gtcFilename = path.join(rootDir, 'gettext.config.js');
  const outputPath =
    `${path.join(i18nDir, 'templates', '[filename].pot')}`;
  const gtcConfig = [
    'module.exports = {',
    '  methods: [\'__\', \'translate\'],',
    `  output: '${outputPath}',`,
    '  header_prefix: \'msgid ""\\nmsgstr ""\',',
    '  header: {',
    '    \'Language\': \'en\\\\n\',',
    '    \'Plural-Forms\': \'nplurals=2; plural=(n != 1);\\\\n\',',
    '    \'MIME-Version\': \'1.0\\\\n\',',
    '    \'Content-Type\': \'text/plain; charset=UTF-8\\\\n\',',
    '    \'Content-Transfer-Encoding\': \'8bit\\\\n\'',
    '  }',
    '};',
  ];

  fs.writeFileSync(gtcFilename, gtcConfig.join('\n'));

  return {
    remove: () => {
      try {
        fs.accessSync(gtcFilename);
        fs.unlinkSync(gtcFilename);
        // eslint-disable-next-line
      } catch (ex) { }
    },
  };
};
