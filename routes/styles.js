var Age = require('../models/main.js').Age;
var Object = require('../models/main.js').Object;
var Project = require('../models/main.js').Project;

exports.index = function(req, res) {
	Age.find().where('parent').exists(false).sort('meta.interval.start meta.interval.end').select('-date -__v').exec(function(err, ages) {
		Age.populate(ages, {path: 'sub', select: '-date -__v -parent -sub', options: {sort: 'meta.interval.start meta.interval.end'}}, function(err, ages) {
			Project.find().exec(function(err, projects) {
				res.render('styles/index.jade', {ages: ages, projects: projects});
			});
		});
	});
}

exports.get_objects = function(req, res) {
	var post = req.body;
	Object.find().where('ages.main').equals(post.style_id).where('hidden').exists(false).sort('meta.interval.start meta.interval.end').exec(function(err, objects) {
		res.send(objects);
	});
}