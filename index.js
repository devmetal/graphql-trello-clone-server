const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const config = require('./src/config');
const schema = require('./src/schema');
const app = require('./src/server');
const { findUserByToken } = require('./src/auth');

const { port } = config.get();

// Initialize our express app
const server = createServer(app);

server.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server listen on ${port}`);

  // Start subs server
  SubscriptionServer.create({
    execute,
    subscribe,
    schema,
    onConnect: (params) => {
      if (params.token) {
        return findUserByToken(params.token)
          .then(user => ({ user }));
      }

      throw new Error('Missing auth token');
    },
  }, {
    server,
    path: '/subscriptions',
  });
});
