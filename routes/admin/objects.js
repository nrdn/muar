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
  var object = new Object();

  object.title.ru = post.ru.title;
  object.description.ru = post.ru.description;

  object.history.era = post.era;
  object.history.ages = post.ages;

  object.meta.interval.start = new Date(Date.UTC(post.date.year, post.date.month, post.date.date));
  object.meta.interval.end = new Date(Date.UTC(post.date.year, post.date.month, post.date.date));
  object.meta.adress = post.adress;

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

  Object.findById(id).exec(function(err, object) {

    object.title.ru = post.ru.title;
    object.description.ru = post.ru.description;

    object.history.era = post.era;
    object.history.ages = post.ages;

    object.architects = post.architects;
    object.categorys = post.categorys;
    object.subjects = post.subjects;

    object.meta.interval.start = new Date(Date.UTC(post.date.year, post.date.month, post.date.date));
    object.meta.interval.end = new Date(Date.UTC(post.date.year, post.date.month, post.date.date));
    object.meta.adress = post.adress;

    object.save(function(err, object) {
      res.redirect('/auth/eras');
    });
  });
}