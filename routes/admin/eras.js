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
  var era = new Era();
  var ages = [];
  var post_ages = post.ages;

  era.title.ru = post.ru.title;
  era.description.ru = post.ru.description;
  era.interval.start = new Date(Date.UTC(post.interval.start, 1, 1));
  era.interval.end = new Date(Date.UTC(post.interval.end, 1, 1));

  post_ages.title.forEach(function(el, index) {
    var age = {
      title: {
        ru: post_ages.title[index]
      },
      interval: {
        start: new Date(Date.UTC(post_ages.interval.start[index], 1,1)),
        end: new Date(Date.UTC(post_ages.interval.end[index], 1,1))
      }
    }
    ages.push(age);
  });

  era.ages = ages;

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
    era.interval.start = new Date(Date.UTC(post.date.year, post.date.month, post.date.date));
    era.interval.end = new Date(Date.UTC(post.date.year, post.date.month, post.date.date));
    era.ages = post.ages;

    era.save(function(err, era) {
      res.redirect('/auth/eras');
    });
  });
}