'use strict';

const async = require('async');
const request = require('request');
const common = require('../common');

module.exports.title = 'Certificate Transparency';
module.exports.description = 'Enumerate subdomains by abusing the Certificate Transparency logs';

module.exports.exec = (domain, options) => {
  return new Promise(resolve => {
    const url = `https://crt.sh/?q=%.${domain}&output=json`;
    request.get(url, {
      json: false
    }, (err, resp, body) => {
      if (err || resp.statusCode !== 200) {
        return resolve(null);
      }

      // Parse the response and filter out non-unique names
      let data = JSON.parse(body);
      data = data.map(v => v.name_value).filter((v, i, a) => a.indexOf(v) === i);

      // Return plain data
      if (!options.deep) {
        return resolve(data);
      }

      // Attempt to resolve hostnames
      async.mapSeries(data, common.resolveHostname, (err, results) => {
        data = err ? null : results;
        return resolve(data);
      });
    });
  });
};
