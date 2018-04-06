
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import initStoryshots from '@storybook/addon-storyshots';

import ReactI18nEdit from '../index';

initStoryshots();

describe('<ReactI18nEdit />', () => {
  it('onChange prop is fired when change event occurs per language', () => {
    const onChange = jest.fn();
    const component = ReactTestUtils
      .renderIntoDocument(<ReactI18nEdit edit onChange={onChange} />);
    const nodes = ReactTestUtils
      .scryRenderedDOMComponentsWithTag(component, 'input');

    ReactTestUtils.Simulate.change(nodes[0]);
    expect(onChange).toHaveBeenCalledWith({ lang: 'en_CA', value: '' });

    ReactTestUtils.Simulate.change(nodes[1]);
    expect(onChange).toHaveBeenCalledWith({ lang: 'fr_CA', value: '' });
  });

  it('when onChange is not set, no events are fired.', () => {
    const onChange = jest.fn();
    const component = ReactTestUtils
      .renderIntoDocument(<ReactI18nEdit edit />);

    const nodes = ReactTestUtils
      .scryRenderedDOMComponentsWithTag(component, 'input');

    ReactTestUtils.Simulate.change(nodes[0]);
    expect(onChange).not.toHaveBeenCalled();

    ReactTestUtils.Simulate.change(nodes[1]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('gracefully handles invalid values', () => {
    const component = ReactTestUtils
      .renderIntoDocument(<ReactI18nEdit values={[]} />);
    const nodes = ReactTestUtils
      .scryRenderedDOMComponentsWithTag(component, 'span');
    expect(nodes.length).toBe(0);

    const component2 = ReactTestUtils
      .renderIntoDocument(<ReactI18nEdit values="popsicle" />);
    const nodes2 = ReactTestUtils
      .scryRenderedDOMComponentsWithTag(component2, 'span');
    expect(nodes2.length).toBe(0);
  });
});
