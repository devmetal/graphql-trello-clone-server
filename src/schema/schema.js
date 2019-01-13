require('./mongo');

const assemble = require('simple-graphql-assembler');

const { typeDefs, resolvers, errors } = assemble(__dirname);

if (errors) {
  // eslint-disable-next-line
  console.log(errors);
  process.exit(1);
}

module.exports = {
  typeDefs,
  resolvers,
};
