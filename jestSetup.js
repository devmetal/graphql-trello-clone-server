const mongoose = require('mongoose');

// Mongoose models
require('./src/schema/mongo');

// Util functions
const clearMongoDb = () => {
  const { connection: { collections } } = mongoose;

  if (collections) {
    const tasks = Object.keys(collections)
      .map(k => collections[k].remove());

    return Promise.all(tasks);
  }

  return Promise.resolve();
};

const connectMongoDb = () => {
  const uri = `mongodb://localhost:27017/${process.env.TEST_SUITE}`;
  return mongoose.connect(uri, {
    useNewUrlParser: true,
  });
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
