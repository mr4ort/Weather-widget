global.hostname = "localhost";

var gulp = require('gulp'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
minifycss = require('gulp-minify-css'),
rename = require('gulp-rename'),
concat = require('gulp-concat');



var plugins = require('gulp-load-plugins')();

gulp.task('express', function() {
	var express = require('express');
	var app = express();
	app.use(require('connect-livereload')({port: 35729}));
	app.use(express.static(__dirname + '/app'));
	app.listen('80', hostname);
});

var tinylr;
gulp.task('livereload', function() {
	tinylr = require('tiny-lr')();
	tinylr.listen(35729);
});

function notifyLiveReload(event) {
	var fileName = require('path').relative(__dirname, event.path);
	tinylr.changed({
		body: {
			files: [fileName]
		}
	});
}

gulp.task('styles', function () {
	gulp.src('sass/*.sass')
	.pipe(concat('all.sass'))
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	}).on('error', sass.logError))

	.pipe(rename({suffix: '.min'}))
	.pipe(autoprefixer({
		browsers: ['last 15 versions'],
		cascade: false
	}))
	.pipe(plugins.minifyCss({compatibility: 'ie8'}))

	.pipe(plugins.rename('style.min.css'))
	//.pipe(minifycss())
	.pipe(gulp.dest('app/css'));
});

gulp.task('watch', function() {
	gulp.watch('sass/*.sass', ['styles']);
	gulp.watch('app/*.css', notifyLiveReload);
	gulp.watch('app/*.html', notifyLiveReload);
});

gulp.task('default', ['styles', 'express', 'livereload', 'watch'], function() {

});
