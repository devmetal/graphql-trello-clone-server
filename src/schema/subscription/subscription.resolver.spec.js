const subscriptions = require('./subscription.resolver');
const pubsub = require('./pubsub');
const topics = require('./topics');

process.env.TEST_SUITE = 'subscriptions';

const ticket = {
  label: 'Test Ticket',
  body: 'Test ticket body',
};

const user1 = { id: 1 };
const user2 = { id: 2 };

let ticketAdded;
let ticketUpdated;
let ticketRemoved;

beforeEach(async () => {
  ticketAdded = await subscriptions.ticketAdded.subscribe(null, null, {
    sUser: user1,
  });
  ticketUpdated = await subscriptions.ticketUpdated.subscribe(null, null, {
    sUser: user1,
  });
  ticketRemoved = await subscriptions.ticketRemoved.subscribe(null, null, {
    sUser: user1,
  });

  pubsub.publish(topics.TICKET_ADDED, { ticketAdded: ticket, user: user2 });
  pubsub.publish(topics.TICKET_UPDATED, { ticketUpdated: ticket, user: user2 });
  pubsub.publish(topics.TICKET_REMOVED, { ticketRemoved: ticket, user: user2 });
});

test('ticketAdded ', async () => {
  const { value } = await ticketAdded.next();
  expect(value.ticketAdded).toMatchObject(ticket);
});

test('ticketUpdated', async () => {
  const { value } = await ticketUpdated.next();
  expect(value.ticketUpdated).toMatchObject(ticket);
});

test('ticketRemoved', async () => {
  const { value } = await ticketRemoved.next();
  expect(value.ticketRemoved).toMatchObject(ticket);
});
