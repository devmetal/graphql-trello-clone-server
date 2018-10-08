const mongoose = require('mongoose');
const resolver = require('./mutation.resolver');

const Board = mongoose.model('Board');
const Ticket = mongoose.model('Ticket');
const Comment = mongoose.model('Comment');
const HistoryRecord = mongoose.model('HistoryRecord');

process.env.TEST_SUITE = 'mutation';

const ctx = { user: null };

describe('mutations', () => {
  describe('ticket mutations', () => {
    let ticket;
    let board;

    beforeEach(async () => {
      await Board.remove({});
      await Ticket.remove({});
      await Comment.remove({});
      await HistoryRecord.remove({});

      board = await Board.create({
        label: 'Test Board',
      });

      ticket = await resolver.createTicket(null, {
        ticket: {
          boardId: board._id,
          label: 'Test Ticket',
          body: 'Test Ticket body',
        },
      }, ctx);
    });

    afterEach(async () => {
      await Board.remove({});
      await Ticket.remove({});
      await Comment.remove({});
      await HistoryRecord.remove({});
    });

    it('ticket created by mutation with history', async () => {
      const ticketInDb = await Ticket.findById(ticket._id).lean();
      const historyInDb = await HistoryRecord.findById(ticketInDb.history[0]).lean();

      expect(ticketInDb).toMatchObject({
        label: 'Test Ticket',
        board: board._id,
        history: [historyInDb._id],
      });

      expect(historyInDb).toMatchObject({
        item: board._id,
        itemType: 'board',
      });
    });

    it('move ticket', async () => {
      const newBoard = await Board.create({ label: 'New Board' });

      await resolver.moveTicket(null, {
        id: ticket._id,
        boardId: newBoard._id,
      }, ctx);

      const ticketInDb = await Ticket.findById(ticket._id).lean();
      const historyInDbFirst = await HistoryRecord.findById(ticketInDb.history[0]).lean();
      const historyInDbSec = await HistoryRecord.findById(ticketInDb.history[1]).lean();

      expect(ticketInDb).toMatchObject({
        label: 'Test Ticket',
        board: newBoard._id,
      });

      expect(historyInDbFirst).toMatchObject({
        item: board._id,
        itemType: 'board',
      });

      expect(historyInDbSec).toMatchObject({
        item: newBoard._id,
        itemType: 'board',
      });
    });

    it('remove ticket', async () => {
      await resolver.removeTicket(null, { id: ticket._id }, ctx);
      expect(await Ticket.findById(ticket._id).lean())
        .toMatchObject({ removed: true });
    });
  });
});
