'use strict';

const dns = require('dns');
const async = require('async');
const tlds = require('./root-tlds.json');

// This extract the tld from current domain
const tldReg = /\.(\w{2,63})$/g;

module.exports = (domain, options, cb) => {
  let currentTld = tldReg.exec(domain)[1];
  let strippedDomain = domain.replace(tldReg, '');

  // Remove the current tld from the array
  let tldsList = tlds.filter(t => t.toLowerCase() !== currentTld.toLowerCase());

  // TODO: Let the user decide the limit or no limit so the system decides it
  // Run the requests
  async.mapLimit(tldsList, 6, (tld, callback) => {
    let hostname = `${strippedDomain}.${tld}`;
    dns.resolve(hostname, (err, record) => {
      callback(null, {
        hostname: hostname.toLowerCase(),
        tld: tld.toLowerCase(),
        record: err ? false : record
      });
    });
  }, (err, results) => {
    cb(err, results);
  });
};
