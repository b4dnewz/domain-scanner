'use strict';

const request = require('request');

module.exports = domain => {
  return new Promise(resolve => {
    const url = `https://archive.org/wayback/available?url=${domain}`;
    request.get(url, {
      json: true
    }, (err, resp, body) => {
      const data = err || resp.statusCode !== 200 ? null : body.archived_snapshots;
      resolve(data);
    });
  });
};
