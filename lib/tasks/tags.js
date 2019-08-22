'use strict';

// Scanners and Tools
const tagRecon = require('tag-recon');

module.exports.title = 'Tags';
module.exports.description = 'Get tracking code footprint to discover hidden connections';

module.exports.exec = async domain => {
  try {
    const results = await tagRecon(domain);
    return results;
  } catch (error) {
    return null;
  }
};
