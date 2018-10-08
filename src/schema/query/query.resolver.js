const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = {
  currentUser(parent, args, ctx) {
    if (!ctx.user) return null;
    return ctx.user;
  },
  users() {
    return User
      .find({})
      .sort({ _id: 1 });
  },
};
