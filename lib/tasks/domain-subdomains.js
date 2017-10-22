'use strict';

// Subdomain scanner/brute
const subquest = require('subquest');

module.exports = (domain, cb) => {
  subquest.getSubDomains({
    host: domain
  }).on('end', results => {
    cb(null, results);
  }).on('error', cb);
};
