var gm = require('gm').subClass({ imageMagick: true });
var path = require('path');
var async = require('async');
var fs = require('fs');
var appDir = path.dirname(require.main.filename);

var Era = require('../../models/main.js').Era;
var Object = require('../../models/main.js').Object;
var Architect = require('../../models/main.js').Architect;


exports.search_page = function(req, res) {
	res.render('test/search')
}

exports.search = function(req, res) {
	var search = req.body.search;
	Architect.find({ $text: { $search: search } }, { score : { $meta: 'textScore' } }).exec(function(err, architects) {
		Object.find({ $text: { $search: search } }, { score : { $meta: 'textScore' } }).exec(function(err, objects) {
			res.render('test/search', {architects: architects, objects: objects});
		});
	});
}

exports.tiles= function(req, res) {
	res.render('test/tiles');
}