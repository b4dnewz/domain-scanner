'use strict';

const request = require('request');
const endpoint = 'https://www.virustotal.com/vtapi/v2/domain/report';

module.exports.title = 'VirusTotal';
module.exports.description = 'Get a full of the given domain report using VirusTotal API';

module.exports.exec = (domain, options) => {
  return new Promise(resolve => {
    if (!options.keys || (!options.keys.virustotal || options.keys.virustotal === '')) {
      return resolve(null);
    }
    // Run the request
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
