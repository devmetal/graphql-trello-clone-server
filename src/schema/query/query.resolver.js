const mongoose = require('mongoose');

const Ticket = mongoose.model('Ticket');
const User = mongoose.model('User');

module.exports = {
  ticket(parent, { id }) {
    return Ticket.findById(id);
  },
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
