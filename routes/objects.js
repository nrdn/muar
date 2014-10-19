var Object = require('../models/main.js').Object;

exports.object = function(req, res) {
	var id = req.params.id;
	Object.findById(id).exec(function(err, object) {
		res.render('objects/object.jade', {object: object});
	});
}