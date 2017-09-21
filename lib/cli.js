#!/usr/bin/env node

'use strict';

const pkg = require('../package.json');
const scanner = require('./index.js');
const commander = require('commander');

// Setup commander
commander
  .version(pkg.version)
  .name(pkg.name)
  .description('A node utility to scan a domain with various techniques.')
  .usage('[options] <domain>')
  .arguments('<domain>')
  .option('-o, --output [path]', 'Where to save the output files')
  .option('-t, --timeout [milliseconds]', 'Milliseconds to wait before stopping scans')
  .action(domain => {
    console.log('Requested scan for domain:', domain);
    scanner('core.codekraft.it', {

    }, (err, response) => {
      console.log('Error:', err);
      console.log('Response:', response);
      process.exit();
    });
  })
  .parse(process.argv);
