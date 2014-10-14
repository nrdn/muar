var Object = require('../../models/main.js').Object;
var Era = require('../../models/main.js').Era;


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
  Era.find().exec(function(err, eras) {
    res.render('auth/objects/add.jade', {eras: eras});
  });
}

exports.add_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var object = new Object();

  object.title.ru = post.ru.title;
  object.description.ru = post.ru.description;

  object.history.era = post.era;
  object.history.ages = post.ages;

  object.meta.interval.start = new Date(Date.UTC(post.interval.start, 1, 1));
  object.meta.interval.end = new Date(Date.UTC(post.interval.end, 1, 1));
  object.meta.adress.ru = post.ru.adress;

  object.save(function(err, object) {
    res.redirect('/auth/objects');
  });
}


// ------------------------
// *** Edit Objects Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;

  Era.find().exec(function(err, eras) {
    Object.findById(id).exec(function(err, object) {
      res.render('auth/objects/edit.jade', {object: object, eras: eras});
    });
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var id = req.params.id;

  Object.findById(id).exec(function(err, object) {

    object.title.ru = post.ru.title;
    object.description.ru = post.ru.description;

    object.history.era = post.era;
    object.history.ages = post.ages;

    object.meta.interval.start = new Date(Date.UTC(post.interval.start, 1, 1));
    object.meta.interval.end = new Date(Date.UTC(post.interval.end, 1, 1));
    object.meta.adress.ru = post.ru.adress;

    object.save(function(err, object) {
      res.redirect('/auth/eras');
    });
  });
}