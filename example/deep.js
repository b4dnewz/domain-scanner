require('dotenv').config();

const domainScanner = require('../lib/index.js');

const options = {
  sections: ['emails'],
  deep: true,
  keys: {
    hunterio: process.env.HUNTERIO_KEY,
    google: process.env.GOOGLE_KEY
  }
};

domainScanner('codekraft.it', options, (err, response) => {
  if (err) {
    console.log('An error occurred:', err);
  } else {
    console.log('Response:', JSON.stringify(response, null, 2));
  }
});
