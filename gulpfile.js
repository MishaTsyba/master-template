'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var notify = require("gulp-notify");
var concat = require('gulp-concat');
var rigger = require('gulp-rigger');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var uglify = require('gulp-uglify');
var del = require('del');
var clean = require('gulp-clean');
//var bourbon= require("bourbon").includePaths;
// var babel = require('gulp-babel');

gulp.task('html', function () {
	return gulp.src('./dev/templates/*.html')
		.pipe(rigger())
		.pipe(gulp.dest('./dev'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('sass', function () {
	setTimeout(() => {
  return gulp.src('./dev/assets/scss/styles.scss')
  	.pipe(sourcemaps.init())
    .pipe(sass().on("error", notify.onError()))
    .pipe(autoprefixer(['last 3 versions', '> 5%', 'Firefox ESR', 'ie >= 7']))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dev/assets/css'))
    .pipe(browserSync.reload({stream: true}));
  },500);
});

gulp.task('js', function() {
	return gulp.src('./dev/assets/scripts/*.js')
	.pipe(gulp.dest('./dev/assets/scripts'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function() {
    return gulp.src('./dev/assets/img/**/*')
        .pipe(imagemin({ 
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./release/assets/img')); 
});

gulp.task('browser-sync', function() {
	browserSync({
		//browser: "chrome.exe",
		server: {
			baseDir: './dev'
		},
		notify: false
	});
});

gulp.task('watch', ['html', 'sass', 'js', 'browser-sync'], function() {
	gulp.watch('./dev/assets/scss/**/*.scss', ['sass']);
	gulp.watch('./dev/assets/scripts/**/*.js', browserSync.reload);
	gulp.watch("./dev/templates/**/*.html", ['html']);
});

gulp.task('build', ['delrelease', 'html', 'sass', 'js', 'img'], function() {

	var buildFiles = gulp.src([
		'./dev/*.html',
		]).pipe(gulp.dest('./release'));

	var buildCss = gulp.src([
		'./dev/assets/css/styles.css',
		]).pipe(gulp.dest('./release/assets/css'));
	

	var buildJs = gulp.src([
		'./dev/assets/scripts/*.js',
		]).pipe(gulp.dest('./release/assets/scripts'));

	var buildFonts = gulp.src([
		'./dev/assets/fonts/**/*',
		]).pipe(gulp.dest('./release/assets/fonts'));

});

gulp.task('delrelease', function () {
    return gulp.src('./release', {read: false})
        .pipe(clean());
});
 
gulp.task('default', ['watch']);