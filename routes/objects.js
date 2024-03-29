var Object = require('../models/main.js').Object;
var Project = require('../models/main.js').Project;

function shuffle() {
  return .5 - Math.random();
};


exports.object = function(req, res) {
	var id = req.params.id;
	Object.findById(id).populate('subjects categorys architects ages.main').exec(function(err, object) {
		Project.find().where('objects').equals(object._id).exec(function(err, projects) {
			Object.find().where('ages.sub').in(object.ages.sub).where('hidden').exists(false).limit(10).exec(function(err, attach_objects) {
				res.render('objects/object.jade', {object: object, projects: projects, attach_objects:attach_objects.sort(shuffle)});
			});
		});
	});
}