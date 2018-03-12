'use strict';

const threatsTask = require('../tasks/threats.js');

describe('Task: Threats', () => {
  it('exports by default a function', () => {
    expect(typeof threatsTask).toBe('function');
  });

  it('returns null if no API key is found', done => {
    threatsTask('codekraft.it', {}).then(res => {
      expect(res).toBeNull();
      done();
    });
  });

  it('returns null if API response gone wrong', done => {
    threatsTask('codekraft.it', {
      keys: {google: '<bad-api-key>'}
    }).then(res => {
      expect(res).toBeNull();
      done();
    });
  });
});
