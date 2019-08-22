'use strict';

const ctlTask = require('../lib/tasks/ctl.js').exec;

describe('Task: CTL', () => {
  jest.setTimeout(60000);

  it('exports by default a function', () => {
    expect(typeof ctlTask).toBe('function');
  });

  it('returns an objects of results', done => {
    ctlTask('codekraft.it', {}).then(res => {
      expect(Array.isArray(res)).toBeTruthy();
      done();
    });
  });

  it('accept the deep option to return more data', done => {
    ctlTask('codekraft.it', {deep: true}).then(res => {
      expect(Array.isArray(res)).toBeTruthy();
      expect(res).not.toHaveLength(0);
      expect(res[0]).toHaveProperty('address');
      done();
    });
  });
});
