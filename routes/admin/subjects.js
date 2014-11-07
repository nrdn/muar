var gm = require('gm').subClass({ imageMagick: true });
var path = require('path');
var async = require('async');
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

	var arr = [{ size: '100%', level: '4' }, { size: '50%', level: '3' }, { size: '25%', level: '2' }, { size: '12.5%', level: '1' }];

	async.forEach(arr, function(item, callback) {
		fs.mkdir(appDir + '/public/tiles/' + item.level, function() {
			gm()
				.in(files.image.path)
				.in('-resize', item.size)
				.write(appDir + '/public/tiles/' + item.level + '/original.mpc', function(err) {
					gm()
						.in(appDir + '/public/tiles/' + item.level + '/original.mpc')
						.in('-crop', '256x256')
						.in('-set', 'filename:tile')
						.in('%[fx:page.y/256]_%[fx:page.x/256]')
						.write(appDir + '/public/tiles/' + item.level + '/image_tile_%[filename:tile].jpg', function(err) {
							fs.unlink(appDir + '/public/tiles/' + item.level + '/original.mpc', function() {
								fs.unlink(appDir + '/public/tiles/' + item.level + '/original.cache', function() {
									callback();
								});
							});
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