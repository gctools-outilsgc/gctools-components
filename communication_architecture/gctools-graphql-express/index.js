import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import expressPlayground from 'graphql-playground-middleware-express';
import { express as expressVoyager } from 'graphql-voyager/middleware';
import { graphql, execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { createServer } from 'http';

import schema from './schema';
import pleioHeader from './pleio';

const cors = require('cors');
const jwt = require('express-jwt');

const PORT = 3001;
const WS_PORT = 3002;

const websocketServer = createServer((request, response) => {
  response.writeHead(404);
  response.end();
});

websocketServer.listen(WS_PORT, () => console.log(
  `Websocket Server is now running on ws://localhost:${WS_PORT}`
));

const subscriptionServer = SubscriptionServer.create(
  { schema, execute, subscribe },
  { server: websocketServer, path: '/graphql' }
);

const app = express();

app.use('/graphql',
  cors(),
  jwt({ secret: 'qWxPJrZCLeHZraNTWjEKHdJJxJyho8' }),
  bodyParser.json(),
  (req, res) => {
    graphqlExpress({ schema, rootValue: req.user })(req, res);
  }
);

app.get(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: 'ws://gcrec-db.lpss.me/graphql',
    passHeader: `'Authorization':${pleioHeader}`,
  })
);
app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

app.get(
  '/voyager',
  expressVoyager({
    endpointUrl: '/graphql',
    headersJS: `{'Authorization':${pleioHeader}}`
  })
);


app.listen(PORT);
