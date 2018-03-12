'use strict';

const ssllabs = require('node-ssllabs');

module.exports = (domain, options) => {
  return new Promise(resolve => {
    let opts = Object.assign(options.certificate || {}, {
      host: domain
    });
    ssllabs.scan(opts, (err, results) => {
      if (err || results.status === 'ERROR') {
        return resolve(null);
      }
      resolve(results);
    });
  });
};
