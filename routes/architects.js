var Architect = require('../models/main.js').Architect;
var Object = require('../models/main.js').Object;


exports.index = function(req, res) {
	Architect.find().exec(function(err, architects) {
		res.render('architects', {architects: architects});
	});
}

exports.architect = function(req, res) {
	var id = req.params.id;
	Architect.findById(id).exec(function(err, architect) {
		Object.find().where('architects').equals(architect._id).exec(function(err, objects) {
			res.render('architects/architect.jade', {architect: architect, objects: objects});
		});
	});
}