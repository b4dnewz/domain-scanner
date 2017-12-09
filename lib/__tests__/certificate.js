'use strict';

const certificateTask = require('../tasks/certificate.js');

describe('Task: Certificate', () => {
  it('exports by default a function', () => {
    expect(typeof certificateTask).toBe('function');
  });
});
