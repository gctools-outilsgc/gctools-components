/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */

/* eslint-disable no-use-before-define */
import ConstDep from 'webpack/lib/dependencies/ConstDependency';
import NullFactory from 'webpack/lib/NullFactory';

import I18nDep from '../src/I18nDependency';
import I18nIdep from '../src/I18nInterpolatedDependency';
import I18nNormalModuleFactory from '../src/I18nNormalModuleFactory';
import { typical, plural, interpolate } from './fixtures/expr';
import { getCompilation, getParams } from './Compiler';

const should = require('should');
const sinon = require('sinon');

const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

const PluginEnvironment = require('./PluginEnvironment');
const I18nTranslationWebpackPlugin = require('../src/plugin');

const OUTPUT_DIR = path.join(__dirname, 'output');
const I18N_DIR = 'test/fixtures/i18n';
const pathToPotFixture = path.join(__dirname, 'fixtures', 'test.js.pot');
const pathToPo = [
  path
    .join(__dirname, 'fixtures', 'i18n', 'en_CA', 'LC_MESSAGES', 'test.js.po'),
  path
    .join(__dirname, 'fixtures', 'i18n', 'fr_CA', 'LC_MESSAGES', 'test.js.po'),
];

const pathToLocalizer = path.join(__dirname, '..', 'src', 'localizer.js');
const pathToI18nLoader = path.join(__dirname, '..', 'src', 'i18n.loader.js');
const pathToGetTextConfig = path.join(__dirname, '..', 'gettext.config.js');

function cleanUp(done) {
  rimraf(OUTPUT_DIR, () => {
    rimraf(I18N_DIR, () => {
      fs.exists(pathToGetTextConfig, (exist) => {
        if (exist) {
          fs.unlink(pathToGetTextConfig, done);
        } else {
          done();
        }
      });
    });
  });
}

describe('I18nTranslationWebpackPlugin', () => {
  beforeEach((done) => {
    cleanUp(done);
  });

  afterEach((done) => {
    cleanUp(done);
  });

  describe('when applied', () => {
    it('should create the i18n folder when missing', (done) => {
      buildPluginWithParams({ i18n_dir: I18N_DIR });
      fs.exists(I18N_DIR, (exist) => {
        should(exist).be.exactly(true);
        done();
      });
    });

    it('should continue without error if the i18n folder exists', (done) => {
      fs.mkdir(I18N_DIR, () => {
        buildPluginWithParams({ i18n_dir: I18N_DIR });
        fs.exists(I18N_DIR, (exist) => {
          should(exist).be.exactly(true);
          done();
        });
      });
    });

    it('should create a gettext.config.js file', (done) => {
      buildPluginWithParams({ i18n_dir: I18N_DIR });
      fs.exists(pathToGetTextConfig, (exist) => {
        should(exist).be.exactly(true);
        done();
      });
    });

    describe('when done is called', () => {
      it('should delete the gettext.config.js file', (done) => {
        const object = buildPluginWithParams({ i18n_dir: I18N_DIR });
        object.done.handler();
        fs.exists(pathToGetTextConfig, (exist) => {
          should(exist).be.exactly(false);
          done();
        });
      });
    });

    describe('when after resolvers is called', () => {
      it('should replace ./<I18nWebpackPlugin> with localizer.js', () => {
        const object = buildPluginWithParams({ i18n_dir: I18N_DIR });

        const x = (_, result) => {
          should(result.path).be.exactly(pathToLocalizer);
          should(result.module).be.exactly(true);
          should(result.file).be.exactly(false);
          should(result.resolved).be.exactly(true);
        };
        const spy = sinon.spy(x);

        object.afterResolvers.handler({
          request: './<I18nWebpackPlugin>',
        }, spy);

        should(spy.called).be.exactly(true);
      });
      it('should generate .po files', (done) => {
        const object = buildPluginWithParams({ i18n_dir: I18N_DIR });
        fs.mkdir(path.join(I18N_DIR, 'templates'), () => {
          const readableStream = fs.createReadStream(pathToPotFixture);
          const writableStream = fs.createWriteStream(path.join(
            I18N_DIR,
            'templates',
            'test.js.pot',
          ));
          readableStream.pipe(writableStream);
          readableStream.on('end', () => {
            const x = () => {
              fs.exists(pathToPo[0], (exist) => {
                exist.should.be.exactly(true);
                fs.exists(pathToPo[1], (exist2) => {
                  exist2.should.be.exactly(true);
                  done();
                });
              });
            };

            const spy = sinon.spy(x);
            mute();
            object.afterResolvers.handler({
              request: './<I18nWebpackPlugin>',
            }, spy);
            unmute();
            should(spy.called).be.exactly(true);
          });
          readableStream.on('error', (err) => {
            throw err;
          });
        });
      });
    });

    describe('when compilation called', () => {
      it('should register dependency factories and templates', () => {
        const object = buildPluginWithParams({ i18n_dir: I18N_DIR });

        const x = (a, b) => {
          a.should.be.oneOf(I18nDep, I18nIdep, ConstDep);
          if ((a === I18nDep) || (a === I18nIdep)) {
            b.should.be.instanceOf(I18nNormalModuleFactory);
          } else {
            b.should.be.instanceOf(NullFactory);
          }
        };
        const spy = sinon.spy(x);
        const y = (a, b) => {
          a.should.be.oneOf(I18nDep, I18nIdep, ConstDep);
          if (a === I18nDep) {
            b.should.be.instanceOf(I18nDep.Template);
          } else if (a === I18nIdep) {
            b.should.be.instanceOf(I18nIdep.Template);
          } else {
            b.should.be.instanceOf(ConstDep.Template);
          }
        };
        const spy2 = sinon.spy(y);

        const compilation = getCompilation({ depF: spy, depT: spy2 });
        const params = getParams();

        object.compilation.handler(compilation, params);
        should(spy.called).be.exactly(true);
        should(spy2.called).be.exactly(true);
      });

      it('should replace the translate function', () => {
        const object = buildPluginWithParams({ i18n_dir: I18N_DIR });
        const plug = (name) => {
          name.should.be.equalOneOf('javascript/auto', 'javascript/dynamic');
        };
        const plugSpy = sinon.spy(plug);
        const parserPlug = (name, callbackResult) => {
          name.should.be.exactly('__');
          callbackResult.should.be.exactly(true);
        };
        const parserPlugSpy = sinon.spy(parserPlug);
        const addDependency = (dep) => {
          dep.should.be.instanceOf(I18nDep);
          dep.request.should.containEql('&domain=test_domain');
          dep.request.should.startWith(pathToI18nLoader);
          dep.request.should.containEql('?key=test_string');
          dep.request.should.endWith('!./<I18nWebpackPlugin>');
          dep.request.should.be.exactly(dep.userRequest);
          dep.key.should.be.exactly('test_string');
          dep.domain.should.be.exactly('test_domain');
          should(dep.value).be.exactly(undefined);
          dep.ikey.should.be.exactly(false);
          dep.loc.should.be.eql({
            start: { line: 16, column: 13 },
            end: { line: 16, column: 36 },
          });
        };
        const addDependencySpy = sinon.spy(addDependency);

        const compilation = getCompilation();
        const params = getParams({
          normalModuleFactoryPlug: plugSpy,
          parserPlug: parserPlugSpy,
          evaluate: () => ({
            string: 'test_string',
            number: 5,
          }),
          addDep: addDependencySpy,
          domain: 'test_domain',
          expr: typical,
          parserStatements: ['__'],
        });

        object.compilation.handler(compilation, params);
        plugSpy.called.should.be.exactly(true);
        parserPlugSpy.called.should.be.exactly(true);
        addDependencySpy.called.should.be.exactly(true);
      });

      it('should handle plural forms', () => {
        const object = buildPluginWithParams({ i18n_dir: I18N_DIR });
        const plug = (name) => {
          name.should.be.equalOneOf('javascript/auto', 'javascript/dynamic');
        };
        const plugSpy = sinon.spy(plug);
        const parserPlug = (name, callbackResult) => {
          name.should.be.exactly('__');
          callbackResult.should.be.exactly(true);
        };
        const parserPlugSpy = sinon.spy(parserPlug);
        const addDependency = (dep) => {
          dep.should.be.instanceOf(I18nDep);
          dep.request.should.containEql('&domain=test_domain');
          dep.request.should.startWith(pathToI18nLoader);
          dep.request.should.containEql('?key=test_string');
          dep.request.should.endWith('!./<I18nWebpackPlugin>');
          dep.request.should.be.exactly(dep.userRequest);
          dep.key.should.be.exactly('test_string');
          dep.domain.should.be.exactly('test_domain');
          should(dep.value).be.exactly(5);
          dep.ikey.should.be.exactly(false);
          dep.loc.should.be.eql({
            start: { line: 308, column: 8 },
            end: { line: 308, column: 30 },
          });
        };
        const addDependencySpy = sinon.spy(addDependency);

        const compilation = getCompilation();
        const params = getParams({
          normalModuleFactoryPlug: plugSpy,
          parserPlug: parserPlugSpy,
          parserStatements: ['__'],
          evaluate: () => ({
            string: 'test_string',
            number: 5,
          }),
          addDep: addDependencySpy,
          domain: 'test_domain',
          expr: plural,
        });

        object.compilation.handler(compilation, params);
        plugSpy.called.should.be.exactly(true);
        parserPlugSpy.called.should.be.exactly(true);
        addDependencySpy.called.should.be.exactly(true);
      });

      it('should replace the interpolate function', () => {
        const object = buildPluginWithParams({ i18n_dir: I18N_DIR });
        const plug = (name) => {
          name.should.be.equalOneOf('javascript/auto', 'javascript/dynamic');
        };
        const plugSpy = sinon.spy(plug);
        const parserPlug = (name, callbackResult) => {
          name.should.be.exactly('___');
          callbackResult.should.be.exactly(false);
        };
        const parserPlugSpy = sinon.spy(parserPlug);
        const addDependency = (dep) => {
          dep.should.be.instanceOf(I18nIdep);
          dep.request.should.containEql('?domain=test_domain');
          dep.request.should.startWith(pathToI18nLoader);
          dep.request.should.endWith('!./<I18nWebpackPlugin>');
          dep.request.should.be.exactly(dep.userRequest);
          dep.domain.should.be.exactly('test_domain');
          dep.loc.should.be.eql({
            start: { line: 405, column: 8 },
            end: { line: 405, column: 60 },
          });
        };
        const addDependencySpy = sinon.spy(addDependency);

        const compilation = getCompilation();
        const params = getParams({
          normalModuleFactoryPlug: plugSpy,
          parserPlug: parserPlugSpy,
          parserStatements: ['___'],
          evaluate: () => ({
            string: 'test_string',
            number: 5,
          }),
          addDep: addDependencySpy,
          domain: 'test_domain',
          expr: interpolate,
        });

        object.compilation.handler(compilation, params);
        plugSpy.called.should.be.exactly(true);
        parserPlugSpy.called.should.be.exactly(true);
        addDependencySpy.called.should.be.exactly(true);
      });
    });
  });
});

const buildPluginWithParams = (config, context) => {
  const instance = new I18nTranslationWebpackPlugin(config);

  const pluginEnvironment = new PluginEnvironment(context);
  instance.apply(pluginEnvironment.getEnvironmentStub());

  pluginEnvironment.getEventBindings().length.should.be.exactly(3);

  const [
    done,
    compilation,
    afterResolvers] = pluginEnvironment.getEventBindings();

  return {
    done,
    compilation,
    afterResolvers,
  };
};

const stdOutWrite = process.stdout.write;
const stdErrWrite = process.stderr.write;

function mute() {
  process.stderr.write = (chunk, encoding, callback) => {
    callback();
  };
  process.stdout.write = (chunk, encoding, callback) => {
    callback();
  };
}

function unmute() {
  process.stdout.write = stdOutWrite;
  process.stderr.write = stdErrWrite;
}
