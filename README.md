![banner](banner.jpg)

<p align="center">
  <a href="https://npmjs.org/package/domain-scanner"><img src="https://badge.fury.io/js/domain-scanner.svg"></a>
  <a href="https://travis-ci.org/b4dnewz/domain-scanner"><img src="https://travis-ci.org/b4dnewz/domain-scanner.svg?branch=master"></a>
  <a href="https://david-dm.org/b4dnewz/domain-scanner"><img src="https://david-dm.org/b4dnewz/domain-scanner.svg?theme=shields.io"></a>
  <a href="https://coveralls.io/r/b4dnewz/domain-scanner"><img src="https://coveralls.io/repos/b4dnewz/domain-scanner/badge.svg"></a>
  <a href="https://snyk.io/test/github/b4dnewz/domain-scanner"><img src="https://snyk.io/test/github/b4dnewz/domain-scanner/badge.svg"></a>
</p>

<p align="center">A node utility to scan a domain with various techniques.</p>

## Installation
```sh
$ npm install domain-scanner
$ yarn add domain-scanner
```

## Usage
The usage is simple, just pass to the scanner the domain you want to scan and some options, than wait for the response:
```js
const domainScanner = require('domain-scanner');

const options = {
  deep: false,
  sections: [],
  exclude: [],
  keys: {
    hunterio: '<api-key>',
    google: '<api-key>',
    virustotal: '<api-key>'
  }
};

domainScanner('codekraft.it', options, (err, results) => {
  console.log(results);
});
```

## Options
#### sections
An array with the names of the sections you want to scan, leave empty to scan all sections. Available sections are:
* __details__: Will perform some system based evaluations against the domain.
* __emails__: Will scan the domain looking for known emails with [node-emailhunter](https://github.com/b4dnewz/node-emailhunter)
* __breaches__: Will check the [HaveIBeenPwned](https://haveibeenpwned.com/DomainSearch) database against the domain
* __certificate__: SSL Certificate test and verification using [node-ssllabs](https://github.com/keithws/node-ssllabs) talking with SSL Labs API
* __robots__: Will scan the domain robots.txt file with [robots-parse](https://github.com/b4dnewz/robots-parse)
* __subdomains__: Will enumerate all hostname subdomains using [subquest](https://github.com/skepticfx/subquest)
* __threats__: Will scan the domain using [Google Safe Browsing](https://developers.google.com/safe-browsing/) API looking for known threats
* __virustotal__: Will scan the domain using [Virus Total](https://developers.virustotal.com/v2.0/reference) APIv2 on domain/report endpoint
* __tld__: Will scan all the other [root TLDs](https://wiki.mozilla.org/TLD_List) possibilities for a given domain

```js
const options = {
  sections: ['details', 'emails', 'breaches', 'certificate', 'robots', 'subdomains', 'threats', 'virustotal', 'tld']
};
```

#### exclude
An array of sections to exclude from the tasks of the scanner:
```js
const options = {
  exclude: ['emails']
};
```

#### keys
An object with the API keys for the services involved in the scan. For example to use [Hunter.io](https://hunter.io/) API:
```js
const options = {
  keys: {
    hunterio: '<api-key>',
    google: '<api-key>',
    virustotal: '<api-key>'
  }
};
```
Possible keys for now: _hunterio_, _google_, _virustotal_

#### deep
Perform additional tasks for the gathered results.
For example test resulting emails with [node-pwned](https://github.com/b4dnewz/node-pwned) for breaches, or testing nested domain details informations.
```js
const options = {
  deep: true
};
```

## Looking for the cli tool?
If you want to use it from the command line as a cli tool you have to download [domain-scanner-cli](https://github.com/b4dnewz/domain-scanner-cli) module.
```sh
$ npm install -g domain-scanner-cli
```

---

## Contributing

1. Create an issue and describe your idea
2. Fork the project (https://github.com/b4dnewz/domain-scanner/fork)
3. Create your feature branch (`git checkout -b my-new-task`)
4. Commit your changes (`git commit -am 'Add some task'`)
5. Write some test (`npm run test`)
6. Publish the branch (`git push origin my-new-task`)
7. Create a new Pull Request

## License

MIT © [b4dnewz](https://b4dnewz.github.io/)
