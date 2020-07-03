import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import apolloStorybookDecorator from 'apollo-storybook-react';
import faker from "faker";
import { MockList } from 'graphql-tools';
import GlobalNav from '../components/GlobalNav';

const mocks = {
  Notifications: () => ({
    id: faker.random.number(100),
    actionLevel: 'Featured',
    gcID: '79',
    online: {
      titleEn: faker.name.findName() + ' has posted a new discussion',
      viewed: faker.random.boolean()
    },

  }),
  Query: () => ({
    notifications: () => new MockList([0, 12]),
  }),
};

const FakeSearch = () => <div><input type="text" /></div>;

const accessToken = "e56ecadd47a94afab6037ecebb64326a";
const notificationURL = "http://10.0.0.226:4000/graphql";

const typeDefs = `
  type OnlineInfo {
    titleEn: String,
    titleFr: String,
    viewed: Boolean
  }
  type Notifications {
    online: OnlineInfo
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
      <div className="gn-story-holder">
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
      <div className="gn-story-holder">
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
      <div className="gn-story-holder">
        <GlobalNav
          currentUser={
            {
              sub: '22',
              name: 'Jonald',
              picture: 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairCurly&accessoriesType=Blank&hairColor=SilverGray&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=CollarSweater&clotheColor=Pink&eyeType=Hearts&eyebrowType=UpDownNatural&mouthType=Serious&skinColor=Yellow',
            }
          }
          accessToken={accessToken}
          notificationURL={notificationURL}
          searchComponent={<FakeSearch />}
        />
      </div>
    ))
  )
  .add(
    'With Logged in User / French',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div className="gn-story-holder">
        <GlobalNav
          currentLang='fr_CA'
          currentUser={
            {
              sub: '22',
              name: 'Jonald',
              picture: 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairCurly&accessoriesType=Blank&hairColor=SilverGray&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=CollarSweater&clotheColor=Pink&eyeType=Hearts&eyebrowType=UpDownNatural&mouthType=Serious&skinColor=Yellow',
            }
          }
          accessToken={accessToken}
          notificationURL={notificationURL}
          searchComponent={<FakeSearch />}
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
      <div className="gn-story-holder">
        <GlobalNav
          currentUser={
            {
              sub: '22',
              name: 'Jonald',
              picture: 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairCurly&accessoriesType=Blank&hairColor=SilverGray&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=CollarSweater&clotheColor=Pink&eyeType=Hearts&eyebrowType=UpDownNatural&mouthType=Serious&skinColor=Yellow',
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
          accessToken={accessToken}
          notificationURL={notificationURL}
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
      <div className="gn-story-holder">
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
      <div className="gn-story-holder">
        <GlobalNav
          minimized
          currentUser={
            {
              sub: '22',
              name: 'Jonald',
              picture: '',
            }
          }
          currentApp={
            {
              id: '2',
            }
          }
          accessToken={accessToken}
          notificationURL={notificationURL}
          searchComponent={<FakeSearch />}
        />
      </div>
    ))
  )
  .add(
    'Default options without hamburger menu',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div className="gn-story-holder">
        <GlobalNav
          hamburgerMenu={false}
        />
      </div>
    )),
  )
