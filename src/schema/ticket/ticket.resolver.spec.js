const mongoose = require('mongoose');
const resolver = require('./ticket.resolver');

const Ticket = mongoose.model('Ticket');
const Comment = mongoose.model('Comment');
const Board = mongoose.model('Board');

const { Query: query, Mutation: mutation } = resolver;

process.env.TEST_SUITE = 'ticket-resolver';

const fillDb = async () => {
  const comment = await Comment.create({
    body: 'Test Comment',
  });

  const board = await Board.create({
    label: 'Test Board',
  });

  const ticket = await Ticket.create({
    label: 'Test Ticket',
    body: 'Test ticket body',
    created: new Date(),
    board: board._id,
    comments: [comment._id],
  });

  return ticket;
};

let ticket;

beforeEach(async done => {
  ticket = await fillDb(done);
  done();
});

test('get ticket with resolver', async () => {
  expect(await query.ticket(null, { id: ticket._id })).toMatchObject({
    label: 'Test Ticket',
    body: 'Test ticket body',
  });
});

test('ticket board resolver', async () => {
  const board = await resolver.board(ticket);
  expect(board.label).toEqual('Test Board');
});

test('ticket comments resolver', async () => {
  const comments = await resolver.comments(ticket);
  expect(comments).toHaveLength(1);
  expect(comments[0].body).toEqual('Test Comment');
});

test('create ticket', async () => {
  const board = await Board.create({
    label: 'Test Board',
  });

  const newTicket = await mutation.createTicket(
    null,
    {
      ticket: {
        boardId: board._id,
        label: 'Test Ticket',
        body: 'Test Ticket body',
      },
    },
    {},
  );

  expect(newTicket).toMatchObject({
    label: 'Test Ticket',
    board: board._id,
  });
});

it('move ticket', async () => {
  const newBoard = await Board.create({ label: 'New Board' });

  await mutation.moveTicket(
    null,
    {
      id: ticket._id,
      boardId: newBoard._id,
    },
    {},
  );

  const ticketInDb = await Ticket.findById(ticket._id).lean();

  expect(ticketInDb).toMatchObject({
    label: 'Test Ticket',
    board: newBoard._id,
  });
});

it('remove ticket', async () => {
  await mutation.removeTicket(null, { id: ticket._id }, {});
  expect(await Ticket.findById(ticket._id).lean()).toMatchObject({
    removed: true,
  });
});
