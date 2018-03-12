'use strict';

// Main modules
const fs = require('fs');
const path = require('path');
const async = require('async');
const EventEmitter = require('events');

// Extract object tasks that match keys array section names
const extractKeys = (object, keys) => {
  // Return original object if keys are empty
  if (!keys || keys.length === 0) {
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

// Get all the scanner tasks and their details
const getTasks = () => {
  return fs.readdirSync(path.join(__dirname, 'tasks')).map(v => {
    const task = require(path.join(__dirname, 'tasks', v));
    return {
      name: path.basename(v, '.js'),
      title: task.title,
      description: task.description,
      path: path.join(__dirname, 'tasks', v)
    };
  });
};

// Run the scanner
const scanner = (domain, options = {}, callback = () => {}) => {
  if (!domain || domain === '') {
    callback(new Error('The domain value was empty or invalid.'));
    return;
  }

  const emitter = new EventEmitter();

  // Init the scanner series
  let scannerTasks = getTasks().reduce((obj, t) => {
    const m = require(t.path);
    obj[t.name] = next => {
      emitter.emit('section-start', {name: m.title});
      return m.exec(domain, options).then(data => {
        emitter.emit('section-end', {
          name: m.title,
          data
        });
        next(null, data);
      }).catch(e => next(e));
    };
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
  const startTime = Date.now();
  async.series(scannerTasks, (err, response) => {
    const endTime = Date.now();

    // Init the result object
    const result = {
      domain: domain,
      scannedAt: endTime,
      executionTime: (endTime - startTime),
      data: response
    };

    // Run script callback
    callback(err, result);
  });

  return emitter;
};

// Export the scanner
module.exports = scanner;

// Export the function to get available tasks
module.exports.getTasks = getTasks;

// Export function to extract object keys based on array values
module.exports.extractKeys = extractKeys;
