/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
const { ArgumentParser } = require('argparse');
const fs = require('fs');
const path = require('path');
const yn = require('yn');
const prompt = require('prompt');
const child_process = require('child_process');

const parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'GCTools-NRC Package Helper'
});

const subparsers = parser.addSubparsers({
  title: 'Commands',
  dest: 'command'
});

const parser_component = subparsers.addParser('component', { addHelp: true });
parser_component.addArgument('name',
{
  action: 'store',
  help: 'Name of new component to create.'
}
);

const args = parser.parseArgs();

console.log(parser.description);

const { command, name } = args;
const dir = path.join(__dirname, '..', 'packages', name);
prompt.start();

if (command === 'component') {
  if (name) {
    const exist = fs.existsSync(dir);
    if (exist) {
      console.log('\n');
      console.warn('WARNING: Package by that name already exists.');
      console.warn('If you continue its contents may be overridden');
      console.log('\n');
    }
    prompt
      .message = `New component called '${name}' will be created, continue?`;
    prompt.get([{
      name: 'continue',
      description: 'y/n',
      message: 'Answer yes or no',
      required: true,
      conform: (v) => yn(v) !== null
    }], (err, res) => {
      if (err) throw err;
      if (!yn(res.continue)) {
        console.log('\nAborting.');
        process.exit(0);
      }
      create_component(dir, name);
    });
  }
}

const create_component = (dir, name) => {
  prompt.start();
  prompt
    .message = 'question';
  prompt.get([{
    name: 'description',
    description: '',
    required: false,
  }], (err, res) => {
    if (err) throw err;
    const storyPath = path.join(dir, 'stories');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    if (!fs.existsSync(storyPath)) {
      fs.mkdirSync(storyPath);
    }
    const name_prefix = component_package_template.name;
    const package = Object.assign({}, component_package_template, {
      name: `${name_prefix}${name}`,
      description: res.description
    });
    fs.writeFileSync(
      path.join(dir, 'package.json'),
      JSON.stringify(package, null, 2)
    );
    fs.writeFileSync(
      path.join(dir, '.eslintignore'),
      component_eslintignore_template.join('\n')
    );
    fs.writeFileSync(
      path.join(dir, '.gitignore'),
      component_gitignore_template.join('\n')
    );
    fs.writeFileSync(
      path.join(dir, '.npmignore'),
      component_npmignore_template.join('\n')
    );
    writeSource(path.join(dir, 'index.js'),
      component_index_template, name, res.description);

    // bootstrap all packages
    child_process.spawnSync('lerna', ['bootstrap'], { stdio: 'inherit'});

    // Initialize storybook in the new component
    child_process.spawnSync('yarn', ['add', '@storybook/cli'], { stdio: 'inherit'});
    child_process.spawnSync(
      'getstorybook',
      ['-f'],
      { cwd: dir, stdio: 'inherit' }
    );

    writeSource(path.join(storyPath, 'index.stories.js'),
      component_story_template, name, res.description);

    writeSource(path.join(storyPath, 'index.test.js'),
      component_story_test_template, name, res.description);

    writeSource(path.join(storyPath, '.eslintrc'),
      component_story_eslint, name, res.description);

    // Reset the storybook version to alpha
    fs.writeFileSync(
      path.join(dir, 'package.json'),
      JSON.stringify(package, null, 2)
    );
    child_process.spawnSync('lerna', ['bootstrap'], { stdio: 'inherit'});

    console.log(`\nComponent ${name} has been created.\n\nTo get started:\n`);
    console.log(`cd packages${path.sep}${name}`);
    console.log('yarn storybook\n\n');
  });
}

function writeSource(filename, source, name, description) {
  fs.writeFileSync(
    filename,
    source.replace(
      new RegExp('\\*\\*REPLACE_NAME\\*\\*', 'g'), pascalize(name)
    ).replace(
      new RegExp('\\*\\*REPLACE_DESCRIPTION\\*\\*', 'g'),
      description
    )
  );
}

function pascalize(str) {
  const tmp = str.replace(/(?:^\w|[A-Z]|\b\w|-|\s+)/g, (match, index) => {
    if (/\s+|-/.test(match)) return "";
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
  return tmp.charAt(0).toUpperCase() + tmp.slice(1);
}

const component_package_template = {
  "name": "@gctools-components/",
  "description": "",
  "main": "dist/index.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/gctools-outilsgc/gctools-components.git"
  },
  "scripts": {
    "clean": "rimraf dist",
    "build": "babel index.js -d dist --copy-files",
    "prepare": "npm run clean && npm run build",
    "lint": "eslint .",
    "test": "jest --rootDir . --config ./node_modules/@gctools-components/jest-config/index.js",
    "storybook": "start-storybook -p 6006",
    "build-storybook": "build-storybook"
  },
  "keywords": [
    "gctools",
    "gctoolscomponent"
  ],
  "license": "MIT",
  "peerDependencies": {
    "react": "^16.0.0",
    "react-dom": "^16.0.0",
  },
  "devDependencies": {
    "@storybook/addon-actions": "^3.4.0",
    "@storybook/addon-info": "^3.4.0",
    "@storybook/addon-links": "^3.4.0",
    "@storybook/addon-storyshots": "^3.4.0",
    "@storybook/react": "^3.4.0",

    "babel-cli": "^6.26.0",
    "babel-plugin-transform-runtime": "~6.23.0",
    "babel-eslint": "^8.0.3",
    "babel-plugin-transform-object-rest-spread": "^6.26.0",
    "babel-preset-env": "^1.6.0",
    "babel-preset-react": "^6.24.1",
    "babel-plugin-react-docgen": "~1.8.1",

    "@gctools-components/eslint-config": "^1.0.0",
    "eslint": "^4.12.1",
    "eslint-plugin-import": "^2.7.0",
    "eslint-plugin-jsx-a11y": "^6.0.2",
    "eslint-plugin-react": "^7.4.0",

    "jest": "^21.2.1",
    "@gctools-components/jest-config": "^1.0.0",

    "rimraf": "^2.6.2",
  },
  "dependencies": {
    "react": "^16.0.0",
    "react-dom": "^16.0.0",
    "material-ui": "^0.19.4",
    "prop-types": "^15.6.0"
  },
  "babel": {
    "presets": ["env", "react"],
    "plugins": [
      "babel-plugin-transform-runtime",
      "transform-object-rest-spread",
      ["react-docgen", {
        "includeMethods": true
      }]
    ]
  },
  "eslintConfig": {
    "extends": "@gctools-components",
    "root": true
  }
}

const component_eslintignore_template = ['dist', 'coverage'];
const component_gitignore_template = ['dist', 'coverage', 'jest.json'];
const component_npmignore_template = ['*', '!dist/**', '!README.md'];

const component_index_template = `import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';

/**
 * **REPLACE_DESCRIPTION**
 */
class **REPLACE_NAME** extends Component {
  constructor() {
    super();
    this.state = {
      stateTest: null,
    };
  }
  render() {
    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div>
            <h1>**REPLACE_NAME**</h1>
            <p>
              **REPLACE_DESCRIPTION**
            </p>
            <h3>{this.props.test}</h3>
            <h4>{this.state.stateTest}</h4>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

**REPLACE_NAME**.defaultProps = {
  test: 'prop test',
};

**REPLACE_NAME**.propTypes = {
  /** This is an example prop called "test". */
  test: PropTypes.string,
};

export default **REPLACE_NAME**;

`;

const component_story_template = `
import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import **REPLACE_NAME** from '../index';

storiesOf('**REPLACE_NAME**', module)
  .add(
    'Default options',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <**REPLACE_NAME** />
      </div>
    )),
  );

`;

const component_story_test_template = `
import initStoryshots from '@storybook/addon-storyshots';

initStoryshots();
`;

const component_story_eslint = `
{
  "rules": {
    "import/no-extraneous-dependencies": 0
  }
}
`;
