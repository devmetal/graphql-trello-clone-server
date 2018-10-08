const mongoose = require('mongoose');
const resolver = require('./comment.resolver');

process.env.TEST_SUITE = 'comment-resolver';

const Ticket = mongoose.model('Ticket');
const Comment = mongoose.model('Comment');

const { Mutation: mutation } = resolver;

const fillDb = async () => {
  const ticket = await Ticket.create({
    label: 'Test Ticket',
    body: 'Test Ticket',
    created: new Date(),
  });

  const comment = await Comment.create({
    ticket: ticket._id,
    body: 'Test comment',
  });

  return [comment, ticket];
};

let comment;
let ticket;

beforeEach(async done => {
  [comment, ticket] = await fillDb();
  done();
});

test('get ticket resolver', async () => {
  const resTicket = await resolver.ticket(comment);
  expect(resTicket.label).toEqual('Test Ticket');
});

test('create comment', async () => {
  const resComment = await mutation.commentTicket(
    null,
    { ticketId: ticket._id, body: 'Test Comment' },
    {},
  );

  expect(resComment).toMatchObject({
    ticket: ticket._id,
    body: 'Test Comment',
  });
});

test('update comment', async () => {
  await mutation.updateComment(
    null,
    {
      id: comment._id,
      body: 'Updated Comment',
    },
    {},
  );

  expect(await Comment.findById(comment._id).lean()).toMatchObject({
    ticket: ticket._id,
    body: 'Updated Comment',
  });
});

test('remove comment', async () => {
  await mutation.removeComment(null, { id: comment._id }, {});

  expect(await Comment.findById(comment._id).lean()).toMatchObject({
    removed: true,
  });
});
