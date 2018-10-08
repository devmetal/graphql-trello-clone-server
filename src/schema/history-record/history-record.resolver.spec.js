const mongoose = require('mongoose');
const resolver = require('./history-record.resolver');

const HistoryRecord = mongoose.model('HistoryRecord');
const Comment = mongoose.model('Comment');
const Board = mongoose.model('Board');

process.env.TEST_SUITE = 'history-record';

const fillDb = async () => {
  const board = await Board.create({
    label: 'Test Board',
  });

  const comment = await Comment.create({
    body: 'Test comment',
  });

  const histories = await HistoryRecord.create([
    {
      dateTime: new Date(),
      item: board._id,
      itemType: 'board',
    },
    {
      dateTime: new Date(),
      item: comment._id,
      itemType: 'comment',
    },
  ]);

  return histories;
};

let histories;

beforeEach(async done => {
  histories = await fillDb();
  done();
});

it('first hitory record item resolver', async () => {
  const board = await resolver.item(histories[0]);
  expect(board.label).toEqual('Test Board');
});

it('sec history record item resolver', async () => {
  const comment = await resolver.item(histories[1]);
  expect(comment.body).toEqual('Test comment');
});
