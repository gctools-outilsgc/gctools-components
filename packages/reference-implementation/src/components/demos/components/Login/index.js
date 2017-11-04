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
import Login from '@gctools-components/gc-login';

import Demo, { generateExample } from '../../demo';

const requireContext = require.context('./fixtures', false, /.*/);
const raw = require.context('!!raw-loader!./fixtures', false, /.*/);


const demo = () => (
  <Demo name="Login" component={Login} title={__('Single sign-on')}>
    <h3>Client side</h3>
    <p>
    The SSO component can be dropped into any website and immediately provide
    SSO functionality, without any server side modifications.  This is
    particularly useful for SPAs (single page applications) who don&apos;t
    necessarily require a detected backend to run.
    </p>
    <p>
    Once authentication is complete, the SPA can use the token to request
    secure resources as the user.
    </p>

    {generateExample('Client side example', [
        {
          label: 'react',
          language: 'javascript',
          filename: 'react-demo-1.js',
          require: requireContext,
          raw,
        },
      ])
    }

    <h3>Server side</h3>
    <p>
      Server side in our case actually defines two seperate scenarios.  The
      first is what most other SSO components would call `client side`, where
      a library like `oidc-client` is used with configured callback routes on
      the backend, designed to serve the client library and invoke the callback
      methods.  This differs from the `client-side` defined above; as in the
      above example, no backend routes are required at all.  The second
      scenario is when you actually use a OIDC server-side library, in which
      case we use need a &quot;dumb&quot; component to deliver a consistent
      user experience.
    </p>
    <p>
      The first scenario works out of the box, you just need to make sure to
      include the single sign-on component on every callback page, and the
      component takes care of the rest.
    </p>
    <p>
      To make the single sign-on component work with your server-side OIDC
      client, you simply need to override the click behavior of the control,
      and manually set it&apos;s internal profile.
    </p>
    <p>
      Configuring a server-side OIDC client is out of scope for this
      documentation,
    </p>

    {generateExample('Overridden behaviour example', [
        {
          label: 'react',
          language: 'javascript',
          filename: 'react-demo-2.js',
          require: requireContext,
          raw,
        },
      ])
    }

    <p>
      In the example above, although clicking the button doesn&apos;t invoke
      any of the OIDC methods, there is still an iframe being created, and a
      few other things we might not want.  The `dumb` convenience property
      exists to switch the component&apos;s built-in OIDC functionality off.
    </p>

    {generateExample('Dumb component example', [
        {
          label: 'react',
          language: 'javascript',
          filename: 'react-demo-3.js',
          require: requireContext,
          raw,
        },
      ])
    }

    <h3>Hybrid<sup>2</sup></h3>
    <p>
      The &quot;Hybrid squared&quot; mode leverages a protocol created by NRC
      called Remote Authentication Protocol (RAP).  RAP allows secure
      authentication to server-side systems by using the user&apos;s browser
      as an intermediary, and JSON Web Tokens.
    </p>
    <p>
      By using RAP, legacy systems can be made to support SSO with minimal
      effort.  If the platform you are working with does not have support for
      OIDC, or its implementation is too cumbersome, RAP might be a good
      alternative.
    </p>
    <p>TODO: Add link to RAP spec / server-side implementations</p>
  </Demo>
);

export default LocalizedComponent(demo);
