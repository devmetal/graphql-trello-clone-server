const axios = require('axios');
const config = require('../../config');

const base = config.get('teamServer');

module.exports = {
  team({ teamId }) {
    return axios
      .get(`${base}/teams/${teamId}`)
      .then(resp => resp.data);
  },
};
