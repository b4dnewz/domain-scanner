'use strict';

const dns = require('dns');
const async = require('async');

module.exports = (domain, cb) => {
  // DNS Tasks to run
  const tasks = {
    lookup: callback => {
      dns.lookup(domain, {
        verbatim: true
      }, callback);
    },

    cNameRecords: callback => {
      dns.resolveCname(domain, callback);
    },

    mxRecords: callback => {
      dns.resolveMx(domain, callback);
    },

    nsRecords: callback => {
      dns.resolveNs(domain, callback);
    },

    soaRecords: callback => {
      dns.resolveSoa(domain, callback);
    },

    ptrRecords: callback => {
      dns.resolvePtr(domain, callback);
    }
  };
  // Run in parallel without stopping on errors
  async.parallel(async.reflectAll(tasks), (err, results) => {
    cb(err, results);
  });
};
