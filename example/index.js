const domainScanner = require('../lib/index.js');

const options = {};

domainScanner('codekraft.it', options, (err, response) => {
  if (err) {
    console.log('An error occurred:', err);
  } else {
    console.log('Response:', response);
  }
});
