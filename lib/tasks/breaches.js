'use strict';

// Scanners and Tools
const Pwned = require('pwned-api');
const pwner = new Pwned();

module.exports.title = 'Breaches';
module.exports.description = 'Test the given domain for known breaches using HaveIBennPwned API';

module.exports.exec = domain => {
  return new Promise(resolve => {
    pwner.breaches({domain}, (err, results) => {
      const data = err ? null : results;
      resolve(data);
    });
  });
};
