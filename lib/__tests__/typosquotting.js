'use strict';

const typosquottingTask = require('../tasks/typosquotting');

describe('Task: typosquotting', () => {
  jest.setTimeout(60000);

  it('exports by default a function', () => {
    expect(typeof typosquottingTask).toBe('function');
  });

  it('switch the characters by index', () => {
    expect(typosquottingTask.switchCharAt('example', 2)).toEqual('exmaple');
  });

  it('duplicate the characters by index', () => {
    expect(typosquottingTask.doubleCharAt('example', 2)).toEqual('exaample');
  });

  it('add a character at index', () => {
    expect(typosquottingTask.addCharAt('example', 2, 'b')).toEqual('exbample');
  });

  it('remove a character at index', () => {
    expect(typosquottingTask.removeCharAt('example', 2)).toEqual('exmple');
  });

  it('replace a character at index', () => {
    expect(typosquottingTask.replaceCharAt('example', 2, 'b')).toEqual('exbmple');
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
});
