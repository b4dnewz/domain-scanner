'use strict';

const archivedTask = require('../lib/tasks/archived.js').exec;

describe('Task: Archived', () => {
  jest.setTimeout(30000);

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
