'use strict';

var fs = require('fs');
var bl = require('bl');
var test = require('tape');

var replace = require('../stream-replace');

var multiChunkOptions = {
  // force 16k chunks for testing
  highWaterMark: Math.pow(2, 14)
};

function replacerFunction(match, $0, $1) {
  return $1 + $0;
}

test('regex replace with a string (single-chunk)',
  genTest('lipsum-small.txt', /ipsum/g, 'something'))

test('regex replace with a string (multi-chunk)',
  genTest('lipsum-large.txt', /ipsum/g, 'something', multiChunkOptions));

test('regex replace with a replacer function (single-chunk)',
  genTest('lipsum-small.txt', /(ip)(sum)/g, replacerFunction));

test('regex replace with a replacer function (single-chunk)',
  genTest('lipsum-large.txt', /(ip)(sum)/g, replacerFunction, multiChunkOptions));

function genTest(file, matcher, replaceWith, opts) {
  return function t(assert) {
    var dataFilePath = __dirname + '/data/' + file;

    var expected = fs.readFileSync(dataFilePath, {
      encoding: 'utf8'
    }).replace(matcher, replaceWith);

    fs.createReadStream(dataFilePath, opts)
      .pipe(replace(matcher, replaceWith))
      .pipe(bl(verify));

    function verify(err, data) {
      assert.ifError(err, 'should not error');
      assert.deepEqual(expected, data.toString(),
          'should be equal to the expected result');
      assert.end();
    }
  }
}
