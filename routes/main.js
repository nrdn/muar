var Era = require('../models/main.js').Era;
var Object = require('../models/main.js').Object;

exports.index = function(req, res) {
	res.render('main');
}

exports.columns = function(req, res) {
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
				res.render('main/columns.jade', {eras: eras});
			});
		});
	});
}


exports.locale = function(req, res) {
	res.cookie('locale', req.params.locale);
	res.redirect('back');
}