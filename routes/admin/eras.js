var Era = require('../../models/main.js').Era;


// ------------------------
// *** Admin Eras Block ***
// ------------------------


exports.list = function(req, res) {
  Era.find().where('sub').equals(false).exec(function(err, eras) {
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
  var era = new Era();

  era.title.ru = post.ru.title;
  era.description.ru = post.ru.description;
  era.interval.start = new Date(Date.UTC(post.interval.start, 1, 1));
  era.interval.end = new Date(Date.UTC(post.interval.end, 1, 1));

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

  Era.findById(id).exec(function(err, era) {

    era.title.ru = post.ru.title;
    era.description.ru = post.ru.description;
    era.interval.start = new Date(Date.UTC(post.interval.start, 1, 1));
    era.interval.end = new Date(Date.UTC(post.interval.end, 1, 1));

    era.save(function(err, era) {
      res.redirect('/auth/eras');
    });
  });
}


// ------------------------
// *** Admin Ages Block ***
// ------------------------


exports.list_ages = function(req, res) {
  var id = req.params.id;
  Era.findById(id).populate('ages').exec(function(err, era) {
    res.render('auth/ages', {era: era});
  });
}


// ------------------------
// *** Add Ages Block ***
// ------------------------


exports.add_ages = function(req, res) {
  res.render('auth/ages/add.jade');
}

exports.add_ages_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var age = new Era();
  var id = req.params.id;

  age.title.ru = post.ru.title;
  age.description.ru = post.ru.description;
  age.interval.start = new Date(Date.UTC(post.interval.start, 1, 1));
  age.interval.end = new Date(Date.UTC(post.interval.end, 1, 1));
  age.sub = true;

  age.save(function(err, age) {
    Era.findById(id).exec(function(err, era) {
      era.ages.push(age._id);
      era.save(function(err, era) {
        res.redirect('/auth/eras');
      });
    });
  });
}


// ------------------------
// *** Edit Ages Block ***
// ------------------------


exports.edit_ages = function(req, res) {
  res.render('auth/ages/edit.jade');
}

exports.edit_ages_form = function(req, res) {
  var post = req.body;
  var id = req.params.age_id;

  Era.findById(id).exec(function(err, age) {

    age.title.ru = post.ru.title;
    age.description.ru = post.ru.description;
    age.interval.start = new Date(Date.UTC(post.interval.start, 1, 1));
    age.interval.end = new Date(Date.UTC(post.interval.end, 1, 1));

    age.save(function(err, age) {
      res.redirect('/auth/eras');
    });
  });
}