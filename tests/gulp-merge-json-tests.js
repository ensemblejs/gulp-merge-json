'use strict';

var expect = require('expect');
var fs = require('fs');
var gulp = require('gulp');
var mergeJson = require('../src/index');

describe('merge json', function () {
  beforeEach(function () {
    fs.mkdirSync('tmp');
    fs.mkdirSync('tmp/in');
    fs.mkdirSync('tmp/out');
    fs.mkdirSync('tmp/base');
  });

  afterEach(function () {
    fs.rmdirSync('tmp/in');
    fs.rmdirSync('tmp/out');
    fs.rmdirSync('tmp/base');
    fs.rmdirSync('tmp');
  });

  describe('when a supplied file is both locations', function () {
    beforeEach(function (done) {
      fs.writeFileSync('tmp/in/supplied.json', JSON.stringify({from: 'supplied'}), 'utf8');
      fs.writeFileSync('tmp/base/supplied.json', JSON.stringify({within: 'base'}), 'utf8');

      fs.writeFileSync('tmp/in/deep.json', JSON.stringify({from: { deep: { in: { the: 'jungle'}}}}), 'utf8');
      fs.writeFileSync('tmp/base/deep.json', JSON.stringify({from: { deep: { in: { other: 'places'}}}}), 'utf8');

      fs.writeFileSync('tmp/in/overwrite.json', JSON.stringify({from: 'supplied'}), 'utf8');
      fs.writeFileSync('tmp/base/overwrite.json', JSON.stringify({from: 'base'}), 'utf8');

      gulp.src('tmp/in/*.json')
        .pipe(mergeJson(__dirname + '/../tmp/base'))
        .pipe(gulp.dest('tmp/out/'))
        .on('end', done);
    });

    afterEach(function () {
      fs.unlinkSync('tmp/in/supplied.json');
      fs.unlinkSync('tmp/out/supplied.json');
      fs.unlinkSync('tmp/base/supplied.json');

      fs.unlinkSync('tmp/in/deep.json');
      fs.unlinkSync('tmp/out/deep.json');
      fs.unlinkSync('tmp/base/deep.json');

      fs.unlinkSync('tmp/in/overwrite.json');
      fs.unlinkSync('tmp/out/overwrite.json');
      fs.unlinkSync('tmp/base/overwrite.json');
    });

    it('should merge the supplied with the base', function () {
      var merged = fs.readFileSync('tmp/out/supplied.json', 'utf-8');
      expect(JSON.parse(merged)).toEqual({
        from: 'supplied', within: 'base'
      });
    });

    it('should do a deep merge', function () {
      var merged = fs.readFileSync('tmp/out/deep.json', 'utf-8');
      expect(JSON.parse(merged)).toEqual({
        from: { deep: { in: { the: 'jungle', other: 'places' }}}
      });
    });

    it('should favour the supplied over the base', function () {
      var merged = fs.readFileSync('tmp/out/overwrite.json', 'utf-8');
      expect(JSON.parse(merged)).toEqual({ from: 'supplied' });
    });
  });

  describe('when a supplied file is not the base path', function () {
    beforeEach(function (done) {
      fs.writeFileSync('tmp/in/supplied.json', JSON.stringify({from: 'only'}), 'utf8');

      gulp.src('tmp/in/*.json')
        .pipe(mergeJson(__dirname + '../tmp/base'))
        .pipe(gulp.dest('tmp/out/'))
        .on('end', done);
    });

    afterEach(function () {
      fs.unlinkSync('tmp/in/supplied.json');
      fs.unlinkSync('tmp/out/supplied.json');
    });

    it('should use the supplied file entirely', function () {
      var merged = fs.readFileSync('tmp/out/supplied.json', 'utf-8');
      expect(JSON.parse(merged)).toEqual({ from: 'only' });
    });
  });
});