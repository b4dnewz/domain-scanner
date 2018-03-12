'use strict';

// Subdomain scanner/brute
const tldTask = require('../tasks/tld');

describe('Task: TLD', () => {
  // This task can take very long time since there are 100 or more tld records
  jest.setTimeout(120000);

  it('exports by default a function', () => {
    expect(typeof tldTask).toBe('function');
  });

  it('returns an array of objects', done => {
    tldTask('codekraft.it', {}).then(res => {
      expect(res).toBeDefined();
      expect(Array.isArray(res)).toBeTruthy();
      done();
    });
  });
});
