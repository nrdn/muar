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
	Age.find().where('parent').exists(false).sort('meta.interval.start meta.interval.end').select('-date -__v -_id').exec(function(err, ages) {
		Age.populate(ages, {path: 'sub', select: '-date -__v -parent -sub', options: {sort: 'meta.interval.start meta.interval.end'}}, function(err, ages) {
			res.render('main/styles.jade', {ages: ages});
		});
	});
}

exports.get_objects = function(req, res) {
	var post = req.body;
	Object.find().where('ages.sub').equals(post.ages_id).skip(post.skip).limit(5).exec(function(err, objects) {

		res.send(objects);
	});
}