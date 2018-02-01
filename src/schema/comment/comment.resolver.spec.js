require('./comment.schema');
require('../ticket/ticket.schema');
const mhelper = require('../../helper/mongoose');
const mongoose = require('mongoose');
const resolver = require('./comment.resolver');

const Ticket = mongoose.model('Ticket');
const Comment = mongoose.model('Comment');

const clearDb = async () => {
  await Ticket.remove({});
  await Comment.remove({});
};

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

beforeAll(async (done) => {
  await mhelper.connect();
  done();
});

afterAll(async (done) => {
  await mhelper.disconnect();
  done();
});

beforeEach(async (done) => {
  await clearDb();
  comment = await fillDb();
  done();
});

afterEach(async (done) => {
  await clearDb();
  done();
});

it('comment get ticket resolver', async () => {
  const ticket = await resolver.ticket(comment);
  expect(ticket.label).toEqual('Test Ticket');
});
