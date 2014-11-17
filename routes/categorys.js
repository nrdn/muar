var Category = require('../models/main.js').Category;


exports.index = function(req, res) {
	Category.find().exec(function(err, categorys) {
		res.render('categorys', {categorys: categorys});
	});
}

exports.category = function(req, res) {
	var id = req.params.id;
	Category.findById(id).exec(function(err, category) {
		res.render('categorys/category.jade', {category: category});
	});
}