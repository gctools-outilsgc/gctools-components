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
  Example,
  ExampleCode,
  ExampleComponent } from './_utils/CodeExample/source';

import Properties from './_utils/CodeExample/properties';
import Methods from './_utils/CodeExample/methods';

const Demo = props => (
  <div>
    <h2>{props.title}</h2>
    {(props.component.__docgenInfo && props.component.__docgenInfo.description)
      ? props.component.__docgenInfo.description.split(/\n\n/)
        // eslint-disable-next-line react/no-array-index-key
        .map((item, key) => <span key={key}>{item}<br /><br /></span>)
      : null
    }
    {props.children}
    <hr />
    <Properties name={props.name} component={props.component} />
    <Methods name={props.name} component={props.component} />
  </div>
);

Demo.defaultProps = {
  title: '',
  name: '',
  children: null,
  component: null,
};

Demo.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string,
  children: PropTypes.node,
  component: PropTypes.func,
};

export const generateExample = (title, fixtures) => {
  let component = <span />;
  const sources = [];
  for (let i = 0; i < fixtures.length; i += 1) {
    const f = fixtures[i];
    if (f.label === 'react') {
      try {
        const Comp = f.require(`./${f.filename}`).default;
        component = <ExampleComponent><Comp /></ExampleComponent>;
      } catch (e) { } // eslint-disable-line
    }
    try {
      const SourceCode = f.raw(`./${f.filename}`);
      sources.push((
        <ExampleCode
          label={f.label}
          language={f.language}
          key={`example__${f.label}_${f.language}`}
        >
          {SourceCode.replace(
              /(\.\.\/){4,}(components\/)*/g,
              'gctools-nrc-components/',
            )}
        </ExampleCode>
      ));
    } catch (e) { } // eslint-disable-line
  }
  return (
    <Example label={title}>
      {sources}
      {component}
    </Example>
  );
};

export default Demo;
