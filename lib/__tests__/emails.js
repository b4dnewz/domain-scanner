'use strict';

const emailsTask = require('../tasks/emails.js');

describe('Task: Emails', () => {
  it('exports by default a function', () => {
    expect(typeof emailsTask).toBe('function');
  });

  it('returns null if no API key is found', done => {
    emailsTask('codekraft.it', {}).then(res => {
      expect(res).toBeNull();
      done();
    });
  });

  it('returns null if API response gone bad', done => {
    emailsTask('codekraft.it', {
      keys: {hunterio: '<bad-api-key>'}
    }).then(res => {
      expect(res).toBeNull();
      done();
    });
  });

  describe('deep option', () => {
    it('test each email result for known breaches', done => {
      emailsTask.testEmail({value: 'john@example.com'}, (err, res) => {
        expect(err).toBeDefined();
        expect(res).toBeDefined();
        expect(err).toBeNull();
        expect(res).not.toBeNull();
        expect(res).toHaveProperty('breaches');
        done();
      });
    });
  });
});
