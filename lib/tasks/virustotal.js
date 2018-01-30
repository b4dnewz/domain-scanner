'use strict';

const request = require('request');

const endpoint = 'https://www.virustotal.com/vtapi/v2/domain/report';

module.exports = (domain, options, cb) => {
  // exit if no api key
  if (!options.keys || (!options.keys.virustotal || options.keys.virustotal === '')) {
    return cb(null, null);
  }

  request.get({
    url: endpoint,
    json: true,
    qs: {
      apikey: options.keys.virustotal,
      domain
    }
  }, (err, response, body) => {
    if (err || response.statusCode !== 200) {
      return cb(null, null);
    }
    cb(null, err ? null : body);
  });
};
