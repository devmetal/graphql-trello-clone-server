const mongoose = require('mongoose');
const moment = require('moment');

const Board = mongoose.model('Board');
const Ticket = mongoose.model('Ticket');
const Comment = mongoose.model('Comment');
const HistoryRecord = mongoose.model('HistoryRecord');

module.exports = {
  createBoard(_, { label }) {
    const board = new Board({ label });
    return board.save();
  },

  updateBoard(_, { id, label }) {
    return Board.findOneAndUpdate(
      { _id: id },
      { $set: { label } },
      { new: true },
    );
  },

  removeBoard(_, { id }) {
    return Board.findOneAndUpdate(
      { _id: id },
      { $set: { removed: true } },
      { new: true },
    );
  },

  async createTicket(_, args) {
    const { ticket: { boardId: board, ...rest } } = args;

    const now = moment().toDate();

    const historyData = {
      dateTime: now,
      item: board,
      itemType: 'board',
    };

    const historyRecord = await HistoryRecord
      .create(historyData);

    const ticketData = Object.assign({}, rest, {
      history: [historyRecord._id],
      created: now,
      board,
    });

    return Ticket.create(ticketData);
  },

  async moveTicket(_, { id, boardId: board }) {
    const now = moment().toDate();

    const historyData = {
      dateTime: now,
      item: board,
      itemType: 'board',
    };

    const historyRecord = await HistoryRecord
      .create(historyData);

    return Ticket.findOneAndUpdate(
      { _id: id },
      {
        $set: { board },
        $push: { history: historyRecord._id },
      },
      { new: true },
    );
  },

  updateTicketBody(_, { id, body }) {
    return Ticket.findOneAndUpdate(
      { _id: id },
      { $set: { body } },
      { new: true },
    );
  },

  updateTicketLabel(_, { id, label }) {
    return Ticket.findOneAndUpdate(
      { _id: id },
      { $set: { label } },
      { new: true },
    );
  },

  removeTicket(_, { id }) {
    return Ticket.findOneAndUpdate(
      { _id: id },
      { $set: { removed: true } },
      { new: true },
    );
  },

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

    const historyRecord = await HistoryRecord
      .create(historyData);

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
};
