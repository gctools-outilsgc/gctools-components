import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import '@fortawesome/fontawesome';
// import '@fortawesome/fontawesome-free-solid';

import 'semantic-ui-css/semantic.min.css';

import './orgchart.css';

/**
 * React component capable of displaying org charts
 */
class ReactGcOrgchart extends Component {
  constructor() {
    super();
    this.element = false;
    this.state = {
      height: false,
    };
  }

  componentDidMount() {
    if (this.element) {
      const h = this.element.clientWidth;
      if (this.state.height !== h) {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({ height: h });
      }
      const func = (counter) => {
        if (!this.element) return;
        if (this.element.clientWidth !== h) {
          this.updateHeight();
        } else if (counter < 100) {
          const f = func.bind(this, counter + 1);
          setTimeout(f, 10);
        }
      };
      func(1);
    }
  }

  updateHeight() {
    // We use width instead of height because the element is rotated.
    if (this.state.height !== this.element.clientWidth) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ height: this.element.clientWidth });
    }
  }

  render() {
    const { orgStructure, subject } = this.props;

    if (!orgStructure) return null;

    const colCount = (r, col) => {
      if (col.subordinates) {
        return r + col.subordinates.reduce(colCount, 1);
      }
      return r + 1;
    };

    const getLineClass = (pos, total) => {
      const part1 = (pos % 2) ? 'leftLine' : 'rightLine';
      const part2 = ((pos > 0) && (pos < total - 1)) ? 'topLine' : '';
      return `${part1} ${part2}`;
    };

    const createChart = (obj) => {
      const subLength = (obj.subordinates) ? obj.subordinates.length * 2 : 2;
      return (
        <table>
          <tbody>
            <tr>
              <td colSpan={subLength}>
                <div className={
                  `node ${(obj.uuid === subject) ? 'focused' : ''}`}
                >
                  <div className="title">
                    {obj.name}
                  </div>
                  <div className="content">
                    {obj.orgTier}
                  </div>
                </div>
              </td>
            </tr>
            {obj.subordinates ?
              <tr className="lines">
                <td colSpan={subLength}>
                  <div className="downLine" />
                </td>
              </tr> : null}
            {obj.subordinates ?
              <tr className="lines">
                {new Array(...Array(subLength))
                .map((c, i) => (
                  <td
                    key={`L${obj.uuid}_${i}`} // eslint-disable-line
                    className={
                      getLineClass(i, subLength)
                    }
                  />
                ))}
              </tr> : null}
            {obj.subordinates ?
              <tr className="nodes">
                {obj.subordinates.map(sub => (
                  <td colSpan="2" key={`N${obj.uuid}_${sub.uuid}`}>
                    {createChart(sub)}
                  </td>
                ))}
              </tr> : null}
          </tbody>
        </table>
      );
    };

    const height = (this.state.height) ? this.state.height : 0;

    return (
      <div style={{ height: `${height}px` }}>
        <div className="orgchart l2r" ref={(r) => { this.element = r; }}>
          {createChart(this.props.orgStructure)}
        </div>
      </div>
    );
  }
}

ReactGcOrgchart.defaultProps = {
  subject: undefined,
};

const NodePropType = PropTypes.shape({
  /** Unique identifier for the person */
  uuid: PropTypes.string.isRequired,
  /** Name of a person */
  name: PropTypes.string.isRequired,
  /** Organizational tier of the named person */
  orgTier: PropTypes.string,
  /** Subordinates of the named person */
  subordinates: null,
});
NodePropType.subordinates = PropTypes.arrayOf(PropTypes.shape(NodePropType));

ReactGcOrgchart.propTypes = {
  /** The organizational structure to display */
  orgStructure: PropTypes.shape({
    /** Unique identifier for the person */
    uuid: PropTypes.string.isRequired,
    /** Name of the person at the top of the organizational chart */
    name: PropTypes.string.isRequired,
    /** Organizational tier of the named person */
    orgTier: PropTypes.string,
    /** Subordinates of the named person */
    subordinates: PropTypes.arrayOf(PropTypes.shape({
      /** Unique identifier for the person */
      uuid: PropTypes.string.isRequired,
      /** Name of a person */
      name: PropTypes.string.isRequired,
      /** Organizational tier of the named person */
      orgTier: PropTypes.string,
      /** Subordinates of the named person */
      subordinates: PropTypes.arrayOf(NodePropType),
    })),
  }).isRequired,
  /** Identifies by `uuid` which node is in focus */
  subject: PropTypes.string,
};

export default ReactGcOrgchart;
