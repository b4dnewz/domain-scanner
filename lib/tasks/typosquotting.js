'use strict';

const async = require('async');
const typosquotter = require('typosquotter');
const common = require('../common');

module.exports = {
  title: 'Typosquotting',
  description: 'Generate and optionally resolve possible domains using typosquotting techniques',
  exec: (domain, options) => {
    return new Promise(resolve => {
      const results = typosquotter(domain);
      if (!options.deep) {
        return resolve(results);
      }

      // Resolve each result - long running task
      async.mapValuesSeries(results, (item, key, next) => {
        async.mapSeries(item, common.resolveHostname, next);
      }, (err, results) => {
        results = err ? null : results;
        resolve(results);
      });
    });
  }
};
