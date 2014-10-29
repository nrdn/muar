var runSequence = require('run-sequence'),
	  del = require('del');

var gulp = require('gulp'),
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
	return nodemon({ script: 'app.js', ext: 'js', ignore: paths.nodemon.ignore });
});


gulp.task('clean', function() {
	return del(['public/build/*', '!public/build/libs']);
});


gulp.task('stylus', function() {
	return 	gulp.src(paths.stylus.src)
							.pipe(stylus({
								compress: false
							}))
							.pipe(autoprefixer({
								browsers: ['last 2 versions'],
								cascade: true
							}))
							.pipe(gulp.dest(paths.stylus.dest));
});


gulp.task('scripts', function() {
	return 	gulp.src(paths.client_js.src)
							.pipe(jshint())
							.pipe(jshint.reporter('jshint-stylish'))
							.pipe(uglify())
							.pipe(gulp.dest(paths.client_js.dest));
});


gulp.task('watch', function() {
  var watcher_scripts = gulp.watch(paths.client_js.src, ['scripts']);
  var watcher_stylus = gulp.watch(paths.stylus.src, ['stylus']);

	var logger = function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	}

  watcher_scripts.on('change', logger);
  watcher_stylus.on('change', logger);
});


gulp.task('default', function(callback) {
  runSequence('clean', 'scripts', 'stylus', callback);
});

gulp.task('dev', function(callback) {
  runSequence('clean', 'scripts', 'stylus', ['watch', 'nodemon'],  callback);
});