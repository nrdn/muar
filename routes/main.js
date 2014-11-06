var Age = require('../models/main.js').Age;
var Object = require('../models/main.js').Object;
var async = require('async');

exports.locale = function(req, res) {
	res.cookie('locale', req.params.locale);
	res.redirect('back');
}

exports.index = function(req, res) {
	Age.find().where('parent').exists(false).sort('interval.start').exec(function(err, ages) {
		res.render('main', {ages: ages});
	});
}

exports.styles = function(req, res) {
	Object.aggregate()
	.sort('meta.interval.start meta.interval.end')
	.unwind('ages.sub')
	.group({
		'_id': {
			main: '$ages.main',
			sub: '$ages.sub'
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
			main: '$_id.main'
		},
		'sub': {
			$push: {
				age: '$_id.sub',
				objects: '$objects'
			}
		}
	})
	.project({
		'_id': 0,
		'main': '$_id.main',
		'sub': '$sub'
	})
	.exec(function(err, ages) {
		Age.populate(ages, {path: 'main sub.age', select: '-_id -date -__v -description -parent -sub'}, function(err, ages) {
			async.forEach(ages, function(age, callback) {
				age.sub.sort(function(a, b) { return a.age.meta.interval.start > b.age.meta.interval.start});
				callback();
			}, function() {
				ages.sort(function(a, b) { return a.main.meta.interval.start > b.main.meta.interval.start});
				res.render('main/styles.jade', {ages: ages});
			});
		});
	});
}