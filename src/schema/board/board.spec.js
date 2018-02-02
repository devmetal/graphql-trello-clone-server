const { graphql } = require('graphql');
const schema = require('../index');
const mHelper = require('../../helper/mongoose');

beforeAll(async () => mHelper.connect());
afterAll(async () => {
  await mHelper.clearAll();
  await mHelper.disconnect();
});

describe('board graphql', () => {
  describe('mutations', () => {
    let board;

    beforeAll(async () => {
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

      const { data } = await graphql(schema, query, {}, {});
      board = data.createBoard;
    });

    it('createBoard', async () => {
      expect(board.label).toEqual('Test Board');
      expect(board.tickets).toEqual([]);
    });

    it('updateBoard', async () => {
      const query = `
        mutation {
          updateBoard(id: "${board.id}", label: "Updated") {
            label
          }
        }
      `;

      const { data } = await graphql(schema, query, {}, {});
      expect(data.updateBoard.label).toEqual('Updated');
    });

    it('removeBoard', async () => {
      const query = `
        mutation {
          removeBoard(id: "${board.id}") {
            id
          }
        }
      `;

      const { data } = await graphql(schema, query, {}, {});
      expect(data.removeBoard.id).toEqual(board.id);
    });
  });
});

