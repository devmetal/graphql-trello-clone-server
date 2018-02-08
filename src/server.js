const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const apollo = require('apollo-server-express');
const config = require('./config');
const schema = require('./schema');

const { mongo, env } = config.get();
const dev = env !== 'production';

mongoose.connect(mongo);
mongoose.set('debug', true);

const app = express();

app.use(bodyParser.json());
app.use(morgan(dev ? 'dev' : 'combined'));

app.use('/graphql', apollo.graphqlExpress(context => ({
  schema,
  context,
})));

if (dev) {
  app.use('/graphiql', apollo.graphiqlExpress({
    endpointURL: '/graphql',
  }));
}

module.exports = app;
