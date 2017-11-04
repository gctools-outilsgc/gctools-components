/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React from 'react';
import renderer from 'react-test-renderer';

import helper from './index';

class ExampleComponent extends React.Component { // eslint-disable-line
  render() {
    return <div>Testing 123</div>;
  }
}

it('can wrap a React class correctly', () => {
  global.localizer = {
    domainsReady: jest.fn(),
    onLanguageChange: jest.fn(),
  };
  const Wrapper = helper(ExampleComponent);
  global.localizer.domainsReady.mockReturnValue(new Promise((resolve) => {
    resolve();
  }));
  const tree = renderer.create(<Wrapper />).toJSON();
  expect(global.localizer.domainsReady.mock.calls.length).toBe(1);
  expect(global.localizer.onLanguageChange.mock.calls.length).toBe(1);
  expect(tree).toMatchSnapshot();
});

it('can wrap a stateless object component', () => {
  global.localizer = {
    domainsReady: jest.fn(),
    onLanguageChange: jest.fn(),
  };
  const Wrapper = helper(() => <div>Testing 234</div>);
  global.localizer.domainsReady.mockReturnValue(new Promise((resolve) => {
    resolve();
  }));
  const tree = renderer.create(<Wrapper />).toJSON();
  expect(global.localizer.domainsReady.mock.calls.length).toBe(1);
  expect(global.localizer.onLanguageChange.mock.calls.length).toBe(1);
  expect(tree).toMatchSnapshot();
});
