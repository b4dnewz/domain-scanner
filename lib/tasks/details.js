'use strict';

const dns = require('dns');
const async = require('async');
const geoip = require('geoip-lite');

const lookupHostname = function (hostname, multiple, callback) {
  dns.lookup(hostname, {
    verbatim: true,
    all: multiple
  }, (err, addresses, family) => {
    if (err) {
      return callback(multiple ? [] : null);
    }
    if (!multiple) {
      return callback({
        address: addresses,
        family: family,
        geo: geoip.lookup(addresses)
      });
    }
    callback(addresses.map(addr => {
      addr.geo = geoip.lookup(addr.address);
      return addr;
    }));
  });
};

module.exports = (domain, options, cb) => {
  // DNS Tasks to run
  const tasks = {
    lookup: callback => {
      lookupHostname(domain, false, res => {
        callback(null, res);
      });
    },

    cNameRecords: callback => {
      dns.resolveCname(domain, callback);
    },

    mxRecords: callback => {
      dns.resolveMx(domain, (err, res) => {
        if (!err && res.length) {
          async.map(res, (mx, cb) => {
            lookupHostname(mx.exchange, true, addresses => {
              mx.geo = addresses;
              cb(null, mx);
            });
          }, callback);
        } else {
          callback(err, res);
        }
      });
    },

    nsRecords: callback => {
      dns.resolveNs(domain, (err, res) => {
        if (err) {
          return callback(err);
        }
        // Lookup each ns record
        async.map(res, (host, cb) => {
          lookupHostname(host, true, addresses => {
            cb(null, {
              hostname: host,
              geo: addresses
            });
          });
        }, callback);
      });
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

module.exports.lookupHostname = lookupHostname;
