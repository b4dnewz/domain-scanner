'use strict';

const dns = require('dns');
const async = require('async');
const tlds = require('./root-tlds.json');

// This extract the tld from current domain
const tldReg = /\.(\w{2,63})$/g;

module.exports.title = 'Top Level Domain';
module.exports.description = 'Enumerate and optionally resolve possible hosts by changing the domain tld';

module.exports.exec = domain => {
  return new Promise(resolve => {
    let currentTld = tldReg.exec(domain)[1];
    let strippedDomain = domain.replace(tldReg, '');

    // Remove the current tld from the array
    let tldsList = tlds.filter(t => t.toLowerCase() !== currentTld.toLowerCase());

    // Run the requests
    async.reduce(tldsList, [], (arr, tld, callback) => {
      let hostname = `${strippedDomain}.${tld}`;

      // Attempt to resolve hostname
      async.series({
        address: next => {
          dns.resolve(hostname, next);
        },
        nameserver: next => {
          dns.resolveNs(hostname, (err, res) => {
            if (err) {
              next(null, null);
              return;
            }
            next(null, res);
          });
        }
      }, (err, results) => {
        if (err) {
          callback(null, arr);
          return;
        }

        // Push result to array
        arr.push(Object.assign(results, {
          hostname: hostname.toLowerCase(),
          tld: tld.toLowerCase()
        }));

        // Return updated array
        callback(null, arr);
      });
    }, (err, results) => {
      if (err) {
        return resolve(null);
      }
      resolve(results);
    });
  });
};
