// eslint-disable-next-line
const MongoMemorySrv = require('mongodb-memory-server').default;
const mongoose = require('mongoose');

const { graphql } = require('graphql');
const { makeExecutableSchema } = require('apollo-server');
const { typeDefs, resolvers } = require('./src/schema/schema');

const mongoServer = new MongoMemorySrv();

// Create a schema for all tests
const gqlSchema = makeExecutableSchema({ typeDefs, resolvers });

// Mongoose models
require('./src/schema/mongo');

// Set mogno use native promises
mongoose.Promise = Promise;

// Global query helper
global.__gqlQuery = async (query, root = {}, ctx = {}, ...rest) => {
  const { data, errors } = await graphql(gqlSchema, query, root, ctx, ...rest);

  if (errors) {
    throw errors;
  }

  return data;
};

// Util functions
const clearMongoDb = () => {
  const { connection: { collections } } = mongoose;

  if (collections) {
    const tasks = Object.keys(collections)
      .map(k => collections[k].deleteMany());

    return Promise.all(tasks);
  }

  return Promise.resolve();
};

const connectMongoDb = async () => {
  const connSrt = await mongoServer.getConnectionString(process.env.TEST_SUITE);

  const mongooseOpts = {
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    useNewUrlParser: true,
  };

  return mongoose.connect(connSrt, mongooseOpts);
};

const disconnectMongoDb = () => mongoose.disconnect();
const mongoDbDisconnected = () => mongoose.connection.readyState === 0;

beforeEach(async (done) => {
  if (mongoDbDisconnected()) {
    await connectMongoDb();
  }
  await clearMongoDb();
  done();
});

afterEach(() => {
  disconnectMongoDb();
});
