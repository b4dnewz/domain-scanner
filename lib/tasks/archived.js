'use strict';

const request = require('request');

module.exports.title = 'Archived Pages';
module.exports.description = 'Using the WaybackMachine API lookup for archived pages from a given domain';

module.exports.exec = domain => {
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
