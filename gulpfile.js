var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var log = require('gulplog');
var tap = require('gulp-tap');
var buffer = require('gulp-buffer');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('js', function () {

  return gulp.src('sketches/00*/src/*.js', {read: false}) // no need of reading file because browserify does.

    // transform file objects using gulp-tap plugin
    .pipe(tap(function (file) {

      log.info('bundling ' + file.path);

      // replace file contents with browserify's bundle stream
      // file.contents = browserify(file.path, {debug: true}).bundle();
        file.contents = browserify(file.path, {debug: true})
            .transform('babelify', {presets: ['env']})
            .bundle()
    }))

    // transform streaming contents into buffer contents (because gulp-sourcemaps does not support streaming contents)
    .pipe(buffer())

    // load and init sourcemaps
    .pipe(sourcemaps.init({loadMaps: true}))

    // write sourcemaps
    .pipe(sourcemaps.write('./'))

    .pipe(gulp.dest('dest'));

});
