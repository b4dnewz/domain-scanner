'use strict';

const robotsTask = require('../lib/tasks/robots.js').exec;

describe('Task: Robots', () => {
  jest.setTimeout(30000);

  it('exports by default a function', () => {
    expect(typeof robotsTask).toBe('function');
  });

  it('returns null if no robots.txt file is found', done => {
    robotsTask('example.com', {}).then(res => {
      expect(res).toBeNull();
      done();
    });
  });

  it('returns an object of results', done => {
    robotsTask('google.com', {}).then(res => {
      expect(typeof res).toBe('object');
      done();
    });
  });
});
