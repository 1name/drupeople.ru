const SITE_URL = 'https://drupeople.devel.lndo.site/';

const gulp = require('gulp')
const include = require('gulp-include')
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync')
const concat = require('gulp-concat')
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')
const del = require('del')
const plumber = require('gulp-plumber')
const autoprefixer = require('gulp-autoprefixer')
const notify = require("gulp-notify")
const arg = require('yargs').argv

/**
 * JS
 */
// build vendor scripts
gulp.task('scripts:vendor', function() {
  return gulp.src([
    'src/js/vendor/*.js',
  ])
  .pipe(sourcemaps.init())
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('build/js'))
  .pipe(browserSync.reload({stream: true}));
});
// build custom scripts
gulp.task('scripts:custom', function() {
  return gulp.src([
    'src/js/custom.js',
  ])
  .pipe(include())
  .pipe(sourcemaps.init())
  .pipe(concat('custom.js'))
  .pipe(gulp.dest('build/js'))
  .pipe(browserSync.reload({stream: true}));
});


/**
 * Styles
 */
// build vendor styles
gulp.task('styles:vendor', function() {
  return gulp.src([
    'src/style/vendor/*.css',
  ])
  .pipe(sourcemaps.init())
  .pipe(concat('vendor.css'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('build/css'))
  .pipe(browserSync.reload({stream: true}));
});
// build normalize
gulp.task('styles:normalize', function() {
  return gulp.src([
    'src/style/normalize.css',
  ])
  .pipe(sourcemaps.init())
  .pipe(concat('normalize.css'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('build/css'))
  .pipe(browserSync.reload({stream: true}));
});
// build custom styles
gulp.task('styles:sass', function() {
  return gulp.src('src/style/custom.sass')
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", notify.onError()))
    .pipe(rename({
      suffix: '',
      prefix: ''
    }))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.reload({stream: true}));
});


/**
 * Browser sync
 */
gulp.task('browser:sync', function() {
  browserSync.init({
    port: 8080,
    proxy: SITE_URL,
    https: true,
    ws: true,
    serveStatic: [{
      route: '/themes/mytheme/build',
      dir: 'build'
    }],
    open: true
  });
});


/**
 * Images
 */
gulp.task('images', function() {
  return gulp.src(['src/img/**'])
    .pipe(plumber())
    .pipe(gulp.dest('build/img'));
});


/**
 * Watcher
 */
gulp.task('watch', function () {
    gulp.watch('src/style/**/*.{sass,scss}', gulp.parallel('styles:sass'));
    gulp.watch(['src/js/**/*.js', 'src/js/custom.js'], gulp.parallel('scripts:vendor', 'scripts:custom'));
    gulp.watch('src/img/**', gulp.series('images'));
});


/**
 * Group tasks
 */
gulp.task('build:scripts', gulp.series('scripts:vendor', 'scripts:custom'));
gulp.task('build:styles', gulp.series('styles:sass', 'styles:normalize', 'styles:vendor'));


/**
 * Additional tasks
 */
gulp.task('delete:build', function () {
    return del('build');
});


/**
 * Bild task (for production)
 */
gulp.task('build', gulp.series('delete:build',
  gulp.parallel('build:scripts', 'build:styles', 'images')
));


/**
 * Default task
 */
gulp.task('default', gulp.parallel('watch', 'styles:sass', 'scripts:vendor', 'styles:vendor', 'browser:sync'));