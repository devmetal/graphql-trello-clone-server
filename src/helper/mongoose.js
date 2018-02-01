const mongoose = require('mongoose');
const config = require('../config');

const mongo = config.get('mongo');

module.exports = {
  connect: () => mongoose.connect(mongo),
  disconnect: () => mongoose.disconnect(),
};
