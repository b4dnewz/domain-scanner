'use strict';

const robotsTask = require('../lib/tasks/robots.js').exec;

describe('Task: Robots', () => {
  jest.setTimeout(60000);

  it('exports by default a function', () => {
    expect(typeof robotsTask).toBe('function');
  });

  it('returns null if robots.txt does not exist', done => {
    robotsTask('example.com').then(res => {
      expect(res).toBeNull();
      done();
    });
  });

  it('returns an object of parsed results', done => {
    robotsTask('google.com').then(res => {
      expect(typeof res).toBe('object');
      done();
    });
  });
});
