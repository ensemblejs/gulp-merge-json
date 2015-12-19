'use strict';

var path = require('path');
var gutil = require('gulp-util');
var merge = require('lodash').merge;
var File = gutil.File;
var fs = require('fs');
var through = require('through2');

function mergeJson(pathToJsonFiles) {
  function merge2(file, callback) {
    var filename = file.path.replace(file.base, '');

    var pathToBase = path.join(__dirname, pathToJsonFiles, filename);
    fs.exists(pathToBase, function (exists) {
      if (exists) {
        var local = JSON.parse(file.contents.toString());
        var base = require(pathToBase);
        var merged = merge(base, local);

        callback(null, new File({
          cwd: file.cwd,
          base: file.base,
          path: file.path,
          contents: new Buffer(JSON.stringify(merged))
        }));
      } else {
        callback(null, file);
      }
    });
  }

  return through.obj(function(file, encoding, callback) {
    merge2(file, callback);
  });
}

module.exports = mergeJson;