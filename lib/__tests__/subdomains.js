'use strict';

const subdomainsTask = require('../tasks/subdomains.js').exec;

describe('Task: Subdomains', () => {
  jest.setTimeout(30000);

  it('exports by default a function', () => {
    expect(typeof subdomainsTask).toBe('function');
  });

  it('returns an array of results', done => {
    subdomainsTask('codekraft.it', {}).then(res => {
      expect(Array.isArray(res)).toBeTruthy();
      done();
    });
  });
});
