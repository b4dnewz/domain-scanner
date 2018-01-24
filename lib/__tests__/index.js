'use strict';

const assert = require('assert');
const domainScanner = require('../index.js');

describe('domainScanner', () => {
  it('exports by default a function', () => {
    assert(typeof domainScanner === 'function', 'should export a function');
  });

  it('return an error if the domain is empty', done => {
    domainScanner('', {}, (err, response) => {
      expect(err).not.toBeNull();
      expect(response).not.toBeDefined();
      done();
    });
  });

  it('has an option to exclude tasks', done => {
    domainScanner('codekraft.it', {
      exclude: domainScanner.getTasks()
    }, (err, response) => {
      expect(err).toBeNull();
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      expect(response.data).toEqual({});
      done();
    });
  });

  it('has an option to run specific sections only', done => {
    domainScanner('codekraft.it', {
      sections: ['details']
    }, (err, response) => {
      expect(err).toBeNull();
      expect(response).toBeDefined();
      done();
    });
  });

  describe('getTasks: List module existing tasks', () => {
    it('is defined', () => {
      expect(domainScanner.getTasks).toBeDefined();
    });

    it('return an array of strings', () => {
      let tasks = domainScanner.getTasks();
      expect(Array.isArray(tasks)).toBeTruthy();
      tasks.forEach(t => {
        expect(typeof t).toBe('string');
      });
    });
  });

  describe('extractKeys: Reduce the object keys based on array values match', () => {
    it('is defined', () => {
      expect(domainScanner.extractKeys).toBeDefined();
    });

    it('return the original object if no input', () => {
      let original = {
        domain: '',
        emails: '',
        robots: ''
      };
      let reduced = domainScanner.extractKeys(original, []);
      expect(reduced).toEqual(original);
    });

    it('reduce object keys based on input', () => {
      let original = {
        domain: '',
        emails: '',
        robots: ''
      };
      let reduced = domainScanner.extractKeys(original, ['domain']);
      expect(reduced).toHaveProperty('domain', '');
      expect(Object.keys(reduced).length).toBe(1);
    });
  });
});
