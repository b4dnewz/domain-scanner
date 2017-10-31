'use strict';

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
      cb(err);
      return;
    }
    cb(null, result.data);
  });
};
