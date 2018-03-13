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

  // This emitter can be used to track the scan execution
  const emitter = new EventEmitter();

  // Map tasks actions to prepare custom crafter async callbacks
  // with event emitter of current task iteration state
  let scannerTasks = getTasks().reduce((obj, t) => {
    const m = require(t.path);
    obj[t.name] = next => {
      const taskNames = Object.keys(scannerTasks);
      const tasksCount = taskNames.length;
      const currentTask = taskNames.indexOf(t.name) + 1;
      emitter.emit('section-start', {
        name: m.title,
        current: currentTask,
        total: tasksCount
      });
      return m.exec(domain, options).then(data => {
        emitter.emit('section-end', {
          name: m.title,
          data,
          total: tasksCount
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

  // Run the scan tasks in series on nextTick, this allow
  // the very first emit event to be captured correctly and
  // the scanning script will run immediately after the emitter object is returned
  process.nextTick(() => {
    const startTime = Date.now();
    async.series(scannerTasks, (err, response) => {
      const endTime = Date.now();
      callback(err, {
        domain: domain,
        scannedAt: endTime,
        executionTime: (endTime - startTime),
        data: response
      });
    });
  });

  // Return the execution event emitter so any third party script
  // can listen for events and know the scan status during it's execution
  return emitter;
};

// Export the scanner
module.exports = scanner;

// Export the function to get available tasks
module.exports.getTasks = getTasks;

// Export function to extract object keys based on array values
module.exports.extractKeys = extractKeys;
