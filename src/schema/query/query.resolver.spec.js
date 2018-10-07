const mongoose = require('mongoose');
const resolver = require('./query.resolver');

const Board = mongoose.model('Board');
const Ticket = mongoose.model('Ticket');

process.env.TEST_SUITE = 'query';

const fillDb = async () => {
  const boards = await Board.create([{
    label: 'Test board 1',
  }, {
    label: 'Test board 2',
  }]);

  const ticket = await Ticket.create({
    label: 'Test ticket 1',
    body: 'Test body',
    created: new Date(),
    board: boards[0]._id,
  });

  return ticket._id;
};

let ticketId;

beforeEach(async () => {
  ticketId = await fillDb();
});

it('query boards resolver', async () => {
  const boards = await resolver.boards();
  expect(boards).toHaveLength(2);
  expect(boards[0].label).toEqual('Test board 1');
  expect(boards[1].label).toEqual('Test board 2');
});

it('query ticket resolver', async () => {
  const ticket = await resolver.ticket(null, { id: ticketId });
  expect(ticket.label).toEqual('Test ticket 1');
});
