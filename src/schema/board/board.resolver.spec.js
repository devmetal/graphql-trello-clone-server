const mongoose = require('mongoose');
const resolver = require('./board.resolver');

process.env.TEST_SUITE = 'board-resolver';

const { Query: query, Mutation: mutation } = resolver;

const Board = mongoose.model('Board');
const Ticket = mongoose.model('Ticket');

const fillDb = async () => {
  const board = await Board.create({
    label: 'Test Board 1',
  });

  await Board.create({
    label: 'Test Board 2',
  });

  await Ticket.create({
    label: 'Test Ticket 1',
    body: 'Test ticket 1 body',
    created: new Date(),
    board: board._id,
  });

  await Ticket.create({
    label: 'Test Ticket 2',
    body: 'Test ticket 2 body',
    created: new Date(),
    board: board._id,
  });

  return board;
};

let board;

beforeEach(async (done) => {
  board = await fillDb();
  done();
});

test('get boards resolver', async () => {
  const boards = await query.boards();
  expect(boards).toHaveLength(2);
  expect(boards[0].label).toEqual('Test Board 1');
  expect(boards[1].label).toEqual('Test Board 2');
});

test('board get tickets resolver', async () => {
  const tickets = await resolver.tickets(board);
  expect(tickets).toHaveLength(2);
  expect(tickets[0].label).toEqual('Test Ticket 1');
  expect(tickets[1].label).toEqual('Test Ticket 2');
});

test('create board', async () => {
  const { _id } = await mutation.createBoard(null, { label: 'Test Board' });
  expect(await Board.findById(_id).lean())
    .toMatchObject({
      label: 'Test Board',
    });
});

test('update board', async () => {
  await mutation.updateBoard(null, {
    id: board._id,
    label: 'Updated Label',
  }, { user: null });

  expect(await Board.findById(board._id).lean())
    .toMatchObject({
      label: 'Updated Label',
    });
});

test('remove board', async () => {
  await mutation.removeBoard(null, { id: board._id }, { user: null });
  expect(await Board.findById(board._id).lean())
    .toMatchObject({
      removed: true,
    });
});
