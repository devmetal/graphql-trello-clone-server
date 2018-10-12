const http = require('http');
const server = require('../../index');

process.env.TEST_SUITE = 'server-sanity';

const testPort = 5432;

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
