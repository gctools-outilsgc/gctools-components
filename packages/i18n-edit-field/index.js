import React, { Component } from 'react';
import { Label, Input, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import 'semantic-ui-css/semantic.min.css';
import './css/style.css';

/**
 * Editable label that turns into 2 text boxes upon entering edit mode. One
 * text box for English and one for French. The label (when not in edit mode)
 * displays the value from the currently selected language.
 */
class I18nEditField extends Component {
  constructor() {
    super();
    this._handleChange = this._handleChange.bind(this);
  }

  _handleChange(e, data) {
    const sendData = {
      lang: data.lang,
      value: data.value,
    };
    this.props.handleChange(sendData);
  }

  render() {
    let retVal;
    let selectedLang;
    const { values, showLabel } = this.props;

    // eslint-disable-next-line
    for (const i in values) {
      if (values[i].lang === this.props.lang) {
        selectedLang = values.splice(i, 1);
        values.unshift(selectedLang[0]);
        break;
      }
    }

    retVal = [];
    values.map((item) => {
      let label;
      if (this.props.edit) {
        if (showLabel) {
          label = (
            <Label className="edit-field-label">
              {item.lang.split('-', 1)}
            </Label>
          );
        }
        const textbox = (
          <div>
            <Input
              className="edit-field-textbox"
              labelPosition="left"
              onChange={this._handleChange}
              lang={item.lang}
              value={item.value}
              placeholder={item.placeholder}
            >
              {label}
              <input />
            </Input>
            <br />
          </div>
        );
        retVal.push(textbox);
      }
      return retVal;
    });
    if (this.props.edit === false) {
      retVal = <span>{values[0].value}</span>;
    }
    return retVal;
  }
}

I18nEditField.defaultProps = {
  edit: false,
  lang: 'en-CA',
  values: [
    { lang: 'fr-CA', value: '', placeholder: '' },
    { lang: 'en-CA', value: '', placeholder: '' },
  ],
  showLabel: true,
  handleChange: () => true,
};

I18nEditField.propTypes = {
  /** This is an example prop called "test". */
  edit: PropTypes.bool,
  lang: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.shape({
    lang: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
  })),
  showLabel: PropTypes.bool,
  handleChange: PropTypes.func,
};

export default I18nEditField;

