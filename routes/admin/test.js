var gm = require('gm').subClass({ imageMagick: true });
var path = require('path');
var appDir = path.dirname(require.main.filename);

var Era = require('../../models/main.js').Era;
var Object = require('../../models/main.js').Object;

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

exports.tiles_upload = function(req, res) {
	res.render('test/upload');
}

exports.tiles_upload_form = function(req, res) {
	var post = req.files;

	gm(post.image.path).size({bufferStream: true}, function(err, size) {
	  this.resize(size.width / 2, size.height / 2);
	  this.in('-crop', '100x100');
	  this.write(appDir + '/public/tiles/%d.jpg', function (err) {
	    res.redirect('back');
	  });
	});

	// gm().in('-crop', '100x100').in(post.image.path).write(appDir + '/public/tiles/%d.jpg', function(err) {
	// 	res.redirect('back');
	// });
}