'use strict';

const emailHunter = require('email-hunter');
const async = require('async');
const robots = require('robots');
const parser = new robots.RobotsParser();

const scanner = (domain, options = {}) => {
  domain = domain ? domain : 'codekraft.it';
  async.series({
    emails: cb => {
      const data = {
        total: ['one', 'two'].length,
        results: ['one', 'two']
      };
      cb(null, data);
    },
    robotUrls: cb => {
      parser.setUrl('https://yoast.com/robots.txt', parser => {
        const data = {
          entries: parser.entries,
          sitemaps: parser.sitemaps
        };
        cb(null, data);
      });
    }
  }, (err, results) => {
    console.log('Error:', err);
    console.log('Results:', results);
  });
};

scanner();

module.exports = scanner;
