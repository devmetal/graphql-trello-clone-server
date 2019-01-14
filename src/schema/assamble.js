const assemble = require('simple-graphql-assembler');

module.exports = () => {
  const { typeDefs, resolvers, errors } = assemble(__dirname);

  if (errors) {
    throw new Error(errors);
  }

  return { typeDefs, resolvers };
};
