var fs = require('fs');
var path = require('path');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var mkdirp = require('mkdirp');
var del = require('del');

var appDir = path.dirname(require.main.filename);

var Object = require('../../models/main.js').Object;

exports.index = function(req, res) {
	Object.find().populate('architects categorys subjects ages.main ages.sub').exec(function(err, objects) {
		res.render('auth/print.jade', {objects: objects});
	});
}