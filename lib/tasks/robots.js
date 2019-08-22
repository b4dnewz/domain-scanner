'use strict';

// Scanners and Tools
const robotsParse = require('robots-parse');

module.exports.title = 'Robots.txt';
module.exports.description = 'Get and parse the robots.txt file of a given domain';

module.exports.exec = domain => {
  return new Promise(resolve => {
    robotsParse(domain)
      .then(res => resolve(res))
      .catch(() => resolve(null));
  });
};
