var Architect = require('../models/main.js').Architect;


exports.index = function(req, res) {
	Architect.find().exec(function(err, architects) {
		res.render('architects', {architects: architects});
	});
}

exports.architect = function(req, res) {
	var id = req.params.id;
	Architect.findById(id).exec(function(err, architect) {
		res.render('architects/architect.jade', {architect: architect});
	});
}