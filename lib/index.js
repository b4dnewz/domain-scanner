'use strict';

// Main modules
const async = require('async');

// Scanner tasks
const domainDetails = require('./tasks/domain-details.js');
const scanEmails = require('./tasks/domain-emails.js');
const scanRobots = require('./tasks/domain-robots.js');
const scanBreaches = require('./tasks/domain-breaches.js');

/**
 * Extract object tasks that match keys array section names
 */
const extractKeys = (object, keys) => {
  // Return original object if keys are empty
  if (keys.length === 0) {
    return object;
  }
  // Reduce original object to only keys property
  return keys.reduce((r, v) => {
    if (Object.prototype.hasOwnProperty.call(object, v)) {
      r[v] = object[v];
    }
    return r;
  }, {});
};

// Run the scanner
const scanner = (domain, options = {}, callback = () => {}) => {
  // Get the domain to scan
  domain = domain ? domain : 'codekraft.it';

  // Init the scanner series
  let scannerSeries = {
    details: domainDetails.bind(null, domain),
    emails: scanEmails.bind(null, domain, options),
    robots: scanRobots.bind(null, domain),
    breaches: scanBreaches.bind(null, domain)
  };

  // Extract only tasks that are selected
  if(Array.isArray(options.sections) && options.sections.length) {
    scannerSeries = extractKeys(scannerSeries, options.sections);
  }

  // Exclude specific tasks from the execution
  if(Array.isArray(options.exclude) && options.exclude.length) {
    Object.keys(scannerSeries).forEach(k => {
      return options.exclude.includes(k) && delete scannerSeries[k]
    })
  }

  // Run the check series
  async.series(scannerSeries, (err, response) => {
    // Init the result object
    let result = {
      domain: domain,
      scannedAt: Date.now(),
      data: response
    };

    // Run script callback
    callback(err, result);
  });
};

// Export the scanner
module.exports = scanner;
