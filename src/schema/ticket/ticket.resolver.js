const moment = require('moment');

module.exports = {
  board(parent) {
    return parent.getBoard();
  },
  created({ created }) {
    return moment(created).format();
  },
  comments(parent) {
    return parent.getComment();
  },
  history(parent) {
    return parent.getHistory();
  },
};
