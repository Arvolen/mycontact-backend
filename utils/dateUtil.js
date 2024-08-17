const moment = require('moment');

const DateUtil = {
  formatToISO(date) {
    return moment(date).toISOString();
  },

  formatToReadable(date) {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
  },

  addDays(date, days) {
    return moment(date).add(days, 'days').toDate();
  }
};

module.exports = DateUtil;
