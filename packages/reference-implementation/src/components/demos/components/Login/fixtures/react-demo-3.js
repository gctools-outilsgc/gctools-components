/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React from 'react';

import Login from '@gctools-components/gc-login';

const LoginExample = () => (
  <div>
    <h4>Clicking on me will display a warning in the console</h4>
    <Login dumb />
  </div>
);
export default LoginExample;
