'use strict';

const request = require('request');

module.exports = (domain, options, cb) => {
  const url = `https://archive.org/wayback/available?url=${domain}`;
  request.get(url, {
    json: true
  }, (err, resp, body) => {
    if (err || resp.statusCode !== 200) {
      return cb(null, null);
    }
    cb(null, body.archived_snapshots);
  });
};
