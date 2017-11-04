/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SideLoader extends Component {
  constructor() {
    super();
    this.state = { Comp: null };
    this.s = this.s.bind(this);
  }
  componentWillMount() {
    if (this.props.o) this.props.o(this);
  }
  s(Comp) {
    this.setState({ Comp: Comp.default });
  }
  render() {
    const { Comp } = this.state;
    if (Comp) {
      return <Comp />;
    }
    return null;
  }
}

SideLoader.propTypes = {
  o: PropTypes.func.isRequired,
};

export default SideLoader;
