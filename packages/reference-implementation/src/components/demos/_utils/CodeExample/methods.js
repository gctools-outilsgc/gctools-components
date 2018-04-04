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

const Methods = (props) => {
  const funcs =
    (props.component.__docgenInfo)
      ? (props.component.__docgenInfo.methods || [])
        .filter(p => p.name.indexOf('_') !== 0)
      : [];

  if (funcs.length === 0) return null;

  return (
    <div>
      <h3>{props.name} methods</h3>
      <Table selectable={false}>
        <TableHeader
          adjustForCheckbox={false}
          displaySelectAll={false}
        >
          <TableRow>
            <TableHeaderColumn>
              Name
            </TableHeaderColumn>
            <TableHeaderColumn>
              Parameters
            </TableHeaderColumn>
            <TableHeaderColumn>
              Returns
            </TableHeaderColumn>
            <TableHeaderColumn>
              Description
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {funcs.map(c => (
            <TableRow key={`method_${c.name}`}>
              <TableRowColumn style={{
                color: '#266d90',
              }}
              >
                {c.name}
              </TableRowColumn>
              <TableRowColumn>
                {c.params.map(p => (
                  <div key={`method_${c.name}_${p.name}`}>
                    <div style={{ color: '#bf2a5c' }}>
                      {p.name}: {`${p.type}`}
                    </div>
                    <div>
                      {p.description}
                    </div>
                  </div>
                ))}
              </TableRowColumn>
              <TableRowColumn style={{
                whiteSpace: 'wrap',
              }}
              >
                <div>
                  <div style={{ color: '#bf2a5c' }}>
                    {(c.returns) ? c.returns.type.name : '' }
                  </div>
                  <div>
                    {(c.returns) ? c.returns.description : ''}
                  </div>
                </div>
              </TableRowColumn>
              <TableRowColumn style={{ whiteSpace: 'wrap' }}>
                {c.description}
              </TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

Methods.defaultProps = {
  component: null,
  name: '',
};

Methods.propTypes = {
  component: PropTypes.func,
  name: PropTypes.string,
};

export default Methods;
