var Architect = require('../../models/main.js').Architect;


// ------------------------
// *** Handlers Block ***
// ------------------------


var set_date = function(year) {
  return new Date(Date.UTC(year, 0, 1));
}


// ------------------------
// *** Admin Architects Block ***
// ------------------------


exports.list = function(req, res) {
  Architect.find().exec(function(err, architects) {
    res.render('auth/architects/', {architects: architects});
  });
}


// ------------------------
// *** Add Architects Block ***
// ------------------------


exports.add = function(req, res) {
  res.render('auth/architects/add.jade');
}

exports.add_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var architect = new Architect();

  architect.name =[{
  	lg: 'ru',
  	value: post.ru.name
  }];
  architect.description = [{
  	lg: 'ru',
  	value: post.ru.description
  }];
  architect.meta.interval.start = set_date(post.interval.start);
  architect.meta.interval.end = set_date(post.interval.end);

  architect.save(function(err, era) {
    res.redirect('/auth/architects');
  });
}


// ------------------------
// *** Edit Architects Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;

  Architect.findById(id).exec(function(err, architect) {
    res.render('auth/architects/edit.jade', {architect: architect});
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var id = req.params.id;

  Architect.findById(id).exec(function(err, architect) {

    architect.name =[{
      lg: 'ru',
      value: post.ru.name
    }];
    architect.description = [{
      lg: 'ru',
      value: post.ru.description
    }];
    architect.meta.interval.start = set_date(post.interval.start);
    architect.meta.interval.end = set_date(post.interval.end);

    architect.save(function(err, object) {
      res.redirect('/auth/architects');
    });
  });
}