'use strict';

const ssllabs = require('node-ssllabs');

module.exports.title = 'Certificate Test';
module.exports.description = 'Run the complete SSL/TLS server testing using SSL Labs API';

module.exports.exec = (domain, options) => {
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
