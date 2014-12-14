var Project = require('../models/main.js').Project;


exports.index = function(req, res) {
	Project.find().exec(function(err, projects) {
		res.render('projects', {projects: projects});
	});
}

exports.project = function(req, res) {
	var id = req.hard_link || req.params.id;
	Project.findById(id).populate('objects').exec(function(err, project) {
		res.render('projects/project.jade', {project: project});
	});
}

exports.hard_links = function(req, res, next) {
	switch(req.params.id) {
		case 'chudov-i-voznesenskiy-monastyri-kremlya':
			req.hard_link = '5487420c7fb6fa000081e885';
			next();
		break;
		case 'proekt-bolshogo-kremlyovskogo-dvortsa':
			req.hard_link = '548496fb1fcde50000be2f14';
			next();
		break;
		default: next();
	}
}