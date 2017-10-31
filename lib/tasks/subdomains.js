'use strict';

// Subdomain scanner/brute
const subquest = require('subquest');

module.exports = (domain, options, cb) => {
  subquest.getSubDomains({
    host: domain
  }, (err, results) => {
    cb(null, err ? null : results);
  });
};
