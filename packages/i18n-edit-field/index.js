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
    this._handleChangeFirst = this._handleChangeFirst.bind(this);
    this._handleChangeSecond = this._handleChangeSecond.bind(this);
    this.state = {
      firstValue: '',
      secondValue: '',
    };
  }

  _handleChangeFirst(e, data) {
    this.setState({ firstValue: e.target.value });
    const sendData = {
      lang: data.lang,
      value: data.value,
    };
    this.props.handleChange(sendData);
  }

  _handleChangeSecond(e, data) {
    this.setState({ secondValue: e.target.value });
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

    if (this.props.edit && showLabel) {
      retVal = (
        <div>
          <Input
            className="edit-field-textbox"
            labelPosition="left"
            onChange={this._handleChangeFirst}
            lang={values[0].lang}
            value={this.state.firstValue}
            placeholder={values[0].placeholder}
          >
            <Label className="edit-field-label">
              {values[0].lang.split('-', 1)}
            </Label>
            <input />
            <Icon />
          </Input><br />
          <Input
            className="edit-field-textbox"
            labelPosition="left"
            onChange={this._handleChangeSecond}
            lang={values[1].lang}
            value={this.state.secondValue}
            placeholder={values[0].placeholder}
          >
            <Label className="edit-field-label">
              {values[1].lang.split('-', 1)}
            </Label>
            <input />
            <Icon />
          </Input>
        </div>
      );
    } else if (this.props.edit && showLabel === false) {
      retVal = (
        <Input
          value={this.state.firstValue}
          onChange={this._handleChangeFirst}
          placeholder={values[0].placeholder}
          lang={values[0].lang}
        />
      );
    } else {
      retVal = <span>{values[0].text}</span>;
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
  handleChange: PropTypes.func.isRequired,
};

export default I18nEditField;

