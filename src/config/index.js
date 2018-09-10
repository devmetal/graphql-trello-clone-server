const convict = require('convict');
const path = require('path');

const config = convict({
  env: {
    doc: 'The environment',
    format: '*',
    env: 'NODE_ENV',
    default: 'development',
  },
  port: {
    doc: 'Application port',
    format: '*',
    env: 'PORT',
    default: 5432,
  },
  mongo: {
    doc: 'MongoDB uri',
    default: 'mongodb://localhost/trello-clone',
    format: '*',
    env: 'MONGO',
  },
  teamServer: {
    doc: 'Team Server URL',
    default: 'http://localhost:3004',
    format: '*',
    env: 'TEAM_SERVER_URL',
  },
});

const env = config.get('env');
config.loadFile(path.join(__dirname, `${env}.json`));
config.validate({ allowed: 'strict' });

module.exports = config;
