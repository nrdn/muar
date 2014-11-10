var gm = require('gm').subClass({ imageMagick: true });
var path = require('path');
var async = require('async');
var del = require('del');
var mkdirp = require('mkdirp');
var fs = require('fs');
var appDir = path.dirname(require.main.filename);

var Object = require('../../models/main.js').Object;
var Subject = require('../../models/main.js').Subject;

// ------------------------
// *** Handlers Block ***
// ------------------------


var set_date = function(year) {
  return new Date(Date.UTC(year, 0, 1));
}


// ------------------------
// *** Admin Objects Block ***
// ------------------------


exports.list = function(req, res) {
	var id = req.params.object_id;
  Object.findById(id).populate('subjects').exec(function(err, object) {
    res.render('auth/subjects', {object: object});
  });
}


// ------------------------
// *** Add Architects Block ***
// ------------------------


exports.add = function(req, res) {
  res.render('auth/subjects/add.jade');
}

exports.add_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var subject = new Subject();

  subject.title =[{
  	lg: 'ru',
  	value: post.ru.title
  }];
  subject.description = [{
  	lg: 'ru',
  	value: post.ru.description
  }];

  subject.meta.interval.start = set_date(post.interval.start);
  subject.meta.interval.end = set_date(post.interval.end);

  subject.image.original = '/images/subjects/' + subject._id + '/original.jpg';
  subject.image.thumb = '/images/subjects/' + subject._id + '/thumb.jpg';
  subject.image.tiles = '/images/subjects/' + subject._id + '/tiles';

	// gm(files.image.path).size({bufferStream: true}, function(err, size) {
	//   this.resize(size.width / 2, size.height / 2);
	//   this.in('-crop', '100x100');
	//   this.in('-set', 'filename:tile');
	//   this.in('%[fx:page.y/100]_%[fx:page.x/100]');
	//   this.in('+repage');
	//   this.in('+adjoin');
	//   this.write(appDir + '/public/tiles/image_tile%[filename:tile].jpg', function (err) {
	//     res.redirect('back');
	//   });
	// });


	// gm().in('-crop', '100x100').in(files.image.path).write(appDir + '/public/tiles/%d.jpg', function(err) {
	// 	res.redirect('back');
	// });

	var zoom = [{ size: '100%', level: '4' }, { size: '50%', level: '3' }, { size: '25%', level: '2' }, { size: '12.5%', level: '1' }];
	var subject_folder = appDir + '/public/images/subjects/' + subject._id;

	mkdirp.sync(subject_folder + '/tiles');
	fs.renameSync(files.image.path, subject_folder + '/original.jpg');

	async.forEach(zoom, function(item, callback) {
		var level_folder = subject_folder + '/tiles/' + item.level;
		fs.mkdir(level_folder, function() {
			gm(subject_folder + '/original.jpg')
				.in(files.image.path)
				.in('-resize', item.size)
				.write(level_folder + '/original.mpc', function(err) {
					gm()
						.in(level_folder + '/original.mpc')
						.in('-crop', '256x256')
						.in('-set', 'filename:tile')
						.in('%[fx:page.y/256]_%[fx:page.x/256]')
						.write(level_folder + '/image_tile_%[filename:tile].jpg', function(err) {
							if (item.level == '1') {
								gm(level_folder + '/original.mpc').write(subject_folder + '/thumb.jpg', function() {
									del([level_folder + '/original.mpc', level_folder + '/original.cache'], function() {
										callback();
									});
								});
							}
							else {
								del([level_folder + '/original.mpc', level_folder + '/original.cache'], function() {
									callback();
								});
							}
						});
				});
			});
		}, function() {
		  subject.save(function(err, subject) {
		  	Object.findById(req.params.object_id).exec(function(err, object) {
		  		object.subjects.push(subject._id);
		  		object.save(function(err, object) {
		  			res.redirect('/auth');
		  		});
		  	});
		  });
		});



  // subject.save(function(err, subject) {
  // 	Object.findById(req.params.object_id).exec(function(err, object) {
  // 		object.subjects.push(subject._id);
  // 		object.save(function(err, object) {
  // 			res.redirect('/auth');
  // 		});
  // 	});
  // });
}