const mongoose = require('mongoose');

process.env.TEST_SUITE = 'ticket-graphql';

const Board = mongoose.model('Board');
const Ticket = mongoose.model('Ticket');

describe('ticket graphql', () => {
  describe('mutations', () => {
    let ticket;
    let board;

    beforeEach(async () => {
      board = await Board.create({ label: 'Test Board' });

      const query = `
        mutation CreateTicket($ticket: TicketInput!){
          createTicket(ticket: $ticket) {
            id
            label
            body
          }
        }
      `;

      const qInput = {
        ticket: {
          boardId: board._id,
          label: 'Test Ticket',
          body: 'Test body',
        },
      };

      ({ createTicket: ticket } = await __gqlQuery(query, {}, {}, qInput));
    });

    test('createTicket', () => {
      expect(ticket.label).toEqual('Test Ticket');
    });

    test('ticket avaiable through board', async () => {
      const query = `{
        boards {
          tickets {
            id
            label
          }
        }
      }`;

      const { boards } = await __gqlQuery(query);
      expect(boards[0].tickets[0].label).toEqual('Test Ticket');
    });

    test('moveTicket', async () => {
      const target = await Board.create({ label: 'Test Board' });

      const query = `
        mutation {
          moveTicket(
            id: "${ticket.id}",
            boardId: "${target._id}"
          ) {
            id
          }
        }
      `;

      await __gqlQuery(query);

      const ticketInDb = await Ticket.findById(ticket.id);
      expect(ticketInDb.board).toEqual(target._id);
    });

    test('removeTicket', async () => {
      const query = `
        mutation {
          removeTicket(id: "${ticket.id}") {
            id
          }
        }
      `;

      await __gqlQuery(query);

      const ticketInDb = await Ticket.findById(ticket.id);
      expect(ticketInDb.removed).toBeTruthy();
    });
  });
});
