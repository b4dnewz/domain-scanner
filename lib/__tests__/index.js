const assert = require('assert');
const domainScanner = require('../index.js');

describe('domainScanner', () => {
  it('exports a function', () => {
    assert(typeof domainScanner === 'function', 'should export a function');
  });
});
