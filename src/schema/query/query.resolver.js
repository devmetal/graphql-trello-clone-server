const mongoose = require('mongoose');

const Board = mongoose.model('Board');
const Ticket = mongoose.model('Ticket');

module.exports = {
  boards() {
    return Board
      .find({ removed: false })
      .sort({ _id: 1 });
  },
  ticket(parent, { id }) {
    return Ticket.findById(id);
  },
};
