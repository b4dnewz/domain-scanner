'use strict';

const robotsTask = require('../tasks/robots.js');

describe('Task: Robots', () => {
  it('exports by default a function', () => {
    expect(typeof robotsTask).toBe('function');
  });

  it('returns null if no robots.txt file is found', done => {
    robotsTask('example.com', {}, (err, res) => {
      expect(err).toBeNull();
      expect(res).toBeNull();
      done();
    });
  });

  it('returns an object of results', done => {
    robotsTask('google.com', {}, (err, res) => {
      expect(err).toBeNull();
      expect(typeof res).toBe('object');
      done();
    });
  });
});
