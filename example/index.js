require('dotenv').config();

const domainScanner = require('../lib/index.js');

const options = {
  // exclude: ['emails'],
  keys: {
    hunterio: process.env.HUNTER_APIKEY,
    google: process.env.GOOGLE_APIKEY
  }
};

domainScanner('codekraft.it', options, (err, response) => {
  if (err) {
    console.log('An error occurred:', err);
  } else {
    console.log('Response:', response);
  }
});
