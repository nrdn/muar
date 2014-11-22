var Age = require('../models/main.js').Age;
var Object = require('../models/main.js').Object;

exports.index = function(req, res) {
	Age.find().where('parent').exists(false).sort('meta.interval.start meta.interval.end').select('-date -__v -_id').exec(function(err, ages) {
		Age.populate(ages, {path: 'sub', select: '-date -__v -parent -sub', options: {sort: 'meta.interval.start meta.interval.end'}}, function(err, ages) {
			res.render('styles/index.jade', {ages: ages});
		});
	});
}

exports.get_objects = function(req, res) {
	var post = req.body;
	Object.find().where('ages.sub').equals(post.ages_id).skip(post.skip).limit(5).exec(function(err, objects) {

		res.send(objects);
	});
}