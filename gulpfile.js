gulp = require('gulp');
plugins = require('gulp-load-plugins')();
fs = require('fs');
del = require('del');
path = require('path');



buildCore = [
	'modules/core.js',
	'modules/xhr.js',
	'modules/get.js',
	'modules/post.js',
]

buildFull = [
	'modules/core.js',
	'modules/**.js',
]


buildOrder = [
	'Start',
	'Build core',
	'Build full'
]

gulp.task('Start', function() {
	del.sync(['dist'], {force: true})
	return gulp		
});

gulp.task('build', buildOrder, function() {
	return gulp		
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build'], function () {
	gulp.watch('modules/**/*', ['build']);
});

gulp.task('Build core', function() {
	return gulp.src(buildCore)
	.pipe(plugins.sourcemaps.init())
	.pipe(plugins.concat('jaxxy-core.min.js'))
	.pipe(plugins.uglify({
		mangle:true
	}))
	.pipe(plugins.sourcemaps.write('./'))
	.pipe(gulp.dest('dist'));
});

gulp.task('Build full', ['Export mule'], function() {
	return gulp.src(buildFull)
	.pipe(plugins.sourcemaps.init())
	.pipe(plugins.concat('jaxxy.min.js'))
	.pipe(plugins.uglify({
		mangle:true
	}))
	.pipe(plugins.sourcemaps.write('./'))
	.pipe(gulp.dest('dist'));
});

gulp.task('Export mule', function() {
	return gulp.src('modules/mule.html')
	.pipe(gulp.dest('dist'));
});