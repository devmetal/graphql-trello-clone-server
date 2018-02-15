const { withFilter } = require('graphql-subscriptions');
const pubSub = require('./pubsub');
const topics = require('./topics');

const withUserIdFilter = iterator => withFilter(
  iterator,
  (payload, args, { user }) => payload.user.id !== user.id,
);

module.exports = {
  ticketAdded: {
    subscribe: withUserIdFilter(() => pubSub.asyncIterator(topics.TICKET_ADDED)),
  },
  ticketUpdated: {
    subscribe: withUserIdFilter(() => pubSub.asyncIterator(topics.TICKET_UPDATED)),
  },
  ticketRemoved: {
    subscribe: withUserIdFilter(() => pubSub.asyncIterator(topics.TICKET_REMOVED)),
  },

  boardAdded: {
    subscribe: withUserIdFilter(() => pubSub.asyncIterator(topics.BOARD_ADDED)),
  },
  boardUpdated: {
    subscribe: withUserIdFilter(() => pubSub.asyncIterator(topics.BOARD_UPDATED)),
  },
  boardRemoved: {
    subscribe: withUserIdFilter(() => pubSub.asyncIterator(topics.BOARD_REMOVED)),
  },
};
