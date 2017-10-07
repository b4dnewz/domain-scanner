'use strict';

// Require process environment variables
require('dotenv').config();

const fs = require('fs');
const mkdirp = require('mkdirp');
const async = require('async');

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

// Load tasks
const domainDetails = require('./tasks/domain-details.js');
const scanEmails = require('./tasks/domain-emails.js');
const scanRobots = require('./tasks/domain-robots.js');

// Run the scanner
const scanner = (domain, options = {}, callback = () => {}) => {
  // Get the domain to scan
  domain = domain ? domain : 'codekraft.it';

  const outputFolder = `./output/${domain}/`;

  console.log('\n\nScanning for domain name:', domain);

  // Create output folder
  mkdirp(outputFolder);

  // Init the scanner series
  let scannerSeries = {
    details: domainDetails.bind(null, domain),
    emails: scanEmails.bind(null, domain),
    robots: scanRobots.bind(null, domain)
  };

  // Extract only tasks that are selected
  scannerSeries = extractKeys(scannerSeries, options.sections || []);

  // Run the check series
  async.series(scannerSeries, (err, response) => {
    // Init the result object
    const result = {
      domain: domain,
      scannedAt: Date.now(),
      data: response
    };

    // If an error occurred add it to result object
    // and run the callback with error and result
    if (err) {
      result.error = err;
      return callback(err, result);
    }

    // Create the output file name
    const outputFile = `${outputFolder}/${result.scannedAt}.json`;

    // Write the result to disk as json and run user callback
    fs.writeFile(outputFile, JSON.stringify(result, null, 2), 'utf8', err => {
      callback(err, result);
    });
  });
};

// Export the scanner
module.exports = scanner;
