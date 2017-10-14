'use strict';

// Scanners and Tools
const robotsParse = require('robots-parse');

module.exports = (domain, cb) => {
  robotsParse(domain, {}, (err, results) => {
    if (err) {
      return cb(null, err.toString());
    }
    cb(null, results);
  });
};
