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
    tldTask('codekraft.it', {}, (err, results) => {
      expect(err).toBeNull();
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBeTruthy();
      done();
    });
  });
});
