const axios = require('axios');
const config = require('../../config');

const base = config.get('teamServer');

module.exports = {
  okrs({ id }) {
    return axios
      .get(`${base}/teams/${id}/okrs`)
      .then(response => response.data);
  },
};
