'use strict';

// Scanners and Tools
const {name, version} = require('../../package.json');
const util = require('util');
const request = require('request');

// Google Safe Browsing API url
// see: https://developers.google.com/safe-browsing/v4/
let safeBrowsing = 'https://safebrowsing.googleapis.com/v4/threatMatches:find?key=%s';

// All the threat types for Google Safe Browsing
const threatTypes = ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION', 'THREAT_TYPE_UNSPECIFIED'];

module.exports.title = 'Threats';
module.exports.description = 'Check the status of a given domain using Google SafeBrowsing API';

module.exports.exec = (domain, options) => {
  return new Promise(resolve => {
    if (!options.keys || (!options.keys.google || options.keys.google === '')) {
      return resolve(null);
    }

    // Format url with API key
    safeBrowsing = util.format(safeBrowsing, options.keys.google);

    // Ensure domain name has protocol
    if (/^[^:]+(?=:\/\/)/.test(domain) === false) {
      domain = 'http://' + domain;
    }

    // Virus total request options
    const reqOptions = {
      json: true,
      body: {
        client: {
          clientId: name,
          clientVersion: version
        },
        threatInfo: {
          threatTypes,
          platformTypes: ['ALL_PLATFORMS'],
          threatEntryTypes: ['URL'],
          threatEntries: [
            {
              url: domain
            }
          ]
        }
      }
    };

    // Run the request
    request.post(safeBrowsing, reqOptions, (err, resp, body) => {
      const data = err || resp.statusCode !== 200 ?
        null :
        body;
      resolve(data);
    });
  });
};
