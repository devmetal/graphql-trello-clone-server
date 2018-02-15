require('./mongo');
const { join } = require('path');
const { readFileSync } = require('fs');
const Board = require('./board/board.resolver');
const Comment = require('./comment/comment.resolver');
const HistoryRecord = require('./history-record/history-record.resolver');
const HistoryItem = require('./history-record/history-item.resolver');
const Mutation = require('./mutation/mutation.resolver');
const Query = require('./query/query.resolver');
const Ticket = require('./ticket/ticket.resolver');
const Subscription = require('./subscription/subscription.resolver');

const gqlFile = file => join(__dirname, file);
const readFile = file => readFileSync(file, { encoding: 'utf8' });

/**
 * Schema .gql files
 */
const files = [
  'schema.gql',
  'user/user.gql',
  'board/board.gql',
  'comment/comment.gql',
  'history-record/history-item.gql',
  'history-record/history-record.gql',
  'mutation/mutation.gql',
  'query/query.gql',
  'ticket/ticket-input.gql',
  'ticket/ticket.gql',
  'subscription/subscription.gql',
];

const typeDefs = files
  .map(gqlFile)
  .map(readFile)
  .reduce((acc, curr) => `${acc}${curr}`, '');

const resolvers = {
  Query,
  Mutation,
  Ticket,
  Board,
  Comment,
  HistoryRecord,
  HistoryItem,
  Subscription,
};

module.exports = {
  typeDefs,
  resolvers,
};
