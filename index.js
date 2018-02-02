const config = require('./src/config');
const server = require('./src/server');

const { port } = config.get();

server.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server listen on ${port}`);
});
