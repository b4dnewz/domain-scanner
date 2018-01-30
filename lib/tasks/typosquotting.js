'use strict';

const _ = require('lodash');
const dns = require('dns');
const async = require('async');

// This extract the tld from current domain
const tldReg = /\.(\w{2,63})$/g;

// Similar glyphs by character
const glyphs = {
  a: ['à', 'á', 'â', 'ã', 'ä', 'å', 'ɑ', 'а', 'ạ', 'ǎ', 'ă', 'ȧ', 'ӓ'],
  b: ['d', 'lb', 'ib', 'ʙ', 'Ь', 'b̔', 'ɓ', 'Б'],
  c: ['ϲ', 'с', 'ƈ', 'ċ', 'ć', 'ç'],
  d: ['b', 'cl', 'dl', 'di', 'ԁ', 'ժ', 'ɗ', 'đ'],
  e: ['é', 'ê', 'ë', 'ē', 'ĕ', 'ě', 'ė', 'е', 'ẹ', 'ę', 'є', 'ϵ', 'ҽ'],
  f: ['Ϝ', 'ƒ', 'Ғ'],
  g: ['q', 'ɢ', 'ɡ', 'Ԍ', 'Ԍ', 'ġ', 'ğ', 'ց', 'ǵ', 'ģ'],
  h: ['lh', 'ih', 'һ', 'հ', 'Ꮒ', 'н'],
  i: ['1', 'l', 'Ꭵ', 'í', 'ï', 'ı', 'ɩ', 'ι', 'ꙇ', 'ǐ', 'ĭ'],
  j: ['ј', 'ʝ', 'ϳ', 'ɉ'],
  k: ['lk', 'ik', 'lc', 'κ', 'ⲕ', 'κ'],
  l: ['1', 'i', 'ɫ', 'ł'],
  m: ['n', 'nn', 'rn', 'rr', 'ṃ', 'ᴍ', 'м', 'ɱ'],
  n: ['m', 'r', 'ń'],
  o: ['0', 'Ο', 'ο', 'О', 'о', 'Օ', 'ȯ', 'ọ', 'ỏ', 'ơ', 'ó', 'ö', 'ӧ'],
  p: ['ρ', 'р', 'ƿ', 'Ϸ', 'Þ'],
  q: ['g', 'զ', 'ԛ', 'գ', 'ʠ'],
  r: ['ʀ', 'Г', 'ᴦ', 'ɼ', 'ɽ'],
  s: ['Ⴝ', 'Ꮪ', 'ʂ', 'ś', 'ѕ'],
  t: ['τ', 'т', 'ţ'],
  u: ['μ', 'υ', 'Ս', 'ս', 'ц', 'ᴜ', 'ǔ', 'ŭ'],
  v: ['ѵ', 'ν', 'v̇'],
  w: ['vv', 'ѡ', 'ա', 'ԝ'],
  x: ['х', 'ҳ', 'ẋ'],
  y: ['ʏ', 'γ', 'у', 'Ү', 'ý'],
  z: ['ʐ', 'ż', 'ź', 'ʐ', 'ᴢ']
};

// Run the HTTP request
const doRequest = (url, callback) => {
  async.series({
    ip: next => {
      dns.resolve(url, next);
    },
    nameserver: next => {
      dns.resolveNs(url, (err, res) => {
        if (err) {
          next(null, null);
          return;
        }
        next(null, res);
      });
    }
  }, (err, results) => {
    if (err) {
      callback(null, null);
      return;
    }
    callback(null, Object.assign(results, {
      hostname: url
    }));
  });
};

const removeCharAt = (str, index) => {
  return str.substr(0, index) + str.substr(index + 1);
};

const doubleCharAt = function (str, index) {
  return str.slice(0, index) + str.charAt(index) + str.slice(index);
};

const replaceCharAt = function (str, index, replace) {
  return str.substr(0, index) + replace + str.substr(index + 1);
};

const addCharAt = function (str, index, insertion) {
  return str.substr(0, index) + insertion + str.substr(index);
};

const switchCharAt = function (str, index) {
  return str.substr(0, index) +
    str.charAt(index + 1, 1) +
    str.substr(index, 1) +
    str.substr(index + 2);
};

module.exports = (domain, options, cb) => {
  let tld = tldReg.exec(domain)[1];
  let strippedDomain = domain.replace(tldReg, '');
  let letters = strippedDomain.split('');

  // TODO: Ensure that domain hasn't got http:// or https:// protocol

  async.series({
    // By repetition of character
    repetition: callback => {
      async.mapSeries(Object.keys(letters), (index, done) => {
        let url = doubleCharAt(strippedDomain, parseInt(index, 10)) + '.' + tld;
        doRequest(url, done);
      }, (err, results) => {
        results = results.filter(r => r);
        callback(err, results);
      });
    },

    // By omission of character
    omission: callback => {
      async.mapSeries(Object.keys(letters), (index, done) => {
        let url = removeCharAt(strippedDomain, parseInt(index, 10)) + '.' + tld;
        doRequest(url, done);
      }, (err, results) => {
        results = results.filter(r => r);
        callback(err, results);
      });
    },

    // By homoglyph (similar looking) characters
    homoglyphs: callback => {
      async.mapSeries(Object.keys(letters), (index, next) => {
        let letter = letters[index];
        if (!glyphs[letter]) {
          next(null, null);
          return;
        }

        // Iterate each glyph character
        async.mapSeries(glyphs[letter], (glyph, done) => {
          let url = replaceCharAt(strippedDomain, parseInt(index, 10), glyph) + '.' + tld;

          doRequest(url, done);
        }, (err, response) => {
          response = response.filter(r => r);
          next(err, response);
        });
      }, (err, results) => {
        results = _.flatten(results);
        callback(err, results);
      });
    },

    // By switched characters
    switching: callback => {
      async.mapSeries(Object.keys(letters), (index, done) => {
        index = parseInt(index, 10);
        if (index === letters.length - 1) {
          done(null, null);
          return;
        }
        let url = switchCharAt(strippedDomain, index) + '.' + tld;
        doRequest(url, done);
      }, (err, results) => {
        results = results.filter(r => r);
        callback(err, results);
      });
    },

    // By changing vowels
    vowelswap: callback => {
      const urls = [];
      const vowels = ['a', 'e', 'i', 'o', 'u'];

      // Iterate each letter to check for vowels
      for (var i = 0; i < letters.length; i++) {
        let letter = letters[i];
        if (!vowels.includes(letter)) {
          continue;
        }
        for (var j = 0; j < vowels.length; j++) {
          let vowel = vowels[j];
          if (vowel === letter) {
            continue;
          }
          urls.push(`${replaceCharAt(strippedDomain, i, vowel)}.${tld}`);
        }
      }

      // Verify each url
      async.mapSeries(urls, (url, done) => {
        doRequest(url, done);
      }, (err, results) => {
        results = results.filter(r => r);
        callback(err, results);
      });
    },

    // By truncating string with dot
    subdomain: callback => {
      async.mapSeries(Object.keys(letters), (index, done) => {
        index = parseInt(index, 10);
        if (index === 0) {
          done(null, null);
          return;
        }
        doRequest(`${addCharAt(strippedDomain, index, '.')}.${tld}`, done);
      }, (err, results) => {
        results = results.filter(r => r);
        callback(err, results);
      });
    }
  }, cb);
};

// Export functions for testing
module.exports.addCharAt = addCharAt;
module.exports.removeCharAt = removeCharAt;
module.exports.replaceCharAt = replaceCharAt;
module.exports.doubleCharAt = doubleCharAt;
module.exports.switchCharAt = switchCharAt;
