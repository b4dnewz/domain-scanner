'use strict';

const emailsTask = require('../tasks/emails.js');

describe('Task: Emails', () => {
  it('exports by default a function', () => {
    expect(typeof emailsTask).toBe('function');
  });

  it('returns null if no API key is found', done => {
    emailsTask('codekraft.it', {}, (err, res) => {
      expect(err).toBeNull();
      expect(res).toBeNull();
      done();
    });
  });

  it('returns null if API response gone bad', done => {
    emailsTask('codekraft.it', {
      keys: {hunterio: '<bad-api-key>'}
    }, (err, res) => {
      expect(err).toBeNull();
      expect(res).toBeNull();
      done();
    });
  });
});