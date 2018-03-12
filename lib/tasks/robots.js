'use strict';

// Scanners and Tools
const robotsParse = require('robots-parse');

module.exports = domain => {
  return new Promise(resolve => {
    robotsParse(domain, {}, (err, results) => {
      resolve(err ? null : results);
    });
  });
};
