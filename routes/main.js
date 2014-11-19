var Age = require('../models/main.js').Age;
var Object = require('../models/main.js').Object;
var Subject = require('../models/main.js').Subject;
var Architect = require('../models/main.js').Architect;
var async = require('async');

exports.locale = function(req, res) {
	res.cookie('locale', req.params.locale);
	res.redirect('back');
}

exports.index = function(req, res) {
	Age.find().where('parent').exists(false).sort('meta.interval.start meta.interval.end').exec(function(err, ages) {
		res.render('main', {ages: ages});
	});
}

exports.search = function(req, res) {
	var search = req.body.search;

	Architect.find({ $text: { $search: search } }, { score : { $meta: 'textScore' } }).exec(function(err, architects) {
		Object.find({ $text: { $search: search } }, { score : { $meta: 'textScore' } }).exec(function(err, objects) {
			Subject.find({ $text: { $search: search } }, { score : { $meta: 'textScore' } }).exec(function(err, subjects) {
				res.send({architects: architects, objects: objects, subjects: subjects});
			});
		});
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
				images: '$images'
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
		Age.populate(ages, {path: 'main sub.age', select: '-_id -date -__v -parent -sub'}, function(err, ages) {
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