require('./mongo');
const assemble = require('./assamble');

const { typeDefs, resolvers } = assemble();

module.exports = {
  typeDefs,
  resolvers,
};
