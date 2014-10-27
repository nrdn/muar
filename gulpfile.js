var gulp = require('gulp'),
	  del = require('del'),
		nodemon = require('gulp-nodemon'),
		autoprefixer = require('gulp-autoprefixer'),
		uglify = require('gulp-uglify'),
		stylus = require('gulp-stylus'),
		jshint = require('gulp-jshint');


var paths = {
	stylus: {
		src: ['public/src/styl/*.styl'],
		dest: 'public/build/css'
	},
	client_js: {
		src: ['public/src/js/*.js'],
		dest: 'public/build/js'
	},
	nodemon: {
		ignore: ['public/*']
	}
}


gulp.task('nodemon', function() {
	nodemon({ script: 'app.js', ext: 'js', ignore: paths.nodemon.ignore })
});


gulp.task('stylus', ['clean-css'], function () {
	gulp.src(paths.stylus.src)
			.pipe(stylus({
				compress: false
			}))
			.pipe(autoprefixer({
				browsers: ['last 2 versions'],
				cascade: true
			}))
			.pipe(gulp.dest(paths.stylus.dest));
});


gulp.task('clean-css', function(cb) {
	del(paths.stylus.dest, cb);
});


gulp.task('watch-stylus', function () {
	var watcher = gulp.watch(paths.stylus.src, ['stylus']);

	watcher.on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});


gulp.task('js', ['clean-js'], function () {
	gulp.src(paths.client_js.src)
			.pipe(jshint())
			.pipe(jshint.reporter('jshint-stylish'))
			.pipe(uglify())
			.pipe(gulp.dest(paths.client_js.dest));
});


gulp.task('clean-js', function(cb) {
	del(paths.client_js.dest, cb);
});


gulp.task('watch-js', function () {
	var watcher = gulp.watch(paths.client_js.src, ['js']);

	watcher.on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});


gulp.task('default', ['stylus', 'js']);
gulp.task('dev', ['watch-stylus', 'watch-js', 'nodemon']);