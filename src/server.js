const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const auth = require('./auth');

const { mongo, env } = config.get();
const dev = env !== 'production';
const test = env === 'test';

if (!test) {
  mongoose.connect(mongo);
  mongoose.set('debug', true);
}

mongoose.set('useFindAndModify', false);
mongoose.Promise = Promise;

const app = express();

app.use(auth.initialize());
app.use(bodyParser.json());
app.use(morgan(dev ? 'dev' : 'combined'));

app.use('/graphql', (req, res, next) => {
  auth.authenticate((err, user) => {
    if (err) return next(err);
    req.user = user;
    return next();
  })(req, res, next);
});

app.get('/health', (req, res) => {
  res.json({ mem: process.memoryUsage() });
});

if (dev) {
  // Something graphiql????
}

module.exports = app;
