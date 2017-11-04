/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React from 'react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import Demo from '../../demo';
import { ExampleCode } from '../../_utils/CodeExample/source';

const demo = () => (
  <Demo
    name="reacti18n"
    component={LocalizedComponent}
    title={__('React I18n helper')}
  >
    <p>
      Although the I18n webpack plugin doesn&apos;t require the use of this
      helper, using the plugin directly with React isn&apos;t as straight
      forward as it would seem. The helper is designed to greatly simplify the
      development process.
    </p>
    <h3>How to use it</h3>
    <ExampleCode language="javascript">
      {`
import React from 'react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

class MyComponent extends React.Component {
  render() {
    <p>{__('this is translated text')}</p>
  }
}

export default LocalizedComponent(MyComponent);

      `}
    </ExampleCode>
    <h3>How does it work</h3>
    <p>
      The helper is a React higher-order component.
    </p>
    <blockquote>
      <p>
      A higher-order component (HOC) is an advanced technique in React for
      reusing component logic. HOCs are not part of the React API, per se.
      They are a pattern that emerges from React’s compositional nature.
      </p>
      <footer>
        —
        <cite>
          <a href="https://reactjs.org/docs/higher-order-components.html">
              React documentation
          </a>
        </cite>
      </footer>
    </blockquote>
    <p>
      There are two common patterns used when developping HOCs, props proxy
      and inheritance inversion.  The I18n helper uses inheritance inversion
      (a subclass which behaves as a superclass), for the least amount of
      side-effects possible.
    </p>
    <h3>Why would you use it?</h3>
    <p>
      The two main pain points this helper solves are around asyncronous
      loading of language files, and updating the rendered text when the
      language changes.  Here are the issues:
    </p>
    <ul>
      <li>
        If codeSplitting is turned on, when React initially renders a
        component, the language files are not yet ready, meaning the translate
        functions return the raw message id.
      </li>
      <li>
        When the language is changed, there is nothing to indicate to React it
        should re-render its components, or that the result of the translate
        functions would change.
      </li>
    </ul>
    <p>
      Let&apos;s start by looking at a oversimplified example.
    </p>
    <ExampleCode language="javascript">
      {`
class MyComponent extends React.Component {
  render() {
    <p>{__('this is translated text')}</p>
  }
}
      `}
    </ExampleCode>
    <p>
      The code above will always output &quot;this is translated text&quot;,
      regardless of the current language.  This is because webpack doesn&apos;t
      load the language bundle until after the render method is fired.
    </p>
    <p>
      It&apos;s easy enough to make our component wait for the language files
      to be ready, as shown in the following example.
    </p>
    <ExampleCode language="javascript">
      {`
class MyComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      language_ready: false
    }
  }
  componentWillMount() {
    localizer.domainsReady().then(() => {
      this.setState({ language_ready: true });
    });
  }
  render() {
    if (!this.state.language_ready) return null;
    <p>{__('this is translated text')}</p>
  }
}
      `}
    </ExampleCode>
    <p>
      You may notice the <strong>localizer</strong> global above, it is
      available automatically when the i18n webpack plugin is used.
    </p>
    <p>
      Although the code above will output the translated text correctly, if the
      language is changed, nothing will happen.  We need to add a listener.
    </p>
    <ExampleCode language="javascript">
      {`
class MyComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      language_ready: false
    }
    this.callback = false;
  }
  componentWillMount() {
    localizer.domainsReady().then(() => {
      this.setState({ language_ready: true });
    });
    this.callback = localizer.onLanguageChange((lang) => {
      this.setState({ language_ready: false });
      localizer.domainsReady().then(() => {
        this.setState({ language_ready: true });
      });
    });
  }
  componentWillUnmount() {
    if (this.callback) {
      this.callback.remove();
      this.callback = false;
    }
  }
  render() {
    if (!this.state.language_ready) return null;
    <p>{__('this is translated text')}</p>
  }
}
      `}
    </ExampleCode>
    <p>
      The compoent above should be fully functional, it loads the correct
      language initially, and it updates automatically when the language is
      changed.
    </p>
    <p>
      There are still issues however; for example everytime the language is
      changed, the DOM for this component is cleared and replaced with a new
      one because of the <strong>return null</strong> statement; which may
      lead to poor performance.  There is also the possibility that nesting
      these components result in setState being called when the component is
      not mounted.
    </p>
    <p>
      These problems are all solved relatively easily, but the solution is
      getting a bit verbose, which is why this helper was created.
    </p>
  </Demo>
);

export default LocalizedComponent(demo);
