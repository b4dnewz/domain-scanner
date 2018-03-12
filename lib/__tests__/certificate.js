'use strict';

const certificateTask = require('../tasks/certificate.js').exec;

describe('Task: Certificate', () => {
  jest.setTimeout(300000);

  it('exports by default a function', () => {
    expect(typeof certificateTask).toBe('function');
  });

  it('return null on both if unable to resolve domain name', done => {
    certificateTask('-usau1.c', {}).then(res => {
      expect(res).toBeNull();
      done();
    });
  });

  it('returns an object with the certificate data', done => {
    certificateTask('google.com', {}).then(res => {
      expect(res).toBeDefined();
      expect(typeof res).toBe('object');
      done();
    });
  });
});
