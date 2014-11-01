var gm = require('gm').subClass({ imageMagick: true });
var path = require('path');
var async = require('async');
var fs = require('fs');
var appDir = path.dirname(require.main.filename);

var Era = require('../../models/main.js').Era;
var Object = require('../../models/main.js').Object;
var Architect = require('../../models/main.js').Architect;

exports.search = function(req, res) {
	Architect.find({ $text: { $search: 'архитектор' } }, { score : { $meta: 'textScore' } }).exec(function(err, result) {
		res.send(result)
	});
}

exports.json = function(req, res) {
	Object.aggregate()
	.sort('meta.interval.start meta.interval.end')
	.unwind('history.ages')
	.group({
		'_id': {
			era: '$history.era',
			age: '$history.ages'
		},
		'objects': {
			$push: {
				_id: '$_id',
				title: '$title',
				interval: '$meta.interval',
				image: '$images.main'
			}
		}
	})
	.group({
		'_id': {
			era: '$_id.era'
		},
		'ages': {
			$push: {
				age: '$_id.age',
				objects: '$objects'
			}
		}
	})
	.project({
		'_id': 0,
		'era': '$_id.era',
		'ages': '$ages'
	})
	.exec(function(err, eras) {
		Era.populate(eras, {path: 'era', select: '-_id -date -__v -description -ages -sub'}, function(err, eras) {
			Era.populate(eras, {path: 'ages.age', select: '-_id -date -__v -description -ages -sub'}, function(err, eras) {
				res.json(eras);
			});
		});
	});
}


exports.page = function(req, res) {
	Object.aggregate()
	.sort('meta.interval.start meta.interval.end')
	.unwind('history.ages')
	.group({
		'_id': {
			era: '$history.era',
			age: '$history.ages'
		},
		'objects': {
			$push: {
				_id: '$_id',
				title: '$title',
				interval: '$meta.interval',
				image: '$images.main'
			}
		}
	})
	.group({
		'_id': {
			era: '$_id.era'
		},
		'ages': {
			$push: {
				age: '$_id.age',
				objects: '$objects'
			}
		}
	})
	.project({
		'_id': 0,
		'era': '$_id.era',
		'ages': '$ages'
	})
	.exec(function(err, eras) {
		Era.populate(eras, {path: 'era ages.age', select: '-_id -date -__v -description -ages -sub'}, function(err, eras) {
			async.forEach(eras, function(era, callback) {
				era.ages.sort(function(a, b) { return a.age.interval.start > b.age.interval.start});
				callback();
			}, function() {
				eras.sort(function(a, b) { return a.era.interval.start > b.era.interval.start});
				res.render('main/test.jade', {eras: eras});
			});
		});
	});
}








exports.tiles_upload = function(req, res) {
	res.render('test/upload');
}

exports.tiles_upload_form = function(req, res) {
	var post = req.files;

	// gm(post.image.path).size({bufferStream: true}, function(err, size) {
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


	// gm().in('-crop', '100x100').in(post.image.path).write(appDir + '/public/tiles/%d.jpg', function(err) {
	// 	res.redirect('back');
	// });

	var arr = [
		{
			size: '100%',
			level: '4'
		},
		{
			size: '50%',
			level: '3'
		},
		{
			size: '25%',
			level: '2'
		},
		{
			size: '12.5%',
			level: '1'
		}
	];

	async.forEach(arr, function(item, callback) {
		fs.mkdir(appDir + '/public/tiles/' + item.level, function() {
			gm()
				.in(post.image.path)
				.in('-resize', item.size)
				.write(appDir + '/public/tiles/' + item.level + '/original.jpg', function(err) {
					gm()
						.in(appDir + '/public/tiles/' + item.level + '/original.jpg')
						.in('-crop', '100x100')
						.in('-set', 'filename:tile')
						.in('%[fx:page.y/100]_%[fx:page.x/100]')
						.write(appDir + '/public/tiles/' + item.level + '/image_tile_%[filename:tile].jpg', function(err) {
							fs.unlink(appDir + '/public/tiles/' + item.level + '/original.jpg', function() {
								callback();
							});
						});
				});
			});
		}, function() {
			res.redirect('back');
		});
}


exports.tiles_test= function(req, res) {
	res.render('test/tiles');
}