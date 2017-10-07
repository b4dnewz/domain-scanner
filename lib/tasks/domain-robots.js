'use strict';

// Scanners and Tools
const robots = require('robots');

// Clients and Workers
const parser = new robots.RobotsParser();

module.exports = (domain, cb) => {
  parser.setUrl(domain, parser => {
    const data = {
      entries: parser.entries,
      sitemaps: parser.sitemaps
    };
    cb(null, data);
  });
};
