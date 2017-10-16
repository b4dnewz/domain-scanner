'use strict';

// Scanners and Tools
const Pwned = require('pwned-api');
const pwner = new Pwned();

module.exports = (domain, cb) => {
  pwner.breaches({domain}, (err, results) => {
    if (err) {
      return cb(null, err.toString());
    }
    cb(null, results);
  });
};
