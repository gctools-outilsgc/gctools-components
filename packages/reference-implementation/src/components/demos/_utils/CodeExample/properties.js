/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles';

const jsonStringify = require('json-pretty');

const Properties = (props) => {
  const properties =
    (props.component.__docgenInfo) ? props.component.__docgenInfo.props || []
      : [];

  if (properties.length === 0) return null;
  return (
    <div>
      <h3>{props.name} properties</h3>
      <Table selectable={false}>
        <TableHeader
          adjustForCheckbox={false}
          displaySelectAll={false}
        >
          <TableRow>
            <TableHeaderColumn style={{ width: 10, padding: 0 }} />
            <TableHeaderColumn style={{ paddingLeft: 0 }}>
              Name
            </TableHeaderColumn>
            <TableHeaderColumn style={{ }}>
              Type
            </TableHeaderColumn>
            <TableHeaderColumn>Default</TableHeaderColumn>
            <TableHeaderColumn>
              Description
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {Object.keys(properties).map((k) => {
            const c = properties[k];
            return (
              <TableRow key={`prop_${k}`}>
                <TableRowColumn style={{
                color: 'red',
                width: 10,
                padding: 0,
                textAlign: 'right',
              }}
                >
                  {(c.required) ? '*' : ''}
                </TableRowColumn>
                <TableRowColumn style={{
                color: '#266d90',
                paddingLeft: 0,
                whiteSpace: 'nowrap',
              }}
                >
                  {k}
                </TableRowColumn>
                <TableRowColumn style={{
                color: '#bf2a5c',
                whiteSpace: 'nowrap',
              }}
                >
                  {jsonStringify(c.type.name)}
                </TableRowColumn>
                <TableRowColumn>
                  <SyntaxHighlighter language="javascript" style={docco}>
                    {`${(c.defaultValue) ? c.defaultValue.value : ''}`}
                  </SyntaxHighlighter>
                </TableRowColumn>
                <TableRowColumn style={{ whiteSpace: 'wrap' }}>
                  {c.description}
                </TableRowColumn>
              </TableRow>
          );
})}
        </TableBody>
      </Table>
    </div>
  );
};

Properties.defaultProps = {
  component: null,
  name: '',
};

Properties.propTypes = {
  component: PropTypes.func,
  name: PropTypes.string,
};


export default Properties;
