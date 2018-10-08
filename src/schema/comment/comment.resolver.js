const mongoose = require('mongoose');
const moment = require('moment');

const Ticket = mongoose.model('Ticket');
const Comment = mongoose.model('Comment');
const HistoryRecord = mongoose.model('HistoryRecord');

module.exports = {
  ticket(parent) {
    return parent.getTicket();
  },
  Mutation: {
    async commentTicket(_, { ticketId, body }) {
      const now = moment().toDate();

      const ticket = await Ticket.findById(ticketId);
      const comment = await Comment.create({
        ticket: ticketId,
        body,
      });

      const historyData = {
        dateTime: now,
        item: comment._id,
        itemType: 'comment',
      };

      const historyRecord = await HistoryRecord.create(historyData);

      ticket.comments.push(comment._id);
      ticket.history.push(historyRecord._id);
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
