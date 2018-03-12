'use strict';

// Subdomain scanner/brute
const tldTask = require('../tasks/tld').exec;

describe('Task: TLD', () => {
  jest.setTimeout(300000);

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
