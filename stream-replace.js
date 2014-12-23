// Copyright (c) 2014, Aleksey Smolenchuk <lxe@lxe.co>

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

'use strict';

var Transform = require('stream').Transform;

/**
 * Returns a transform stream that replaces
 * 'needle' with 'replacer' in the data piped into it.
 *
 * All read data is converted ot utf-8 strings before
 * the replacement isperformed.
 *
 * Honors needles appearing on chunk boundaries.
 *
 * Abides by the same rules as String.replace();
 *
 * @param  {String|RegExp}   needle   needle
 * @param  {String|Function} replacer replacer
 * @return {TransformStream}
 */
function replaceStream(needle, replacer) {
  var ts = new Transform();
  var chunks = [], len = 0, pos = 0;

  ts._transform = function _transform(chunk, enc, cb) {

    chunks.push(chunk);
    len += chunk.length;

    if (pos === 1) {
      var data = Buffer.concat(chunks, len)
        .toString()
        .replace(needle, replacer);

      // TODO: examine and profile garbage
      chunks = [];
      len = 0;

      this.push(data);
    }

    pos = 1 ^ pos;
    cb(null);
  };

  ts._flush = function _flush(cb) {
    if (chunks.length) {
      this.push(Buffer.concat(chunks, len)
        .toString()
        .replace(needle, replacer))
    }

    cb(null);
  }

  return ts;
}

module.exports = replaceStream;

