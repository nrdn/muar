var Age = require('../../models/main.js').Age;


// ------------------------
// *** Handlers Block ***
// ------------------------


var set_date = function(year) {
  return new Date(Date.UTC(year, 0, 1));
}


// ------------------------
// *** Admin Ages Block ***
// ------------------------


exports.list = function(req, res) {
  Age.find().exec(function(err, ages) {
    res.render('auth/ages', {ages: ages});
  });
}


// ------------------------
// *** Add Ages Block ***
// ------------------------


exports.add = function(req, res) {
  res.render('auth/ages/add.jade');
}

exports.add_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var age = new Age();

  age.title = [{
    lg: 'ru',
    value: post.ru.title
  }];
  age.description.ru = [{
    lg: 'ru',
    value: post.ru.description
  }];
  age.interval.start = set_date(post.interval.start);
  age.interval.end = set_date(post.interval.end);

  age.save(function(err, age) {
    res.redirect('/auth/ages');
  });
}


// ------------------------
// *** Edit Ages Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;

  Age.findById(id).exec(function(err, age) {
    res.render('auth/ages/edit.jade', {age: age});
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var id = req.params.id;

  Age.findById(id).exec(function(err, age) {

    age.i18n.title.set(post.ru.title, 'ru');
    age.i18n.description.set(post.ru.description, 'ru');
    age.interval.start = set_date(post.interval.start);
    age.interval.end = set_date(post.interval.end);

    age.save(function(err, age) {
      res.redirect('/auth/ages');
    });
  });
}