require('dotenv').config();

const domainScanner = require('../lib/index.js');

const options = {
  keys: {
    hunterio: process.env.HUNTERIO_KEY,
    google: process.env.GOOGLE_KEY,
    virustotal: process.env.VIRUSTOTAL_KEY
  }
};

domainScanner('codekraft.it', options, (err, response) => {
  if (err) {
    console.log('An error occurred:', err);
  } else {
    console.log('Response:', response);
  }
});
