var Object = require('../../models/main.js').Object;


// ------------------------
// *** Admin Objects Block ***
// ------------------------


exports.list = function(req, res) {
  Object.find().exec(function(err, objects) {
    res.render('auth/objects/', {objects: objects});
  });
}


// ------------------------
// *** Add Objects Block ***
// ------------------------


exports.add = function(req, res) {
  res.render('auth/objects/add.jade');
}

exports.add_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();

  var object = new Object();

  object.title.ru = post.ru.title;
  object.description.ru = post.ru.description;
  object.date = new Date(Date.UTC(post.date.year, post.date.month, post.date.date, hours, minutes));

  object.save(function(err, object) {
    res.redirect('/auth/objects');
  });
}


// ------------------------
// *** Edit Objects Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;

  Object.findById(id).exec(function(err, object) {
    res.render('auth/objects/edit.jade', {object: object});
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var id = req.params.id;
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();

  Object.findById(id).exec(function(err, object) {

    object.title.ru = post.ru.title;
    object.description.ru = post.ru.description;
    object.date = new Date(Date.UTC(post.date.year, post.date.month, post.date.date, hours, minutes));

    object.save(function(err, object) {
      res.redirect('/auth/eras');
    });
  });
}