const axios = require('axios');
const mongoose = require('mongoose');
const { createToken } = require('../../auth');
const config = require('../../config');

const base = config.get('teamServer');

const User = mongoose.model('User');

module.exports = {
  team({ teamId }) {
    return axios.get(`${base}/teams/${teamId}`).then(resp => resp.data);
  },
  Query: {
    currentUser(parent, args, ctx) {
      if (!ctx.user) return null;
      return ctx.user;
    },
    users() {
      return User.find({}).sort({ _id: 1 });
    },
  },
  Mutation: {
    async createUser(parent, { email, password }) {
      const hased = await User.hash(password);
      return User.create({ email, password: hased });
    },

    login(parent, { email, password }) {
      return createToken({ email, password });
    },
  },
};
