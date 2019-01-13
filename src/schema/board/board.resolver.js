const mongoose = require('mongoose');
const pubsub = require('../subscription/pubsub');
const topics = require('../subscription/topics');

const Board = mongoose.model('Board');

module.exports = {
  __name: 'Board',

  tickets(parent) {
    return parent.getTickets();
  },
  Query: {
    boards() {
      return Board.find({ removed: false }).sort({ _id: 1 });
    },
  },
  Mutation: {
    createBoard(_, { label }) {
      const board = new Board({ label });
      return board.save();
    },

    async updateBoard(_, { id, label }, { user }) {
      const boardUpdated = await Board.findOneAndUpdate(
        { _id: id },
        { $set: { label } },
        { new: true },
      );

      pubsub.publish(topics.BOARD_UPDATED, {
        boardUpdated,
        user,
      });

      return boardUpdated;
    },

    removeBoard(_, { id }) {
      return Board.findOneAndUpdate(
        { _id: id },
        { $set: { removed: true } },
        { new: true },
      );
    },
  },
};
