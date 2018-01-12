import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AutoComplete from 'material-ui/AutoComplete';

class AutoCompleteGraphQL extends Component {
  constructor() {
    super();
    this._noFilter = () => true;
    this.selectItem = this.selectItem.bind(this);
  }
  selectItem(selection) {
    this.props.onSelectItem(selection);
  }
  render() {
    const { items, fullWidth, id } = this.props;
    return (
      <AutoComplete
        id={id}
        hintText="Type part of a name"
        searchText={this.props.searchText}
        dataSource={items}
        onUpdateInput={this.props.onUpdateInput}
        onNewRequest={this.selectItem}
        filter={this._noFilter}
        openOnFocus
        fullWidth={fullWidth}
      />
    );
  }
}

AutoCompleteGraphQL.defaultProps = {
  items: [],
  fullWidth: false,
  searchText: '',
  id: undefined,
  onUpdateInput: () => {},
  onSelectItem: () => {},
};
AutoCompleteGraphQL.propTypes = {
  /**
   * Unique identifier to assign to the underlying DOM elements
   */
  id: PropTypes.string,
  /**
   * If true, the field receives the property width: 100%.
   */
  fullWidth: PropTypes.bool,
  /**
   * Text being input to auto complete.
   */
  searchText: PropTypes.string,
  /**
   * Callback function that is fired when the user updates the TextField.
   *
   * Signature:
   * function(searchText: string, dataSource: array, params: object) => void
   *   - searchText: The auto-complete's searchText value.
   *
   *   - dataSource: The auto-complete's dataSource array.
   *
   *   - params:     Additional information linked the update.
   */
  onUpdateInput: PropTypes.func,
  /**
   * Callback function that is fired when a list item is selected, or enter
   * is pressed in the TextField.
   *
   * Signature:
   * function(chosenRequest: string, index: number) => void
   *   - chosenRequest: Either the TextField input value, if enter is pressed
   *                    in the TextField, or the dataSource object
   *                    corresponding to the list item that was selected.
   *
   *   - index:         The index in dataSource of the list item selected,
   *                    or -1 if enter is pressed in the TextField.
   */
  onSelectItem: PropTypes.func,
  /**
   * Array of strings or nodes used to populate the list.
   */
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
};

export default AutoCompleteGraphQL;
