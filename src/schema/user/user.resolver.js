const mongoose = require('mongoose');
const { createToken } = require('../../auth');

const User = mongoose.model('User');

module.exports = {
  __name: 'User',
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
      const count = await User.countDocuments({ email });

      if (count) {
        throw new Error('Email already exists');
      }

      try {
        const hased = await User.hash(password);
        await User.create({ email, password: hased });
      } catch (e) {
        throw new Error('User creation failed');
      }

      return createToken({ email, password });
    },

    login(parent, { email, password }) {
      return createToken({ email, password });
    },
  },
};
