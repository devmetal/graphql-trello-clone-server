require('../board/board.schema');
require('../ticket/ticket.schema');
require('../comment/comment.schema');
require('../history-record/history-record.schema');
const mhelper = require('../../helper/mongoose');
const resolver = require('./mutation.resolver');
const mongoose = require('mongoose');

const Board = mongoose.model('Board');
const Ticket = mongoose.model('Ticket');
const Comment = mongoose.model('Comment');
const HistoryRecord = mongoose.model('HistoryRecord');

beforeAll(async () => mhelper.connect());
afterAll(async () => mhelper.disconnect());

describe('mutations', () => {
  describe('board mutations', () => {
    let board;

    beforeEach(async () => {
      await Board.remove({});
      board = await resolver.createBoard(null, {
        label: 'Test Board',
      });
    });

    afterEach(async () => {
      await Board.remove({});
    });

    it('board created by createBoard', async () => {
      expect(await Board.findById(board._id).lean())
        .toMatchObject({
          label: 'Test Board',
        });
    });

    it('update board', async () => {
      await resolver.updateBoard(null, {
        id: board._id,
        label: 'Updated Label',
      });

      expect(await Board.findById(board._id).lean())
        .toMatchObject({
          label: 'Updated Label',
        });
    });

    it('remove board', async () => {
      await resolver.removeBoard(null, { id: board._id });
      expect(await Board.findById(board._id).lean())
        .toMatchObject({
          removed: true,
        });
    });
  });

  describe('ticket mutations', () => {
    let ticket;
    let board;
    let comment;

    beforeEach(async () => {
      await Board.remove({});
      await Ticket.remove({});
      await Comment.remove({});
      await HistoryRecord.remove({});

      board = await resolver.createBoard(null, {
        label: 'Test Board',
      });

      ticket = await resolver.createTicket(null, {
        boardId: board._id,
        label: 'Test Ticket',
        body: 'Test Ticket body',
      });
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
      const newBoard = await resolver.createBoard(null, { label: 'New Board' });

      await resolver.moveTicket(null, {
        id: ticket._id,
        boardId: newBoard._id,
      });

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
      await resolver.removeTicket(null, { id: ticket._id });
      expect(await Ticket.findById(ticket._id).lean())
        .toMatchObject({ removed: true });
    });

    it('comment ticket', async () => {
      comment = await resolver.commentTicket(null, {
        ticketId: ticket._id,
        body: 'New Comment',
      });

      expect(await Comment.findById(comment._id).lean())
        .toMatchObject({
          ticket: ticket._id,
          body: 'New Comment',
        });

      const ticketInDb = await Ticket.findById(ticket._id);
      expect(await HistoryRecord.findById(ticketInDb.history[1]).lean())
        .toMatchObject({
          itemType: 'comment',
          item: comment._id,
        });
    });
  });

  describe('comment mutations', () => {
    let comment;
    let ticket;

    beforeEach(async () => {
      ticket = await resolver.createTicket(null, {
        boardId: new mongoose.Types.ObjectId(),
        label: 'Test Ticket',
      });

      comment = await resolver.commentTicket(null, {
        ticketId: ticket._id,
        body: 'Test Comment',
      });
    });

    afterEach(async () => {
      await Ticket.remove({});
      await Comment.remove({});
    });

    it('comment created', async () => {
      expect(await Comment.findById(comment._id).lean())
        .toMatchObject({
          ticket: ticket._id,
          body: 'Test Comment',
        });
    });

    it('update comment', async () => {
      await resolver.updateComment(null, {
        id: comment._id,
        body: 'Updated Comment',
      });

      expect(await Comment.findById(comment._id).lean())
        .toMatchObject({
          ticket: ticket._id,
          body: 'Updated Comment',
        });
    });

    it('remove comment', async () => {
      await resolver.removeComment(null, { id: comment._id });

      expect(await Comment.findById(comment._id).lean())
        .toMatchObject({
          removed: true,
        });
    });
  });
});
