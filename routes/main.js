var Age = require('../models/main.js').Age;
var Project = require('../models/main.js').Project;

exports.index = function(req, res) {
	Age.find().where('parent').exists(false).sort('meta.interval.start meta.interval.end').exec(function(err, ages) {
		Project.find().exec(function(err, projects) {
			res.render('main', {ages: ages, projects: projects});
		})
	});
}

