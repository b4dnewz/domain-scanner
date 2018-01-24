'use strict';

const async = require('async');
const EmailHunter = require('hunter.io');

module.exports = (domain, options, cb) => {
  // Exit if no api key
  if (!options.keys || (!options.keys.hunterio || options.keys.hunterio === '')) {
    return cb(null, null);
  }

  // Init hunter.io API client
  const hunter = new EmailHunter(options.keys.hunterio);

  // Call the API
  hunter.domainSearch({domain}, (err, result) => {
    if (err || !result.data) {
      return cb(null, null);
    }

    // Perform a pwned task on found emails
    if (options.deep && result.data.emails.length > 0) {
      const Pwned = require('pwned-api');
      const pwner = new Pwned();

      // For each email in series perform a breachedAccount pwned scan
      async.mapSeries(result.data.emails, (email, next) => {
        pwner.breachedAccount(email.value, {}, (err, res) => {
          email.breaches = err || res;

          // Respect the Pwned API limit
          // @see: https://haveibeenpwned.com/API/v2#RateLimiting
          setTimeout(function () {
            next(null, email);
          }, 1500);
        });
      }, (err, response) => {
        result.data.emails = response;
        cb(err, result.data);
      });
    } else {
      cb(null, result.data);
    }
  });
};
