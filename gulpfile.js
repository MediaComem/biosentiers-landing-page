var gulp = require('gulp');
var less = require('gulp-less');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var proxy = require('proxy-middleware');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var url = require('url');
var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
  ' */\n',
  ''
].join('');

var config = {};
try {
  config = require('./config');
} catch(err) {
  // ignore
}

// Compile LESS files from /less into /css
gulp.task('less', function () {
  return gulp.src('sources/less/agency.less')
    .pipe(less())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest('sources/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function () {
  return gulp.src('sources/css/agency.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Minify JS
gulp.task('minify-js', function () {
  return gulp.src('sources/js/*.js')
    .pipe(uglify())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function () {
  gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
    .pipe(gulp.dest('vendor/bootstrap'));

  gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('vendor/jquery'));

  gulp.src([
    'node_modules/font-awesome/**',
    '!node_modules/font-awesome/**/*.map',
    '!node_modules/font-awesome/.npmignore',
    '!node_modules/font-awesome/*.txt',
    '!node_modules/font-awesome/*.md',
    '!node_modules/font-awesome/*.json'
  ])
    .pipe(gulp.dest('vendor/font-awesome'));

  gulp.src(['node_modules/object-fit-images/dist/*.min.js'])
    .pipe(gulp.dest('vendor/object-fit-images'));
});

// Run everything
gulp.task('default', ['compile', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: ''
    },
    middleware: [
      createProxy()
    ],
    browser: process.env.BROWSER || config.browser
  });
});

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'compile'], function () {
  gulp.watch('sources/less/*.less', ['less']);
  gulp.watch('sources/css/*.css', ['minify-css']);
  gulp.watch('sources/js/*.js', ['minify-js']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('js/**/*.js', browserSync.reload);
});

gulp.task('compile', ['less', 'minify-css', 'minify-js']);

gulp.task('build', ['compile'], function() {
  return gulp.src(['css/**/*', 'js/**/*', 'img/**/*', 'index.html', 'vendor/**/*'], {base: '.'})
    .pipe(gulp.dest('dist/'));
});

gulp.task('prod', ['build'], function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
    middleware: [
      createProxy()
    ]
  });
});

function createProxy() {

  var proxyOptions = url.parse(process.env.BACKEND_URL || config.backendUrl || 'https://biosentiers.heig-vd.ch/api');
  proxyOptions.route = '/api';

  return proxy(proxyOptions);
}
