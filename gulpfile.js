'use strict';

var gulp = require('gulp');
var path = require('path');
var del = require('del');
var connect = require('gulp-connect');
var settings = require('./democritus.json');
var u = require('./libs/utilities');

require('gulp-load')(gulp);

gulp.loadTasks(u.getPath(settings.paths.core.root, 'modules_gulp.js'));
gulp.loadTasks(u.getPath(settings.paths.libs.root, 'engine_gulp.js'));

gulp.task('clean', function(cb) {
	del.sync([
		path.resolve(settings.paths.public.data, '*'),
		path.resolve(settings.paths.public.markups, '*'),
		path.resolve(settings.paths.public.patterns, '*')
	], {force: true});
	cb();
});

gulp.task('connect', function () {
	connect.server({
		root: [settings.paths.public.root],
		port: 8080
	});
});

gulp.task('copy:css', function() {
		return gulp.src('**/*.css', {
				cwd: gulp.src(u.getPath(settings.paths.src.css))
			})
			.pipe(gulp.dest(u.getPath(settings.paths.public.css)));
});

gulp.task('copy:images', function() {
		return gulp.src(['**/*.gif', '**/*.jpg', '**/*.png', '**/*.svg'], {
				cwd: gulp.src(u.getPath(settings.paths.src.images))
			})
			.pipe(gulp.dest(u.getPath(settings.paths.public.images)));
});

gulp.task('copy:js', function() {
		return gulp.src('**/*.js', {
				cwd: gulp.src(u.getPath(settings.paths.src.js))
			})
			.pipe(gulp.dest(u.getPath(settings.paths.public.js)));
});

gulp.task('copy:styleguide', function(cb) {
		return gulp.src(['**/*.css', '**/*.html', '**/*.js'], {
				cwd: u.getPath(settings.paths.src.styleguides)
			})
			.pipe(gulp.dest(u.getPath(settings.paths.public.styleguides)));
});

gulp.task('watch', ['connect'], function () {
	gulp.watch([
		u.getPath(settings.paths.src.patterns, '**/*.handlebars'),
		u.getPath(settings.paths.src.patterns, '**/*.json'),
		u.getPath(settings.paths.src.layouts, '**/*.handlebars'),
		u.getPath(settings.paths.src.data, '**/*.json')
	], ['engine']);
	gulp.watch('./core/modules/navigation/js/**/*.js', ['js:navigation', 'copy:styleguide']);
	gulp.watch('./core/modules/navigation/scss/**/*.scss', ['sass:navigation']);
	gulp.watch('./core/modules/navigation/template/**/*.html', ['html:navigation']);
})


gulp.task('copy:all', ['copy:js', 'copy:css', 'copy:images', 'copy:styleguide']);
gulp.task('navigation', ['sass:navigation', 'js:navigation', 'html:navigation']);
gulp.task('default', ['navigation', 'copy:all', 'engine']);
gulp.task('server', ['navigation', 'copy:all', 'engine', 'connect']);
