const mongoose = require('mongoose');
const moment = require('moment');

const pubsub = require('../subscription/pubsub');
const topics = require('../subscription/topics');

const Ticket = mongoose.model('Ticket');

module.exports = {
  __name: 'Ticket',
  board(parent) {
    return parent.getBoard();
  },
  created({ created }) {
    return moment(created).format();
  },
  comments(parent) {
    return parent.getComments();
  },
  Query: {
    ticket(_, { id }) {
      return Ticket.findById(id);
    },
  },
  Mutation: {
    async createTicket(_, args, { user }) {
      const {
        ticket: { boardId: board, ...rest },
      } = args;

      const now = moment().toDate();

      const ticketData = Object.assign({}, rest, {
        created: now,
        board,
      });

      const newTicket = await Ticket.create(ticketData);

      pubsub.publish(topics.TICKET_ADDED, { ticketAdded: newTicket, user });

      return newTicket;
    },

    async moveTicket(_, { id, boardId: board }, { user }) {
      const ticket = await Ticket.findById(id);

      pubsub.publish(topics.TICKET_REMOVED, {
        ticketRemoved: ticket,
        user,
      });

      const movedTicket = await Ticket.findOneAndUpdate(
        { _id: id },
        {
          $set: { board },
        },
        { new: true },
      );

      pubsub.publish(topics.TICKET_ADDED, {
        ticketAdded: movedTicket,
        user,
      });

      return movedTicket;
    },

    async updateTicket(_, { id, ticket }, { user }) {
      const ticketUpdated = await Ticket.findOneAndUpdate(
        { _id: id },
        { $set: ticket },
        { new: true },
      );

      pubsub.publish(topics.TICKET_UPDATED, {
        ticketUpdated,
        user,
      });

      return ticketUpdated;
    },

    async removeTicket(_, { id }, { user }) {
      const ticketRemoved = await Ticket.findOneAndUpdate(
        { _id: id },
        { $set: { removed: true } },
        { new: true },
      );

      pubsub.publish(topics.TICKET_REMOVED, {
        ticketRemoved,
        user,
      });

      return ticketRemoved;
    },
  },
};
