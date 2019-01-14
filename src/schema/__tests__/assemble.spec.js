beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  jest.unmock('simple-graphql-assembler');
});

test('assemble throws exception when inner layer returns errors', () => {
  jest.doMock('simple-graphql-assembler', () => () => ({
    errors: ['Test'],
    typeDefs: null,
    resolvers: null,
  }));

  // eslint-disable-next-line
  const assemble = require('../assamble');
  expect(() => assemble()).toThrow();
});

test('assemble not throws exception when inner layer does not returns errors', () => {
  jest.doMock('simple-graphql-assembler', () => () => ({
    errors: null,
    typeDefs: null,
    resolvers: null,
  }));

  // eslint-disable-next-line
  const assemble = require('../assamble');
  expect(() => assemble()).not.toThrow();
});
