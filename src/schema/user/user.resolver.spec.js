const mongoose = require('mongoose');
const resolver = require('./user.resolver');
const { findUserByToken } = require('../../auth');

process.env.TEST_SUITE = 'user-resolver';

const User = mongoose.model('User');
const { Query: query, Mutation: mutation } = resolver;

beforeEach(async () => {
  const password = await User.hash('p4ssword');

  await User.create({
    email: 'test@test.com',
    password,
  });
});

test('get users query', async () => {
  const users = await query.users();
  expect(users).toHaveLength(1);
  expect(users[0]).toMatchObject({
    email: 'test@test.com',
  });
});

test('create user mutation', async () => {
  const token = await mutation.createUser(null, {
    email: 'test2@test.com',
    password: 'p4ssword',
  });
  const userInDb = await findUserByToken(token);
  expect(userInDb).toMatchObject({ email: 'test2@test.com' });
});

test('login mutation', async () => {
  const token = await mutation.login(null, {
    email: 'test@test.com',
    password: 'p4ssword',
  });
  const userInDb = await findUserByToken(token);
  expect(userInDb).toMatchObject({ email: 'test@test.com' });
});
