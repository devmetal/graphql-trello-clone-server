const { graphql } = require('graphql');
const mongoose = require('mongoose');
const { makeExecutableSchema } = require('apollo-server');
const { typeDefs, resolvers } = require('../schema');

const Ticket = mongoose.model('Ticket');

process.env.TEST_SUITE = 'comment-graphql';

const schema = makeExecutableSchema({ typeDefs, resolvers });

const fillDb = async () =>
  Ticket.create({
    label: 'Test Ticket',
    body: 'Test Ticket',
    created: new Date(),
  });


describe('comment graphql', () => {
  let ticket;

  beforeEach(async () => {
    ticket = await fillDb();
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

      const { data } = await graphql(schema, query, {}, {});
      comment = data.commentTicket;
    });

    it('comment created', () => {
      expect(comment.body).toEqual('Test Comment');
    });

    it('ticket is accessible through comment', () => {
      expect(`${comment.ticket.id}`).toEqual(`${ticket._id}`);
    });

    test('update comment', async () => {
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

      const { data: { updateComment } } = await graphql(schema, query, {}, {});
      expect(updateComment.body).toEqual('Test Comment Updated');
    });

    test('remove comment', async () => {
      const query = `
        mutation {
          removeComment(id: "${comment.id}") {
            id
          }
        }
      `;

      const { data: { removeComment } } = await graphql(schema, query, {}, {});
      expect(removeComment.id).toEqual(comment.id);
    });
  });
});
