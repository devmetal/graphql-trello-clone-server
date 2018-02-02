const { makeExecutableSchema } = require('graphql-tools');
const { typeDefs, resolvers } = require('./schema');

module.exports = makeExecutableSchema({ typeDefs, resolvers });
