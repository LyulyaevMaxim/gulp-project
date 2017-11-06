/* Gulp Project. Copyright © 2017. 
 * Maxim Buslaev, maximys@protonmail.com
 * ISC Licensed */
'use strict';

const
  gulp = require('gulp'),
  newer = require('gulp-newer'),
  plumber = require('gulp-plumber'),
  notify = require('gulp-notify');


/*--------------------- HTML--------------------------*/
const
  pug = require('gulp-pug');

gulp.task('pug-to-html', function () {
  return gulp.src('frontend/html/*.pug', { since: gulp.lastRun('pug-to-html') })
    .pipe(plumber({ errorHandler: notify.onError("Pug: <%= error.message %>") }))
    .pipe(newer('public'))
    .pipe(pug({ pretty: '\t' }))
    .pipe(gulp.dest('public'))
});

gulp.task('html', function () {
  return gulp.src('frontend/html/*.html', { since: gulp.lastRun('html') })
    .pipe(plumber({ errorHandler: notify.onError("HTML: <%= error.message %>") }))
    .pipe(newer('public'))
    .pipe(gulp.dest('public'))
});
/*---------------------END: HTML--------------------------*/


/*---------------------IMG--------------------------*/
const imagemin = require('gulp-imagemin');

gulp.task('img', function () {
  return gulp.src('frontend/img/**/*.*')
    .pipe(plumber({ errorHandler: notify.onError("IMAGES: <%= error.message %>") }))
    .pipe(newer('public/img/'))
    .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
    .pipe(gulp.dest('public/img/'))
});
/*---------------------END: IMG--------------------------*/


/*---------------------PostCSS--------------------------*/
const
  postcss = require('gulp-postcss'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
  syntax_scss = require('postcss-scss'),
  precss = require("precss"),
  // postcss_css_reset = require('postcss-css-reset'),
  autoprefixer = require('autoprefixer'),
  assets = require('postcss-assets'),
  mqpacker = require('css-mqpacker'),
  sprites = require('postcss-sprites');

const base_plugins = [
  precss({ preserve: true }),
  assets({ loadPaths: ['img/'] }),
  sprites({ spritePath: './public/img' }),
  // postcss_css_reset,
  autoprefixer({ browsers: ['last 5 version'] }),
  mqpacker({ sort: true })
];

gulp.task('css', function () {
  return gulp.src('frontend/css/*.scss', { since: gulp.lastRun('css') })
    .pipe(plumber({ errorHandler: notify.onError("CSS: <%= error.message %>") }))
    .pipe(sourcemaps.init())
    .pipe(postcss(base_plugins, { parser: syntax_scss }))
    .pipe(rename({ extname: '.css' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/styles'))
});
/*---------------------END: PostCSS--------------------------*/

/*---------------------Fonts--------------------------*/
gulp.task('fonts', function () {
  return gulp.src('frontend/css/fonts/**/*.*')
    .pipe(plumber({ errorHandler: notify.onError("FONTS: <%= error.message %>") }))
    .pipe(newer('public/styles/fonts/'))
    .pipe(gulp.dest('public/styles/fonts/'))
});
/*---------------------END: Fonts--------------------------*/

/*---------------------Scripts--------------------------*/
const babel = require('gulp-babel');

gulp.task('scripts', function () {
  return gulp.src('frontend/js/**/*.*')
    .pipe(plumber({ errorHandler: notify.onError("JS: <%= error.message %>") }))
    .pipe(newer('public/js'))
    .pipe(gulp.dest('public/js'))
});

gulp.task('scripts-es', function () {
  return gulp.src('public/js/*.js')
    .pipe(plumber({ errorHandler: notify.onError("JS: <%= error.message %>") }))
    .pipe(babel({ presets: ['env'] }))
    .pipe(gulp.dest('public/js'))
});

gulp.task('scripts-components', function () {
  return gulp.src('frontend/components/**/*.js', { since: gulp.lastRun('scripts-components') })
    .pipe(plumber({ errorHandler: notify.onError("JS: <%= error.message %>") }))
    .pipe(newer('public/js/components'))
    .pipe(gulp.dest('public/js/components'))
});

gulp.task('components-es', function () {
  return gulp.src('public/js/components/**/*.js')
    .pipe(plumber({ errorHandler: notify.onError("JS: <%= error.message %>") }))
    .pipe(babel({ presets: ['env'] }))
    .pipe(gulp.dest('public/js/components'))
});
/*---------------------END: Scripts--------------------------*/


/*---------------------Build--------------------------*/
const
  uglify = require('gulp-uglify'),
  cssnano = require('cssnano'),
  optimization_plugins = [cssnano],
  del = require('del');

gulp.task('js-optim', function () {
  return gulp.src('public/js/**/*.js')
    .pipe(plumber({ errorHandler: notify.onError("JS: <%= error.message %>") }))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

gulp.task('сss-optim', function () {
  return gulp.src('public/**/*.css')
    .pipe(plumber({ errorHandler: notify.onError("CSS: <%= error.message %>") }))
    .pipe(postcss(optimization_plugins))
    .pipe(gulp.dest('public'));
});

gulp.task('build', gulp.parallel('js-optim', 'сss-optim'));
/*---------------------END: Build--------------------------*/


/*---------------------RELOAD BROWSERS--------------------------*/
const browserSync = require('browser-sync').create();
gulp.task('reload', function (done) {
  browserSync.reload();
  done();
});
/*---------------------END: RELOAD BROWSERS--------------------------*/


gulp.task('default', gulp.series(gulp.parallel(gulp.series('img', 'css'), gulp.series('scripts', 'scripts-components', 'scripts-es', 'components-es'), gulp.series('pug-to-html', 'html', function () {
  browserSync.init({
    server: {
      baseDir: "./public/"
    }
  })
  gulp.watch('frontend/css/fonts/**/*.*', gulp.series('fonts', 'reload'));
  gulp.watch('frontend/img/**/*.*', gulp.series('img', 'reload'));
  gulp.watch(['frontend/css/*.scss'], gulp.series('css', 'reload'));
  gulp.watch([
    'frontend/js/**/*.js', 'frontend/components/**/*.js'
  ], gulp.series('scripts', 'scripts-components', 'scripts-es', 'components-es', 'reload'));
  gulp.watch(['frontend/html/*.pug'], gulp.series('pug-to-html', 'reload'));
  gulp.watch(['frontend/html/*.html'], gulp.series('html', 'reload'));
}))
));