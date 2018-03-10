'use strict';

const dns = require('dns');
const async = require('async');
const request = require('request');

const resolveHostname = (hostname, callback) => {
  async.series({
    address: done => dns.resolve(hostname, done),
    nameserver: done => {
      dns.resolveNs(hostname, (err, res) => {
        if (err) {
          return done(null, null);
        }
        return done(null, res);
      });
    }
  }, (err, res) => {
    if (err) {
      return callback(null, hostname);
    }
    return callback(null, res);
  });
};

module.exports = (domain, options, cb) => {
  const url = `https://crt.sh/?q=%.${domain}&output=json`;
  request.get(url, {
    json: false
  }, (err, resp, body) => {
    if (err || resp.statusCode !== 200) {
      return cb(null, null);
    }

    // Parse the response since is a fake JSON
    let data = JSON.parse('[' + body.replace(new RegExp('}{', 'g'), '},{') + ']');
    data = data.map(v => v.name_value).filter((v, i, a) => a.indexOf(v) === i);

    // Return plain data
    if (!options.deep) {
      return cb(null, data);
    }

    // Attempt to resolve hostnames
    async.mapSeries(data, resolveHostname, (err, results) => {
      if (err) {
        return cb(null, null);
      }
      return cb(null, results);
    });
  });
};
