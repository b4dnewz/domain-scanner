'use strict';

const request = require('request');
const endpoint = 'https://www.virustotal.com/vtapi/v2/domain/report';

module.exports = (domain, options) => {
  return new Promise(resolve => {
    if (!options.keys || (!options.keys.virustotal || options.keys.virustotal === '')) {
      return resolve(null);
    }

    request.get({
      url: endpoint,
      json: true,
      qs: {
        apikey: options.keys.virustotal,
        domain
      }
    }, (err, resp, body) => {
      const data = err || resp.statusCode !== 200 ?
        null :
        body;
      resolve(data);
    });
  });
};
