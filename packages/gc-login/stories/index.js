/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import Login from '../index';

const description = (
  <div>
    <p>
    The single sign-on component is a drop-in solution to provide SSO for
    any GCTools, or GoC site.  The component provides a complete client only
    authentication solution using `oidc-client`, and can also be customized
    to defer authentication to a backend server, or to orchestrate remote
    authentication using the `RAP` protocol using a hybrid client+server
    design.
    </p>
  </div>
);

storiesOf('Login', module)
  .add(
    'Default options',
    withInfo({
      text: description,
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <Login>
          {({ onClick }) => (
            <Button
              onClick={onClick}
              label="Login"
              primary
              compact
            />
          )}
        </Login>
      </div>
    )),
  );
