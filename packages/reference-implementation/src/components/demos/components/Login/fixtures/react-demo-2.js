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
  StepLabel } from 'material-ui/Stepper';

import Login from '@gctools-components/gc-login';
import identityServer from './authority';

class LoginExample extends React.Component {
  constructor() {
    super();
    this.state = {
      activeStep: 0,
      profile: undefined,
    };
    this.loginClick = this.loginClick.bind(this);
    this.logoutClick = this.logoutClick.bind(this);
  }

  loginClick() {
    this.setState({
      activeStep: 1,
      profile: {
        name: 'Jane Doe',
      },
    });
  }

  logoutClick() {
    this.setState({
      activeStep: 3,
      profile: undefined,
    });
  }

  render() {
    return (
      <div>
        <Stepper activeStep={this.state.activeStep}>
          <Step>
            <StepLabel>Click the login button</StepLabel>
          </Step>
          <Step>
            <StepLabel>Click the logout button</StepLabel>
          </Step>
        </Stepper>
        <Login
          oidcConfig={{
            authority: identityServer,
            client_id: '369399',
          }}
          profile={this.state.profile}
          onLoginClick={this.loginClick}
          onLogoutClick={this.logoutClick}
          verifyLoginOnMount={false}
        />
      </div>
    );
  }
}

export default LoginExample;
