'use strict';

const dns = require('dns');
const async = require('async');

module.exports.resolveHostname = (hostname, done) => {
  async.series({
    address: next => dns.resolve(hostname, next),
    nameserver: next => {
      dns.resolveNs(hostname, (err, res) => {
        if (err) {
          next(null, null);
          return;
        }
        next(null, res);
      });
    }
  }, (err, results) => {
    if (err) {
      done(null, {hostname});
      return;
    }
    done(null, Object.assign(results, {hostname}));
  });
};
