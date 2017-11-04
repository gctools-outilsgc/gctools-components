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

import { generateExample } from '../../demo';

const demo = () => (
  <div>
    <h2>Article Recommendation Micro-service</h2>
    <p>
      Article recommendations depend on 3 factors such as user profiles,
      article content and the context where the recommendations are required.
    </p>
    <p>
      The contexts are given by the location of a user during her/his
      exploration of the GCpedia website (home/landing page, article page or
      group discussion page) and the status of the user (logged on or off).
      Thus there are 6 possible contexts in total consisting of all
      combinations of the aforementioned options.
    </p>
    <p>
      The following example not only tests every context the article
      recommendation service supports, it also provides a friendly interface
      to chose contexts, users, articles and group discussions.  Using this
      interface allows you to see how the service will respond in predicatable
      situations without embedding it first.
    </p>

    {generateExample(__('Complete example'), [
        {
          label: 'react',
          language: 'javascript',
          filename: 'recommendations.1.js',
          require: require.context('./fixtures', false, /.*/),
          raw: require.context('!!raw-loader!./fixtures', false, /.*/),
        },
      ])
    }

  </div>
);

export default LocalizedComponent(demo);
