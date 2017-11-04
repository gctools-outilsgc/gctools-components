/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */

import Jed from 'jed';

const { Promise } = require('es6-promise');

const objectAssign = require('object-assign');

/**
 * Javascript in-browser object reponsible for loading language files,
 * switching languages, and language change notification.
 *
 * By default this object binds to the global window object as window.localizer
 * so it can interact with other libraries that may have been bundled using
 * this plugin.
 */
export class Localizer {
  constructor(config) {
    this.lang = null;
    this.domains = {};
    this.ready = {};
    this.languageChangeCallbacks = [];
    const defaultAvailableLanguages = ['en_CA'];
    const defaultConfig = {
      window_global: 'localizer',
      availableLanguages: defaultAvailableLanguages,
      language: window.navigator.userLanguage
        || window.navigator.language || defaultAvailableLanguages[0],
    };
    defaultConfig.language = defaultConfig.language.replace('-', '_');
    this.config = defaultConfig;
    this.domainsReady = this.domainsReady.bind(this);
    this.applyConfig(config);
  }

  applyConfig(config) {
    this.config = objectAssign(this.config, config);
    if (this.config.availableLanguages.length === 0) {
      throw new Error('Localizer needs some languages.');
    }
    if (!this.hasLanguage(this.config.language)) {
      [this.config.language] = this.config.availableLanguages;
    }
    this.setLanguage(this.config.language);
  }

  /**
   * Determines if the speicifed language is supported.
   * @param lang 'en_US' | 'fr_CA' | ...
   */
  hasLanguage(lang) {
    return this.config.availableLanguages.indexOf(lang) !== -1;
  }

  /**
   * Sets the current language.
   * @param lang Locale code 'en_US' | 'fr_CA' | ...
   */
  setLanguage(lang) {
    const language = lang.replace('-', '_');
    if (this.hasLanguage(language)) {
      this.lang = language;
      Object.keys(this.domains).forEach((l) => {
        if (l !== language) {
          Object.keys(this.domains[l]).forEach((d) => {
            if ({}.hasOwnProperty.call(this.domains[l], d)) {
              this.registerDomain(d);
            }
          });
        }
      });
      this.callLanguageChangeCallbacks();
    } else {
      throw new Error('Specified language is not available.');
    }
  }

  /**
   * Internal method used to initialize Jed with the currently known domains
   * and languages.
   *
   * @private
   */
  _initializeJed() {
    this.i18n = new Jed({
      // This callback is called when a key is missing
      missing_key_callback: function missingKeyCallback(key) {
        throw new Error(`ERROR: specified key does not exists: ${key}`);
      },
      locale_data: this.domains[this.lang],
    });
  }

  /**
   * Register the given domain with the localizer.  The appropriate translation
   * files will be automatically loaded.
   *
   * @param domain The filename that uses the term.
   */
  registerDomain(domain) {
    if (this.ready[domain]) return this.ready[domain];
    const self = this;
    this.ready[domain] = new Promise((resolve, reject) => {
      // eslint-disable-next-line
      require('./language.loader.js!./<I18nWebpackPlugin>')(
        self.lang, domain, (translations) => {
          if (
            translations
            && translations.locale_data
            && translations.locale_data.messages
          ) {
            if (!self.domains[self.lang]) {
              self.domains[self.lang] = {};
            }
            // eslint-disable-next-line no-param-reassign
            translations.locale_data.messages[''].domain = domain;
            self.domains[self.lang][domain] =
              translations.locale_data.messages;
            self._initializeJed(); // eslint-disable-line no-underscore-dangle
            resolve();
          } else {
            reject();
          }
          delete self.ready[domain];
        });
    });
    return this.ready[domain];
  }

  domainsReady() {
    const ar = [];
    Object.keys(this.ready).forEach((i) => {
      if ({}.hasOwnProperty.call(this.ready, i)) {
        ar.push(this.ready[i]);
      }
    });
    return Promise.all(ar);
  }

  onLanguageChange(callback) {
    if (this.languageChangeCallbacks.indexOf(callback) < 0) {
      this.languageChangeCallbacks.push(callback);
    }
    return {
      remove: () => {
        const idx = this.languageChangeCallbacks.indexOf(callback);
        if (idx >= 0) {
          this.languageChangeCallbacks.splice(idx, 1);
        }
      },
    };
  }

  callLanguageChangeCallbacks() {
    for (let x = 0; x < this.languageChangeCallbacks.length; x += 1) {
      this.languageChangeCallbacks[x](this.lang);
    }
  }

  translate(domain, str, val) {
    if (!this.domains[this.lang] || !this.domains[this.lang][domain]) {
      return str;
    }
    if (typeof val !== 'undefined') {
      const num = val * 1;
      return this.i18n.translate.apply(this.i18n, [str])
        .onDomain(domain || 'messages')
        .ifPlural(num, '')
        .fetch(num);
    }
    return this.i18n.translate.apply(this.i18n, [str])
      .onDomain(domain || 'messages')
      .fetch();
  }

  interpolate(domain, str, ...args) {
    if (!this.domains[this.lang] || !this.domains[this.lang][domain]) {
      return str;
    }
    return this.i18n.translate.apply(this.i18n, [str])
      .onDomain(domain || 'messages')
      .fetch(...args);
  }
}

let localizerInstance = null;

const localizer = (config) => {
  if (localizerInstance !== null) {
    return localizerInstance;
  }
  if (window.localizer && window.localizer instanceof Localizer) {
    return window.localizer;
  }
  localizerInstance = new Localizer(config);
  if (config.window_global) {
    window[config.window_global] = localizerInstance;
  }
  return localizerInstance;
};

export default localizer;
