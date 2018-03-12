'use strict';

const archivedTask = require('../tasks/archived.js');

describe('Task: Archived', () => {
  jest.setTimeout(10000);

  it('exports by default a function', () => {
    expect(typeof archivedTask).toBe('function');
  });

  it('returns an objects of results', done => {
    archivedTask('codekraft.it', {}).then(res => {
      expect(typeof res).toBe('object');
      done();
    });
  });
});
