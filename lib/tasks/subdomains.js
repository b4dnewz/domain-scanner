'use strict';

// Subdomain scanner/brute
const subquest = require('subquest');

module.exports = domain => {
  return new Promise(resolve => {
    subquest.getSubDomains({
      host: domain
    }, (err, results) => {
      resolve(err ? null : results);
    });
  });
};
