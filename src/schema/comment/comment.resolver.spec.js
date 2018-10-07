const mongoose = require('mongoose');
const resolver = require('./comment.resolver');

const Ticket = mongoose.model('Ticket');
const Comment = mongoose.model('Comment');

process.env.TEST_SUITE = 'comment-resolver';

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

  return comment;
};

let comment;

beforeEach(async (done) => {
  comment = await fillDb();
  done();
});

test('comment get ticket resolver', async () => {
  const ticket = await resolver.ticket(comment);
  expect(ticket.label).toEqual('Test Ticket');
});
