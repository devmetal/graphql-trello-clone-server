const mongoose = require('mongoose');

process.env.TEST_SUITE = 'board-graphql';

const Board = mongoose.model('Board');
const findBoard = id => Board.findById(id);

describe('board graphql', () => {
  describe('mutations', () => {
    let board;

    beforeEach(async () => {
      const query = `
        mutation {
          createBoard(label: "Test Board") {
            id
            label
            tickets {
              id
            }
          }
        }
      `;

      ({ createBoard: board } = await __gqlQuery(query));
    });

    test('createBoard', async () => {
      expect(board.label).toEqual('Test Board');
      expect(board.tickets).toEqual([]);
    });

    test('updateBoard', async () => {
      const query = `
        mutation {
          updateBoard(id: "${board.id}", label: "Updated") {
            label
          }
        }
      `;

      const { updateBoard } = await __gqlQuery(query);
      expect(updateBoard.label).toEqual('Updated');
    });

    test('removeBoard', async () => {
      const query = `
        mutation {
          removeBoard(id: "${board.id}") {
            id
          }
        }
      `;

      await __gqlQuery(query);

      const boardInDb = await findBoard(board.id);
      expect(boardInDb.removed).toBeTruthy();
    });
  });
});

