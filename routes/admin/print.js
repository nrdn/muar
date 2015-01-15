var fs = require('fs');
var path = require('path');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var mkdirp = require('mkdirp');
var del = require('del');

var appDir = path.dirname(require.main.filename);

var Object = require('../../models/main.js').Object;
var Age = require('../../models/main.js').Age;

exports.index = function(req, res) {
  Age.find().where('parent').exists(false).populate('sub').exec(function(err, ages) {
    res.render('auth/print', {ages: ages});
  });
}

exports.list = function(req, res) {
	var sub_id = req.params.sub_id;

	Object.find().where('ages.sub').equals(sub_id).populate('architects categorys subjects ages.main ages.sub').exec(function(err, objects) {
		res.render('auth/print/list.jade', {objects: objects});
	});
}