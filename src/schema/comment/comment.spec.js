const mongoose = require('mongoose');

process.env.TEST_SUITE = 'comment-graphql';

const Ticket = mongoose.model('Ticket');
const Comment = mongoose.model('Comment');

const findComment = id => Comment.findById(id);

const createATicket = () =>
  Ticket.create({
    label: 'Test Ticket',
    body: 'Test Ticket',
    created: new Date(),
  });

describe('comment graphql', () => {
  let ticket;

  beforeEach(async () => {
    ticket = await createATicket();
  });

  describe('mutations', () => {
    let comment;

    beforeEach(async () => {
      const query = `
        mutation {
          commentTicket(
            ticketId: "${ticket._id}"
            body: "Test Comment"
          ) {
            id
            body
            ticket {
              id
            }
          }
        }
      `;

      ({ commentTicket: comment } = await __gqlQuery(query));
    });

    test('commentTicket', () => {
      expect(comment.body).toEqual('Test Comment');
    });

    test('ticket is accessible through comment', () => {
      expect(`${comment.ticket.id}`).toEqual(`${ticket._id}`);
    });

    test('updateComment', async () => {
      const query = `
        mutation {
          updateComment(
            id: "${comment.id}"
            body: "Test Comment Updated"
          ) {
            id
            body
          }
        }
      `;

      const { updateComment } = await __gqlQuery(query);
      expect(updateComment.body).toEqual('Test Comment Updated');
    });

    test('removeComment', async () => {
      const query = `
        mutation {
          removeComment(id: "${comment.id}") {
            id
          }
        }
      `;

      await __gqlQuery(query);
      const commentInDb = await findComment(comment.id);
      expect(commentInDb.removed).toBeTruthy();
    });
  });
});
