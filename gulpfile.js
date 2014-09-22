var gulp = require('gulp'),
		nodemon = require('gulp-nodemon'),
		autoprefixer = require('gulp-autoprefixer'),
		uglify = require('gulp-uglify'),
		stylus = require('gulp-stylus');


var paths = {
	stylus: {
		src: ['public/styles/*.styl'],
		dest: 'public/build/css'
	},
	client_js: {
		src: ['public/scripts/*.js'],
		dest: 'public/build/js'
	}
}


gulp.task('nodemon', function() {
  nodemon({ script: 'app.js', ext: 'js', ignore: paths.client_js.src })
});

gulp.task('stylus', function () {
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

gulp.task('watch_stylus', function () {
	var watcher = gulp.watch(paths.stylus.src, ['stylus']);

	watcher.on('change', function(event) {
	  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});

gulp.task('js', function () {
	gulp.src(paths.client_js.src)
			.pipe(uglify())
			.pipe(gulp.dest(paths.client_js.dest));
});

gulp.task('watch_js', function () {
	var watcher = gulp.watch(paths.client_js.src, ['js']);

	watcher.on('change', function(event) {
	  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});

gulp.task('default', ['stylus', 'js']);
gulp.task('dev', ['watch_stylus', 'watch_js', 'nodemon']);