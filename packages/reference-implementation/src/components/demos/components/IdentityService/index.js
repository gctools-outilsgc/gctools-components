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

const overview = require('../../../../img/is-overview.png');

const demo = () => (
  <div>
    <h3>Identity Service</h3>
    <p>
      Identity Service is an implementation of&nbsp;
      <a href="https://identityserver.io/">IdentityServer4</a>.
      IdentityServer4 is an OpenID Connect and OAuth 2.0 framework for ASP.NET
      Core.
    </p>
    <p>The following features are available:</p>
    <ul>
      <li>
        Authentication as a service - Stand alone application that be used
        by all applications and is certified with OpenID Connect
      </li>
      <li>
        Single Sign-on / Sign-out - Can sign-on one time for multiple
        applications
      </li>
      <li>
        Access Control for APIs - Access tokens can be used for server to
        server, web applications, SPA and native/mobile apps
      </li>
      <li>
        Federated Gateway - Identity providers from Google, Facebook, etc
      </li>
    </ul>
    <h4>Technologies used:</h4>
    <ul>
      <li>ASPNET Core 1.1 using .NET core 1.1</li>
      <li>PostgreSQL</li>
      <li>Docker</li>
      <li>Docker Compose</li>
    </ul>
    <h4>Overview</h4>
    <p>
      <img src={overview} alt="Overview" />
    </p>
  </div>
);

export default LocalizedComponent(demo);
