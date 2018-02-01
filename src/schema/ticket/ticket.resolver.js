const moment = require('moment');

module.exports = {
  board(parent) {
    return parent.getBoard();
  },
  created({ created }) {
    return moment(created).format();
  },
  comments(parent) {
    return parent.getComments();
  },
  history(parent) {
    return parent.getHistory();
  },
};
