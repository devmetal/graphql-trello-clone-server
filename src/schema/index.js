const { gql } = require('apollo-server');
const { typeDefs, resolvers } = require('./schema');

module.exports = {
  typeDefs: gql`${typeDefs}`,
  resolvers,
};
