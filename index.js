const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');

const { typeDefs, resolvers } = require('./src/schema');
const app = require('./src/server');
const config = require('./src/config');
const { findUserByToken } = require('./src/auth');

const { port } = config.get();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context({ req, connection }) {
    const wsContext = connection ? connection.context : {};

    return {
      user: req ? req.user : undefined,
      ...wsContext,
    };
  },
  subscriptions: {
    onConnect(connectionParams) {
      if (connectionParams.token) {
        const { token } = connectionParams;
        return findUserByToken(token)
          .then(user => ({ sUser: user }))
          .catch(() => ({ sUser: {} }));
      }
      return Promise.resolve({ sUser: {} });
    },
  },
});

server.applyMiddleware({ app });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Apollo Server 2 is running on ${port}`);
});
