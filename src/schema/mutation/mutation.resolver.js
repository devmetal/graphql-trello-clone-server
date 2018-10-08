const mongoose = require('mongoose');
const { createToken } = require('../../auth');

const User = mongoose.model('User');

module.exports = {
  async createUser(parent, { email, password }) {
    const hased = await User.hash(password);
    return User.create({ email, password: hased });
  },

  login(parent, { email, password }) {
    return createToken({ email, password });
  },
};
