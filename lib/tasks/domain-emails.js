'use strict';

const EmailHunter = require('hunter.io');

// Init hunter.io API client
const hunter = new EmailHunter(process.env.HUNTER_APIKEY);

module.exports = (domain, cb) => {
  hunter.emailCount(domain, (err, result) => {
    if (err || !result.data) {
      cb(err);
      return;
    }
    cb(null, result.data);
  });
};
