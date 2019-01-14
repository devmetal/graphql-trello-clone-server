const mongoose = require('mongoose');

const Ticket = mongoose.model('Ticket');
const Comment = mongoose.model('Comment');

module.exports = {
  __name: 'Comment',
  ticket(parent) {
    return parent.getTicket();
  },
  Mutation: {
    async commentTicket(_, { ticketId, body }) {
      const ticket = await Ticket.findById(ticketId);

      const comment = await Comment.create({
        ticket: ticketId,
        body,
      });

      ticket.comments.push(comment._id);
      await ticket.save();

      return comment;
    },

    updateComment(_, { id, body }) {
      return Comment.findOneAndUpdate(
        { _id: id },
        { $set: { body } },
        { new: true },
      );
    },

    removeComment(_, { id }) {
      return Comment.findOneAndUpdate(
        { _id: id },
        { $set: { removed: true } },
        { new: true },
      );
    },
  },
};
