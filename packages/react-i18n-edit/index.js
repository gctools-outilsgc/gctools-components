import React, { Component } from 'react';
import { Label, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import 'semantic-ui-css/semantic.min.css';
import './css/style.css';

/**
 * Editable label that turns into multiple text boxes upon entering edit mode.
 * One for each language specified.  The label (when not in edit mode)
 * displays the associated language.
 */
class ReactI18nEdit extends Component {
  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
  }

  _onChange(e, data) {
    if (this.props.onChange) {
      const sendData = {
        lang: data.lang,
        value: data.value,
      };
      this.props.onChange(sendData);
    }
  }

  render() {
    const { values, showLabel, lang } = this.props;
    if (!values.length || !Array.isArray(values)) return null;


    // Sort so the selected language is first, leave other items as-is.
    const displayList = values.slice();
    displayList.sort((a, b) => {
      const ai = (a.lang === lang) ? 1 : 0;
      const bi = (b.lang === lang) ? 1 : 0;
      return bi - ai;
    });

    // If we are not in edit mode, simply display the first value from the list
    if (this.props.edit === false) {
      return <span>{displayList[0].value}</span>;
    }

    // Display the editable fields for each language
    return (
      <div>
        {displayList.map(item => (
          <div key={`item_${item.lang}`}>
            <Input
              className="multiline-edit-field-textbox"
              labelPosition="left"
              onChange={this._onChange}
              lang={item.lang}
              value={item.value}
              placeholder={item.placeholder}
            >
              {(showLabel) ? (
                <Label className="multiline-edit-field-label">
                  {item.lang.split('_', 1)}
                </Label>
              ) : null}
              <input />
            </Input>
            <br />
          </div>
        ))}
      </div>
    );
  }
}

ReactI18nEdit.defaultProps = {
  edit: false,
  lang: 'en_CA',
  values: [
    { lang: 'fr_CA', value: '', placeholder: '' },
    { lang: 'en_CA', value: '', placeholder: '' },
  ],
  showLabel: true,
  onChange: undefined,
};

ReactI18nEdit.propTypes = {
  /** Determines if editable components should be displayed. */
  edit: PropTypes.bool,
  /** Wether or not to show a label next to the editable component */
  showLabel: PropTypes.bool,
  /** The current active language.  (for sorting of the value list) */
  lang: PropTypes.string,
  /** List of values to be set for each editable field and active lang label */
  values: PropTypes.arrayOf(PropTypes.shape({
    lang: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
  })),
  /** Event called when any of the editable components are changed */
  onChange: PropTypes.func,
};

export default ReactI18nEdit;

