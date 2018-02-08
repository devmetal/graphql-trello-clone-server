const pubSub = require('./pubsub');
const topics = require('./topics');

module.exports = {
  ticketAdded: {
    subscribe: () =>
      pubSub.asyncIterator(topics.TICKET_ADDED),
  },
  ticketUpdated: {
    subscribe: () =>
      pubSub.asyncIterator(topics.TICKET_UPDATED),
  },
  ticketRemoved: {
    subscribe: () =>
      pubSub.asyncIterator(topics.TICKET_REMOVED),
  },

  boardAdded: {
    subscribe: () =>
      pubSub.asyncIterator(topics.BOARD_ADDED),
  },
  boardUpdated: {
    subscribe: () =>
      pubSub.asyncIterator(topics.BOARD_UPDATED),
  },
  boardRemoved: {
    subscribe: () =>
      pubSub.asyncIterator(topics.BOARD_REMOVED),
  },
};
