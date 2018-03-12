'use strict';

const async = require('async');
const EmailHunter = require('hunter.io');
const Pwned = require('pwned-api');
const pwner = new Pwned();

const testEmail = (email, next) => {
  pwner.breachedAccount(email.value, {}, (err, res) => {
    email.breaches = err || res;

    // Respect the Pwned API limit
    // @see: https://haveibeenpwned.com/API/v2#RateLimiting
    setTimeout(function () {
      next(null, email);
    }, 1500);
  });
};

module.exports = (domain, options) => {
  return new Promise(resolve => {
    // Exit if no api key
    if (!options.keys || (!options.keys.hunterio || options.keys.hunterio === '')) {
      return resolve(null);
    }

    // Init hunter.io API client
    const hunter = new EmailHunter(options.keys.hunterio);

    // Call the API
    hunter.domainSearch({domain}, (err, result) => {
      if (err || !result.data) {
        return resolve(null);
      }

      // Perform a pwned task on found emails
      if (options.deep && result.data.emails.length > 0) {
        // For each email in series perform a breachedAccount pwned scan
        async.mapSeries(result.data.emails, testEmail, (err, response) => {
          result.data.emails = response;
          resolve(err ? null : result.data);
        });
      } else {
        resolve(result.data);
      }
    });
  });
};

module.exports.testEmail = testEmail;
