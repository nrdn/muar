var Era = require('../models/main.js').Era;
var Object = require('../models/main.js').Object;
var async = require('async');

exports.locale = function(req, res) {
	res.cookie('locale', req.params.locale);
	res.redirect('back');
}

exports.index = function(req, res) {
	Era.find().where('sub').equals(false).sort('interval.start').exec(function(err, eras) {
		res.render('main', {eras: eras});
	});
}

exports.styles = function(req, res) {
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
				res.render('main/styles.jade', {eras: eras});
			});
		});
	});
}