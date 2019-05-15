import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import apolloStorybookDecorator from 'apollo-storybook-react';
import GlobalNav from '../components/GlobalNav';

const baseUserMock = () => {
  return {
    id: 122,
    actionLevel: 'Featured',
    gcID: '79',
    email: {
      subject: 'New notification',
    },
  };
};

const mocks = {

  Notifications: () => {
     return baseUserMock();
  },
}

const typeDefs = `

  type EmailInfo {
    subject: String
  }
  type Notifications {
    email: EmailInfo
    id: Int
  }
  type Query {
    notifications(gcID: String, actionLevel: String): [Notifications]
  }
  schema {
    query: Query
  }
`;

storiesOf('GlobalNav', module)
.addDecorator(
  apolloStorybookDecorator({
    typeDefs,
    mocks,
  }),
)
.add(
    'Default options',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }} className="gn-story-holder">
        <GlobalNav />
      </div>
    )),
  )
  .add(
    'French Language Toggle / Not Logged in',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }} className="gn-story-holder">
        <GlobalNav
          currentLang='fr_CA'
        />
      </div>
    )),
  )
  .add(
    'With Logged in User',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }} className="gn-story-holder">
        <GlobalNav
          currentUser={
            {
              gcID: '22',
              name: 'Jonald',
              avatar: 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairCurly&accessoriesType=Blank&hairColor=SilverGray&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=CollarSweater&clotheColor=Pink&eyeType=Hearts&eyebrowType=UpDownNatural&mouthType=Serious&skinColor=Yellow',
            }
          }
        />
      </div>
    ))
  )
  .add(
    'On A Different App / Logged In',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }} className="gn-story-holder">
        <GlobalNav
          currentUser={
            {
              gcID: '22',
              name: 'Jonald',
              avatar: 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairCurly&accessoriesType=Blank&hairColor=SilverGray&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=CollarSweater&clotheColor=Pink&eyeType=Hearts&eyebrowType=UpDownNatural&mouthType=Serious&skinColor=Yellow',
            }
          }
          currentApp={
            {
              name: 'Another App',
              id: '2',
              home: '!#',
              logo: 'https://github.com/gctools-outilsgc/gcconnex/blob/master/mod/wet4/graphics/gc_connex_icon.gif?raw=true',
            }
          }
        />
      </div>
    ))
  )
  .add(
    'Minimized / Not Logged In',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }} className="gn-story-holder">
        <GlobalNav
          minimized
        />
      </div>
    ))
  )
  .add(
    'Minimized / Logged In',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }} className="gn-story-holder">
        <GlobalNav
          minimized
	        currentUser={
            {
              gcID: '22',
              name: 'Jonald',
              avatar: 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairCurly&accessoriesType=Blank&hairColor=SilverGray&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=CollarSweater&clotheColor=Pink&eyeType=Hearts&eyebrowType=UpDownNatural&mouthType=Serious&skinColor=Yellow',
            }
          }
          currentApp={
            {
              id: '2',
            }
          }
        />
      </div>
    ))
);
