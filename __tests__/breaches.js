'use strict';

const breachesTask = require('../lib/tasks/breaches.js').exec;

describe('Task: Breaches', () => {
  jest.setTimeout(60000);

  it('exports by default a function', () => {
    expect(typeof breachesTask).toBe('function');
  });

  it('returns an array of results', done => {
    breachesTask('codekraft.it', {}).then(res => {
      expect(Array.isArray(res)).toBeTruthy();
      done();
    });
  });
});
