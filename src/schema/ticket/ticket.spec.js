const { graphql } = require('graphql');
const schema = require('../index');
const mHelper = require('../../helper/mongoose');
const mongoose = require('mongoose');

beforeAll(async () => mHelper.connect());
afterAll(async () => {
  await mHelper.clearAll();
  await mHelper.disconnect();
});

describe('ticket graphql', () => {
  describe('mutations', () => {
    let ticket;

    beforeAll(async () => {
      const query = `
        mutation CreateTicket($ticket: TicketInput!){
          createTicket(ticket: $ticket) {
            id
            label
            body
          }
        }
      `;

      const { data } = await graphql(schema, query, {}, {}, {
        ticket: {
          boardId: new mongoose.Types.ObjectId(),
          label: 'Test Ticket',
          body: 'Test body',
        },
      });

      ticket = data.createTicket;
    });

    it('createTicket', () => {
      expect(ticket.label).toEqual('Test Ticket');
    });

    it('moveTicket', async () => {
      const id = new mongoose.Types.ObjectId();
      const query = `
        mutation {
          moveTicket(
            id: "${ticket.id}",
            boardId: "${id.toString()}"
          ) {
            id
          }
        }
      `;

      const { errors } = await graphql(schema, query, {}, {});
      expect(errors).toBeUndefined();
    });

    it('removeTicket', async () => {
      const query = `
        mutation {
          removeTicket(id: "${ticket.id}") {
            id
          }
        }
      `;

      const { data } = await graphql(schema, query, {}, {});
      expect(data.removeTicket.id).toEqual(ticket.id);
    });
  });
});
