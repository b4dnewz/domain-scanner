'use strict';

// Scanners and Tools
const robotsParse = require('robots-parse');

module.exports = (domain, cb) => {
  robotsParse(domain, {}, (err, results) => {
    cb(null, err ? null : results);
  });
};
