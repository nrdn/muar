var Architect = require('../models/main.js').Architect;

var get_field = function (arr, lang) {
	return arr.filter(function(node) {
		return node.lg == lang
	})[0];
}


exports.index = function(req, res) {
	Architect.find().exec(function(err, architects) {
		res.render('architects', {architects: architects, get_field: get_field});
	});
}

exports.architect = function(req, res) {
	var id = req.params.id;
	Architect.findById(id).exec(function(err, architect) {
		res.render('architects/architect.jade', {architect: architect, get_field: get_field});
	});
}