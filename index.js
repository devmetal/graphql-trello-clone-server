const { ApolloServer } = require('apollo-server-express');

const { typeDefs, resolvers } = require('./src/schema');
const app = require('./src/server');
const config = require('./src/config');
const { findUserByToken } = require('./src/auth');

const { port } = config.get();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });

/*server.subscriptionServerOptions.onConnect = (params) => {
  if (params.token) {
    return findUserByToken(params.token)
      .then(user => ({ user }));
  }

  throw new Error('Missing auth token');
};*/

app.listen(() => {
  // eslint-disable-next-line
  console.log(`Apollo Server 2 is running on ${port}`);
});
