'use strict';

// Require process environment variables
require('dotenv').config();

const fs = require('fs');
const dns = require('dns');
const mkdirp = require('mkdirp');
const async = require('async');

// Scanners and Tools
const robots = require('robots');
const EmailHunter = require('hunter.io');

// Clients and Workers
const parser = new robots.RobotsParser();

// Init hunter.io API client
const hunter = new EmailHunter(process.env.HUNTER_APIKEY);

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

// Get domain details from system dns object
const domainDetails = (domain, cb) => {
  // DNS Tasks to run
  const tasks = {
    lookup: callback => {
      dns.lookup(domain, {
        verbatim: true
      }, callback);
    },

    cNameRecords: callback => {
      dns.resolveCname(domain, callback);
    },

    mxRecords: callback => {
      dns.resolveMx(domain, callback);
    },

    nsRecords: callback => {
      dns.resolveNs(domain, callback);
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

// Scan for emails using various systems
const scanEmails = (domain, cb) => {
  hunter.emailCount(domain, (err, result) => {
    if (err || !result.data) {
      cb(err);
      return;
    }
    cb(null, result.data);
  });
};

// Scan domain robots.txt file
const scanRobots = (domain, cb) => {
  parser.setUrl(domain, parser => {
    const data = {
      entries: parser.entries,
      sitemaps: parser.sitemaps
    };
    cb(null, data);
  });
};

// Write json data to file
const writeJSON = (data, output, callback) => {
  fs.writeFile(output, JSON.stringify(data, null, 2), 'utf8', err => {
    callback(err, output);
  });
};

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
