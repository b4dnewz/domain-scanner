'use strict';

// Require process environment variables
require('dotenv').config();

const fs = require('fs');
const mkdirp = require('mkdirp');
const async = require('async');

const robots = require('robots');
const parser = new robots.RobotsParser();
const EmailHunter = require('email-hunter');

// Init hunter.io API client
const hunter = new EmailHunter(process.env.HUNTER_APIKEY);

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
  parser.setUrl('https://yoast.com/robots.txt', parser => {
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
const scanner = (domain, options = {}, callback) => {
  // Get the domain to scan
  domain = domain ? domain : 'codekraft.it';

  const outputFolder = `./output/${domain}/`;

  console.log('\n\nScanning for domain name:', domain);
  console.log('Domain scanner called with options:', options);

  // Create output folder
  mkdirp(outputFolder);

  // Init the scanner series
  const scannerSeries = {
    emails: scanEmails.bind(null, domain),
    robotFile: scanRobots.bind(null, domain)
  };

  // Run the check series
  async.series(scannerSeries, (err, response) => {
    // Init the result object
    const result = {
      domain: domain,
      scannedAt: Date.now(),
      results: response
    };

    // Create the output file name
    const outputFile = `${outputFolder}/${result.scannedAt}.json`;

    // Write the results to json file
    writeJSON(result, outputFile, err => {
      if (err) {
        console.log('The result cant be saved:', err);
        return;
      }
      console.log('Result saved at path:', outputFile);
    });

    // Optionally run the callback
    if (typeof callback === 'function') {
      callback(err, response);
    }
  });
};

// Export the scanner
module.exports = scanner;
