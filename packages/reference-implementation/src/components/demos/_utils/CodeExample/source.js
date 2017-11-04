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
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Tabs, Tab } from 'material-ui/Tabs';
import CodeIcon from 'material-ui/svg-icons/action/code';

// Example, ExampleCode, ExampleComponent

export const Example = (props) => {
  const [[...sources], component] = props.children;
  return (
    <Card>
      <CardHeader
        title={props.label}
        showExpandableButton
        actAsExpander
        style={{ backgroundColor: '#ddd' }}
        openIcon={<CodeIcon />}
        closeIcon={<CodeIcon />}
      />
      <CardText expandable>
        <Tabs
          tabItemContainerStyle={{ backgroundColor: '#eee' }}
          inkBarStyle={{ backgroundColor: '#0375b4' }}
        >
          {
          sources.map(c => (
            <Tab
              key={`sourceTab_${props.label}_${c.props.label}`}
              label={c.props.label}
              buttonStyle={{ color: '#444' }}
            >
              {c}
            </Tab>
          ))
        }
        </Tabs>
      </CardText>
      {component}
    </Card>
  );
};

Example.defaultProps = {
  children: [],
  label: '',
};

Example.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  label: PropTypes.string,
};

export const ExampleCode = props => (
  <SyntaxHighlighter language={props.language} style={docco}>
    {props.children}
  </SyntaxHighlighter>
);

ExampleCode.defaultProps = {
  language: '',
  children: null,
};

ExampleCode.propTypes = {
  language: PropTypes.string,
  children: PropTypes.node,
};


export const ExampleComponent = props => (
  <CardText>
    {props.children}
  </CardText>
);

ExampleComponent.defaultProps = {
  children: null,
};

ExampleComponent.propTypes = {
  children: PropTypes.node,
};

