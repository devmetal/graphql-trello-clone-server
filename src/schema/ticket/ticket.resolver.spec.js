const mongoose = require('mongoose');
const resolver = require('./ticket.resolver');

const Ticket = mongoose.model('Ticket');
const Comment = mongoose.model('Comment');
const Board = mongoose.model('Board');
const HisotryRecord = mongoose.model('HistoryRecord');

process.env.TEST_SUITE = 'ticket-resolver';

const fillDb = async () => {
  const comment = await Comment.create({
    body: 'Test Comment',
  });

  const board = await Board.create({
    label: 'Test Board',
  });

  const history = await HisotryRecord.create({
    dateTime: new Date(),
    item: comment._id,
    itemType: 'comment',
  });

  const ticket = await Ticket.create({
    label: 'Test Ticket',
    body: 'Test ticket body',
    created: new Date(),
    board: board._id,
    comments: [comment._id],
    history: [history._id],
  });

  return ticket;
};

let ticket;

beforeEach(async (done) => {
  ticket = await fillDb(done);
  done();
});

it('ticket board resolver', async () => {
  const board = await resolver.board(ticket);
  expect(board.label).toEqual('Test Board');
});

it('ticket comments resolver', async () => {
  const comments = await resolver.comments(ticket);
  expect(comments).toHaveLength(1);
  expect(comments[0].body).toEqual('Test Comment');
});

it('ticket history resolver', async () => {
  const history = await resolver.history(ticket);
  expect(history).toHaveLength(1);
  expect(history[0].itemType).toEqual('comment');
});
