'use strict';

// Subdomain scanner/brute
const subquest = require('subquest');

module.exports.title = 'Subdomains';
module.exports.description = 'Using brute force enumeration resolves possible subdomains from a given domain';

module.exports.exec = domain => {
  return new Promise(resolve => {
    subquest.getSubDomains({
      host: domain
    }, (err, results) => {
      resolve(err ? null : results);
    });
  });
};
