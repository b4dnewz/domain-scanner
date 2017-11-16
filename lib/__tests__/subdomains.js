'use strict';

const subdomainsTask = require('../tasks/subdomains.js');

describe('Task: Subdomains', () => {
  // Override default timeout since operation can take long
  jest.setTimeout(10000);

  it('exports by default a function', () => {
    expect(typeof subdomainsTask).toBe('function');
  });

  it('returns an array of results', done => {
    subdomainsTask('codekraft.it', {}, (err, res) => {
      expect(err).toBeNull();
      expect(Array.isArray(res)).toBeTruthy();
      done();
    });
  });
});
