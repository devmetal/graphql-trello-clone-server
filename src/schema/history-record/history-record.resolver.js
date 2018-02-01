const moment = require('moment');

module.exports = {
  dateTime({ dateTime }) {
    return moment(dateTime).format();
  },
  item(parent) {
    return parent.getItem();
  },
};
