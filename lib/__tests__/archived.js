'use strict';

const archivedTask = require('../tasks/archived.js');

describe('Task: Archived', () => {
  it('exports by default a function', () => {
    expect(typeof archivedTask).toBe('function');
  });

  it('returns an objects of results', done => {
    archivedTask('codekraft.it', {}, (err, res) => {
      expect(err).toBeNull();
      expect(typeof res).toBe('object');
      done();
    });
  });
});
