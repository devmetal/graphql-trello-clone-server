require('../../helper/mongoose');
require('./board.schema');
require('../ticket/ticket.schema');
const mongoose = require('mongoose');
const resolver = require('./board.resolver');

const Board = mongoose.model('Board');
const Ticket = mongoose.model('Ticket');

const clearDb = async () => {
  await Board.remove({});
  await Ticket.remove({});
};

const fillDb = async () => {
  const board = await Board.create({
    label: 'Test Board',
  });

  await Ticket.create([{
    label: 'Test Ticket 1',
    body: 'Test ticket 1 body',
    created: new Date(),
    board: board._id,
  }, {
    label: 'Test Ticket 2',
    body: 'Test ticket 2 body',
    created: new Date(),
    board: board._id,
  }]);

  return board;
};

let board;

beforeEach(async (done) => {
  await clearDb();
  board = await fillDb();
  done();
});

afterEach(async (done) => {
  await clearDb();
  done();
});

it('board get tickets resolver', async () => {
  const tickets = await resolver.tickets(board);
  expect(tickets).toHaveLength(2);
  expect(tickets[0].label).toEqual('Test Ticket 1');
  expect(tickets[1].label).toEqual('Test Ticket 2');
});
