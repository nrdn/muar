var Era = require('../models/main.js').Era;
var Object = require('../models/main.js').Object;

exports.index = function(req, res) {
	res.redirect('/posts')
}

exports.test = function(req, res) {
	Object.aggregate()
	.unwind('history.ages')
	.group({
		'_id': {
			era: '$history.era',
			ages: '$history.ages'
		},
		'objects': {
			$push: {
				title: '$title',
				image: '$images.main',
				interval: '$ineterval'
			}
		}
	})
	.project({
		'_id': 0,
		'era': '$_id.era',
		'age': {
			'tag': '$_id.ages',
			'objects': '$objects'
		}
	})
	.exec(function(err, eras) {
		Era.populate(eras, {path: 'era', model: 'Era', select: '-_id -date -__v -description -ages'}, function(err, eras) {
			res.json(eras);
		});
	});
}


exports.locale = function(req, res) {
	res.cookie('locale', req.params.locale);
	res.redirect('back');
}