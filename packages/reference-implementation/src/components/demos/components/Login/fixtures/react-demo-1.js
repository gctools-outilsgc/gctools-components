/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React from 'react';
import {
  Step,
  Stepper,
  StepLabel
} from 'material-ui/Stepper';

import Login from '@gctools-components/gc-login';
import { ExampleCode } from '../../../_utils/CodeExample/source';
import identityServer from './authority';

const jsonStringify = require('json-pretty');

const url = window.location.href;


class LoginExample extends React.Component {
  constructor() {
    super();
    this.state = {
      activeStep: 0,
      profile: '',
    };
    this.loginClick = this.loginClick.bind(this);
    this.logoutClick = this.logoutClick.bind(this);
    this.userLoaded = this.userLoaded.bind(this);
    this.userUnloaded = this.userUnloaded.bind(this);
  }

  loginClick(e, obj) {
    this.setState({ activeStep: 1 });
    obj.login();
  }

  userLoaded(profile) {
    this.setState({ activeStep: 2 });
    this.setState({ profile });
  }

  logoutClick(e, obj) {
    this.setState({ activeStep: 3 });
    obj.logout();
  }

  userUnloaded() {
    this.setState({ activeStep: 4 });
    this.setState({ profile: '' });
  }

  render() {
    return (
      <div>
        <Stepper activeStep={this.state.activeStep}>
          <Step>
            <StepLabel>Click the login button</StepLabel>
          </Step>
          <Step>
            <StepLabel>Login to IdentityServer</StepLabel>
          </Step>
          <Step>
            <StepLabel>Use your token &amp; info</StepLabel>
          </Step>
          <Step>
            <StepLabel>Logout</StepLabel>
          </Step>
        </Stepper>
        <Login
          oidcConfig={{
            authority: identityServer,
            client_id: '369399',
            scope: 'openid profile email',
            post_logout_redirect_uri: `${url}/#!logout`,
            redirect_uri: `${url}/#!callback`,
            silent_redirect_uri: `${url}/#!silent`,
          }}
          onLoginClick={this.loginClick}
          onLogoutClick={this.logoutClick}
          onUserLoaded={this.userLoaded}
          onUserFetched={this.userLoaded}
          onUserUnloaded={this.userUnloaded}
        />
        <ExampleCode language="javascript">
          {jsonStringify(this.state.profile)}
        </ExampleCode>
      </div>
    );
  }
}

export default LoginExample;
