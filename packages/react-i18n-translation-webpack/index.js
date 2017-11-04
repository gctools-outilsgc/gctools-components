/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React, { Component } from 'react';

const LocalizedComponentWrapper = function localizedComponentWrapper(Comp) {
  const name = `Localized${(Comp.displayName || Comp.name || 'Component')}`;
  let isFunction = false;
  let Extend = Comp;
  if (!Comp || !Comp.prototype || !Comp.prototype.isReactComponent) {
    Extend = Component;
    isFunction = true;
  }

  class Localized extends Extend {
    constructor(props) {
      super(props);
      this.languageChangeCallback = false;
    }

    componentWillMount() {
      this.setState({
        language_ready: false,
        lang: localizer.lang,
      });
      if (super.componentWillMount) super.componentWillMount();
    }

    componentDidMount() {
      localizer.domainsReady().then(() => {
        this.setState({ language_ready: true });
      });
      this.languageChangeCallback =
        localizer.onLanguageChange((lang) => {
          // Push the execution to the bottom of the queue to give React
          // a chance to unmount children.
          setTimeout(() => {
            if (this.languageChangeCallback) {
              this.setState({ language_ready: false, lang });
              localizer.domainsReady().then(() => {
                this.setState({ language_ready: true });
              });
            }
          }, 0);
        });
      if (super.componentDidMount) super.componentDidMount();
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (nextState.language_ready === false) return false;
      if (super.shouldComponentUpdate) {
        if (super.shouldComponentUpdate(nextProps, nextState)) return true;
      }
      return (this.state !== nextState.language_ready);
    }

    componentWillUnmount() {
      if (this.languageChangeCallback) {
        this.languageChangeCallback.remove();
        this.languageChangeCallback = false;
      }
      try {
        super.componentWillUnmount();
      } catch (e) { } // eslint-disable-line no-empty
    }

    render() {
      if (isFunction) {
        return <Comp {...this.props} />;
      }
      return super.render();
    }
  }
  Localized.displayName = name;
  if (isFunction) {
    return props => <Localized {...props} />;
  }
  return Localized;
};

export default LocalizedComponentWrapper;

