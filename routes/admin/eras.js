var Era = require('../../models/main.js').Era;


// ------------------------
// *** Admin Eras Block ***
// ------------------------


exports.list = function(req, res) {
  Era.find().exec(function(err, eras) {
    res.render('auth/eras/', {eras: eras});
  });
}


// ------------------------
// *** Add Eras Block ***
// ------------------------


exports.add = function(req, res) {
  res.render('auth/eras/add.jade');
}

exports.add_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();

  var era = new Era();

  era.title.ru = post.ru.title;
  era.description.ru = post.ru.description;
  era.date = new Date(Date.UTC(post.date.year, post.date.month, post.date.date, hours, minutes));

  era.save(function(err, era) {
    res.redirect('/auth/eras');
  });
}


// ------------------------
// *** Edit Eras Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;

  Era.findById(id).exec(function(err, era) {
    res.render('auth/eras/edit.jade', {era: era});
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var id = req.params.id;
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();

  Era.findById(id).exec(function(err, era) {

    era.title.ru = post.ru.title;
    era.description.ru = post.ru.description;
    era.date = new Date(Date.UTC(post.date.year, post.date.month, post.date.date, hours, minutes));

    era.save(function(err, era) {
      res.redirect('/auth/eras');
    });
  });
}