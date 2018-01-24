'use strict';

const certificateTask = require('../tasks/certificate.js');

describe('Task: Certificate', () => {
  jest.setTimeout(60000);

  it('exports by default a function', () => {
    expect(typeof certificateTask).toBe('function');
  });

  it('return null on both if unable to resolve domain name', done => {
    certificateTask('-usau1.c', {}, (err, results) => {
      expect(err).toBeNull();
      expect(results).toBeNull();
      done();
    });
  });

  it('returns an object with the certificate data', done => {
    certificateTask('google.com', {}, (err, results) => {
      expect(err).toBeNull();
      expect(results).toBeDefined();
      expect(typeof results).toBe('object');
      done();
    });
  });
});
