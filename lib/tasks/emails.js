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

module.exports.title = 'Emails Enumeration';
module.exports.description = 'Enumerate email addresses associated with a given domain using Hunter.io API';

module.exports.exec = (domain, options) => {
  return new Promise(resolve => {
    if (!options.keys || (!options.keys.hunterio || options.keys.hunterio === '')) {
      return resolve(null);
    }

    // Init hunter.io API client
    const hunter = new EmailHunter(options.keys.hunterio);

    // Call the API
    hunter.domainSearch({
      domain,
      limit: 100
    }, (err, result) => {
      if (err || !result.data) {
        return resolve(null);
      }

      // if simple scan return results
      if (!options.deep) {
        return resolve(result.data);
      }

      // For each email in series perform a breachedAccount pwned scan
      async.mapSeries(result.data.emails, testEmail, (err, response) => {
        result.data.emails = response;
        resolve(err ? null : result.data);
      });
    });
  });
};

module.exports.testEmail = testEmail;
