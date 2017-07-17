'use strict';

var child = require('child_process');
var gutil = require('gulp-util');

var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');3
var livereload = require('gulp-livereload');

gulp.task('jekyll', () => {
  var jekyll = child.spawn('bundle', [
    'exec',
    'jekyll',
    'build'
  ]);

  var jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('sass', function () {
  return gulp.src('sass/**/*.sass')
    .pipe(sass({
      outputStyle: 'nested'
    }).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({browsers: 'last 3 versions'}),
      cssnano({autoprefixer: false, discardUnused: false})
    ]))
    .pipe(gulp.dest('css'));
});

gulp.task('sass:watch', function () {
  livereload.listen();
  gulp.watch('sass/**/*.sass', ['sass']);
  gulp.watch(['index.html', '_includes/*.md', '_config.yml', 'css/style.css', '_data/*.yml'], ['jekyll']);
  gulp.watch(['_dist/css/style.css'])
    .on('change', function(event) {
      livereload.changed(event);
    });
});

gulp.task('jekyll:watch', ['sass:watch']);
