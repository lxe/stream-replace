# stream-replace

[![Build Status](https://travis-ci.org/lxe/stream-replace.svg)](https://travis-ci.org/lxe/stream-replace)

Returns a transform stream that outputs data with 'needle' replaced with 'replacer'.

#### Features

 - Same API as [`String.replace()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
 - Honors needles appearing on chunk boundaries.

#### `streamReplace(regexp|substr, newSubStr|function)`

 - Returns a `Stream.Transform` instance, whose output has some or all matches of a pattern in the stream's input replaced by a replacement. The pattern can be a string or a RegExp, and the replacement can be a string or a function to be called for each match. See [`String.prototype.replace()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace).

#### Examples

```javascript
// Repalce all occurrences of 'foo' in 'data.txt' with 'bar',
// and output to stdout

var fs = require('fs');
var replace = require('stream-replace');

fs.createReadStream('data.txt')
  .pipe(replace(/foo/g, 'bar'))
  .pipe(process.stdout);
```

```javascript
// Create a server listening on port 3000 that
// proxies www.example.com, and replaces
// 'example' with 'zombocom', and 'domain' with 'web page'

var replace = require('stream-replace');
var http = require('http');

http.createServer(function handler(req, res) {
  http.request('http://www.example.com/', function onResponse(response) {
    response
      .pipe(replace(/example/ig, 'zombocom'))
      .pipe(replace(/domain/ig,  'web page'))
      .pipe(res);
  }).end();
}).listen(3000);
```

#### License

MIT
