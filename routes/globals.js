var async = require('async');

var Age = require('../models/main.js').Age;
var Object = require('../models/main.js').Object;
var Subject = require('../models/main.js').Subject;
var Architect = require('../models/main.js').Architect;

function searchNormalize(search) {
	var words = search.split(' ');
	var result = [];

	for (var i = words.length - 1; i >= 0; i--) {
		var lower =  words[i].toLowerCase();
		var upper = lower.replace(lower.charAt(0), lower.charAt(0).toUpperCase());
		result.push(lower);
		result.push(upper);
	};

	return result.join('||');
}

exports.locale = function(req, res) {
	res.cookie('locale', req.params.locale);
	res.redirect('back');
}

exports.search = function(req, res) {
	var search = searchNormalize(req.body.search);

	Architect.find({ $text: { $search: search } }, { score : { $meta: 'textScore' } }).sort({ score : { $meta : 'textScore' } }).select('name _id').exec(function(err, architects) {
		Object.find({ $text: { $search: search } }, { score : { $meta: 'textScore' } }).sort({ score : { $meta : 'textScore' } }).select('title _id').exec(function(err, objects) {
			Subject.find({ $text: { $search: search } }, { score : { $meta: 'textScore' } }).sort({ score : { $meta : 'textScore' } }).select('title _id').exec(function(err, subjects) {
				res.send({architects: architects, objects: objects, subjects: subjects});
			});
		});
	});
}