const http = require('http');
const mongoose = require('mongoose');
const server = require('../../index');

process.env.TEST_SUITE = 'server-sanity';

const Board = mongoose.model('Board');
const Ticket = mongoose.model('Ticket');

const testPort = 5432;

const gqlRequest = token => (query, variables = {}) =>
  new Promise((resolve, reject) => {
    const options = {
      port: testPort,
      method: 'POST',
      path: '/graphql',
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `bearer ${token}`;
    }

    options.headers = headers;

    const req = http.request(options, res => {
      const response = [];

      res.setEncoding('utf8');

      res.on('data', chunk => {
        response.push(chunk);
      });

      res.on('end', () => {
        const str = response.join('');
        resolve(JSON.parse(str));
      });
    });

    req.on('error', reject);

    req.write(JSON.stringify({ query, variables }));

    req.end();
  });

beforeAll(done => {
  server.listen(testPort, done);
});

afterAll(done => {
  server.close(done);
});

test('server is running and ready for tests', done => {
  http.get(`http://localhost:${testPort}/health`, res => {
    const { statusCode } = res;
    expect(statusCode).toEqual(200);
    done();
  });
});

describe('graphql server', () => {
  let token;
  let queryWithToken;

  beforeEach(async () => {
    const createUser = `
      mutation {
        createUser(email: "test@test.com", password: "test")
      }
    `;

    const { data } = await gqlRequest()(createUser);
    token = data.createUser;

    queryWithToken = gqlRequest(token);
  });

  test('login', async () => {
    const login = `
      mutation {
        login(email: "test@test.com", password: "test")
      }
    `;

    expect(await gqlRequest()(login)).toMatchObject({
      data: {
        login: token,
      },
    });
  });

  test('token is a valid jwt token', async () => {
    const currentUser = `{
      currentUser {
        email
      }
    }`;

    expect(await queryWithToken(currentUser)).toMatchObject({
      data: {
        currentUser: {
          email: 'test@test.com',
        },
      },
    });
  });

  test('create board', async () => {
    const createBoard = `
      mutation {
        createBoard(label: "test") {
          id
          label
        }
      }
    `;

    const {
      data: {
        createBoard: { id, label },
      },
    } = await queryWithToken(createBoard);

    expect(label).toEqual('test');
    expect(await Board.findById(id).lean()).toMatchObject({
      label: 'test',
    });
  });

  test('create ticket', async () => {
    const createBoard = `
      mutation {
        createBoard(label: "test") {
          id
          label
        }
      }
    `;

    const createTicket = `
      mutation CreateTicket($ticket: TicketInput!){
        createTicket(ticket: $ticket) {
          id
          label
          body
        }
      }
    `;

    const {
      data: {
        createBoard: { id: boardId },
      },
    } = await queryWithToken(createBoard);

    const {
      data: {
        createTicket: { id, label, body },
      },
    } = await queryWithToken(createTicket, {
      ticket: {
        boardId,
        label: 'Test Ticket',
        body: 'Test body',
      },
    });

    expect(label).toEqual('Test Ticket');
    expect(body).toEqual('Test body');
    expect(await Ticket.findById(id).lean()).toMatchObject({
      label: 'Test Ticket',
      body: 'Test body',
    });
  });
});
