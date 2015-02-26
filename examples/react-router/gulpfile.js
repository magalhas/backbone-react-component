var gulp = require('gulp');
var util = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');

var browserSync = require('browser-sync');

var b = browserify('./src/main.js', {debug: true}).transform(babelify);

gulp.task('browserify', function () {
  return b.bundle()
    .on('error', util.log)
    .pipe(source('main.js'))
    .pipe(gulp.dest('./public'));
});

gulp.task('browser-sync', function () {
  browserSync({
    server: "./public"
  })
});

gulp.task('watch', function () {
  gulp.watch('src/*.js', ['browserify']);
  gulp.watch('public/**').on('change', browserSync.reload)
});

gulp.task('default', ['browser-sync', 'watch']);
