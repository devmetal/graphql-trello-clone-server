const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const apollo = require('apollo-server-express');
const config = require('./config');
const schema = require('./schema');
const auth = require('./auth');

const { mongo, env, port } = config.get();
const dev = env !== 'production';

mongoose.connect(mongo);
mongoose.set('debug', true);

const app = express();

app.use(bodyParser.json());
app.use(auth.initialize());
app.use(morgan(dev ? 'dev' : 'combined'));

app.use('/graphql', (req, res, next) => {
  auth.authenticate((err, user) => {
    if (err) return next(err);
    req.user = user;
    return next();
  })(req, res, next);
});

app.use('/graphql', apollo.graphqlExpress(context => ({
  schema,
  context,
})));

if (dev) {
  app.use('/graphiql', apollo.graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`,
  }));
}

module.exports = app;
