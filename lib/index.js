'use strict';

// Main modules
const fs = require('fs');
const path = require('path');
const async = require('async');

// Extract object tasks that match keys array section names
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

// Get all the scanner tasks
const getTasks = () => {
  return fs.readdirSync(path.join(__dirname, 'tasks')).map(v => {
    return path.basename(v, '.js');
  });
};

// Run the scanner
const scanner = (domain, options = {}, callback = () => {}) => {
  // Exit if no domain argument
  if (!domain || domain === '') {
    callback(new Error('The domain value was empty or invalid.'));
    return;
  }

  // Init the scanner series
  let scannerTasks = getTasks().reduce((obj, t) => {
    let m = require(`./tasks/${t}.js`);
    obj[t] = m.bind(null, domain, options);
    return obj;
  }, {});

  // Extract only tasks that are selected
  if (Array.isArray(options.sections) && options.sections.length) {
    scannerTasks = extractKeys(scannerTasks, options.sections);
  }

  // Exclude specific tasks from the execution
  if (Array.isArray(options.exclude) && options.exclude.length) {
    Object.keys(scannerTasks).forEach(k => {
      return options.exclude.includes(k) && delete scannerTasks[k];
    });
  }

  // Run the check series
  async.series(scannerTasks, (err, response) => {
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

// Export the function to get available tasks
module.exports.getTasks = getTasks;

// Export function to extract object keys based on array values
module.exports.extractKeys = extractKeys;
