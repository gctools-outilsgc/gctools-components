/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */

/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';

import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

const cl = require('country-language');
/**
 * The language selector component is a simple drop down list allowing the end
 * user to choose a language.
 *
 * The list of languages is read directly from the localization service made
 * available by using `i18n-translation-webpack-plugin`. When a user chooses a
 * language, that localization service is updated and notifies any listeners
 * automatically.
 *
 */
class LanguageSelector extends Component {
  static getLanguageName(code) {
    const cs = code.split('_');
    if (cs.length === 2) {
      const [languageCode, countryCode] = cs;
      const language = cl.getLanguage(languageCode);
      const country = cl.getCountry(countryCode);
      if (language.nativeName && country.name) {
        return `${language.nativeName[0]} - ${country.name}`;
      }
    }
    return code;
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div>
          <SelectField
            id="gctools-nrc-language-selector"
            value={this.state.lang}
            labelStyle={this.props.labelStyle}
            selectedMenuItemStyle={this.props.selectedLanguageStyle}
            menuItemStyle={this.props.languageItemStyle}
            onChange={(e, idx, lang) => {
              localizer.setLanguage(lang);
            }}
          >
            {localizer.config.availableLanguages.map(langCode => (
              <MenuItem
                value={langCode}
                key={`languageSelectorLang_${langCode}`}
                primaryText={LanguageSelector.getLanguageName(langCode)}
              />))
            }
          </SelectField>
        </div>
      </MuiThemeProvider>
    );
  }
}

LanguageSelector.defaultProps = {
  labelStyle: {},
  selectedLanguageStyle: {},
  languageItemStyle: {},
};

LanguageSelector.propTypes = {
  /** Style applied to the select box label. */
  labelStyle: PropTypes.object,
  /** Style applied to the selected language in the list. */
  selectedLanguageStyle: PropTypes.object,
  /** Style applied to each language in the list. */
  languageItemStyle: PropTypes.object,
};

export default LocalizedComponent(LanguageSelector);
