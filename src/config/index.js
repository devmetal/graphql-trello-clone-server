const convict = require('convict');

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
    default: 'mongodb://localhost/trello',
    format: '*',
    env: 'MONGO',
  },
});

const env = config.get('env');
config.loadFile(`./config/${env}.json`);
config.validate({ allowed: 'strict' });

module.exports = config;
