'use strict';

const typosquottingTask = require('../lib/tasks/typosquotting').exec;

describe('Task: Typosquotting', () => {
  jest.setTimeout(60000);

  it('exports by default a function', () => {
    expect(typeof typosquottingTask).toBe('function');
  });

  it('return an object with arrays as proprerty values', done => {
    typosquottingTask('ebay.com', {}).then(res => {
      expect(res).not.toBeNull();
      expect(typeof res).toBe('object');
      Object.keys(res).forEach(k => {
        expect(Array.isArray(res[k])).toBeTruthy();
      });
      done();
    });
  });

  describe('deep option', () => {
    it.skip('try to resolve each result', done => {
      typosquottingTask('ab.com', {deep: true}).then(res => {
        expect(res).toBeDefined();
        expect(res).not.toBeNull();
        done();
      });
    });
  });
});
