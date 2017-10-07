const domainScanner = require('../lib/index.js');

domainScanner('codekraft.it', {}, (err, response) => {
  console.log('Response?', response);
});
