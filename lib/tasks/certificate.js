'use strict';

const ssllabs = require('node-ssllabs');

module.exports = (domain, options, cb) => {
  let opts = Object.assign(options.certificate || {}, {
    host: domain
  });
  ssllabs.scan(opts, (err, results) => {
    if (err) {
      return cb(null, null);
    }
    cb(null, results);
  });
};
