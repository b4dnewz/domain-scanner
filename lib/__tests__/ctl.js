'use strict';

const ctlTask = require('../tasks/ctl.js');

describe('Task: CTL', () => {
  it('exports by default a function', () => {
    expect(typeof ctlTask).toBe('function');
  });

  it('returns an objects of results', done => {
    ctlTask('codekraft.it', {}, (err, res) => {
      expect(err).toBeNull();
      expect(Array.isArray(res)).toBeTruthy();
      done();
    });
  });

  it('accept the deep option to return more data', done => {
    ctlTask('codekraft.it', {deep: true}, (err, res) => {
      expect(err).toBeNull();
      expect(Array.isArray(res)).toBeTruthy();
      expect(res).not.toHaveLength(0);
      expect(res[0]).toHaveProperty('address');
      done();
    });
  });
});
