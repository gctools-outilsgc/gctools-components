/* eslint-disable camelcase */

import React from 'react';
import ReactDOM from 'react-dom';
import Recommendations from '../src/apollo';

document.addEventListener('DOMContentLoaded', () => {
  const {
    context,
    context_obj1,
    gcconnex_guid,
    login_context,
  } = window.NRC_context;

  const navElem = document.getElementById('wb-sec');

  const recSec = document.createElement('div');
  recSec.setAttribute('class', 'portal');
  recSec.setAttribute('role', 'navigation');
  recSec.setAttribute('aria-labelledby', 'p-recommendation-nrc-label');

  const recSecTitle = document.createElement('h3');
  recSecTitle.setAttribute('id', 'p-recommendation-nrc-label');
  recSecTitle.textContent = 'Recommendations';

  const recBody = document.createElement('div');
  recBody.setAttribute('class', 'body');

  const recLoginContainer = document.createElement('div');
  if (login_context) {
    recBody.appendChild(recLoginContainer);
  }
  const recContainer = document.createElement('div');
  recContainer.setAttribute('class', 'nrcRecommendationContainer');
  recBody.appendChild(recContainer);

  recSec.appendChild(recSecTitle);
  recSec.appendChild(recBody);
  navElem.appendChild(recSec);

  if (login_context) {
    ReactDOM.render(
      <Recommendations
        context="login"
        user={{ gcconnex_guid }}
      />,
      recLoginContainer,
    );
  }

  ReactDOM.render(
    <Recommendations
      context={context}
      context_obj1={context_obj1}
      user={{ gcconnex_guid }}
    />,
    recContainer,
  );

  console.log(window.NRC_context);
});
