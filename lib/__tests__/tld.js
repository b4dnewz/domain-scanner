'use strict';

// Subdomain scanner/brute
const tldTask = require('../tasks/tld');

describe('Task: TLD', () => {
  it('exports by default a function', () => {
    expect(typeof tldTask).toBe('function');
  });
});
