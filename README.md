![banner](banner.jpg)

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

# domain-scanner
> A node utility to scan a domain with various techniques.

## Installation

```sh
$ npm install --save domain-scanner
```

## Usage
The usage is simple, just pass to the scanner the domain you want to scan and some options, than wait for the response:
```js
const domainScanner = require('domain-scanner');

const options = {
  section: [],
  keys: {}
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
* __robots__: Will scan the domain robots.txt file with [robots-parse](https://github.com/b4dnewz/robots-parse)
* __subdomains__: Will enumerate all hostname subdomains using [subquest](https://github.com/skepticfx/subquest)

```js
const options = {
  sections: ['details', 'emails', 'breaches', 'robots']
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
    hunterio: '<some-api-key>'
  }
};
```
Possible keys for now: _hunterio_

## License

MIT © b4dnewz


[npm-image]: https://badge.fury.io/js/domain-scanner.svg
[npm-url]: https://npmjs.org/package/domain-scanner
[travis-image]: https://travis-ci.org/b4dnewz/domain-scanner.svg?branch=master
[travis-url]: https://travis-ci.org/b4dnewz/domain-scanner
[daviddm-image]: https://david-dm.org/b4dnewz/domain-scanner.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/b4dnewz/domain-scanner
[coveralls-image]: https://coveralls.io/repos/b4dnewz/domain-scanner/badge.svg
[coveralls-url]: https://coveralls.io/r/b4dnewz/domain-scanner
