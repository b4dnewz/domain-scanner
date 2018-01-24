'use strict';

const virusTotalTask = require('../tasks/virustotal');

describe('Task: virustotal', () => {
  jest.setTimeout(60000);

  it('exports by default a function', () => {
    expect(typeof virusTotalTask).toBe('function');
  });

  it('returns null if no API key is found', done => {
    virusTotalTask('codekraft.it', {}, (err, res) => {
      expect(err).toBeNull();
      expect(res).toBeNull();
      done();
    });
  });
});
