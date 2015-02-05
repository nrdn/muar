var fs = require('fs');
var path = require('path');
var gm = require('gm').subClass({ imageMagick: true });
var async = require('async');
var appDir = path.dirname(require.main.filename);


var Architect = require('../../models/main.js').Architect;


// ------------------------
// *** Handlers Block ***
// ------------------------


var set_date = function(year) {
  return new Date(Date.UTC(year, 0, 1));
}


var checkNested = function (obj, layers) {

  if (typeof layers == 'string') {
    layers = layers.split('.');
  }

  for (var i = 0; i < layers.length; i++) {
    if (!obj || !obj.hasOwnProperty(layers[i])) {
      return false;
    }
    obj = obj[layers[i]];
  }
  return true;
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

  var locales = post.en ? ['ru', 'en'] : ['ru'];

  locales.forEach(function(locale) {
    checkNested(post, [locale, 'name'])
      && architect.setPropertyLocalised('name', post[locale].name, locale);

    checkNested(post, [locale, 'description'])
      && architect.setPropertyLocalised('description', post[locale].description, locale);
  });

  architect.meta.interval.start = set_date(post.interval.start);
  architect.meta.interval.end = set_date(post.interval.end);

  if (files.photo) {
    fs.mkdir(appDir + '/public/images/architects/' + architect._id, function() {
      var newPath = appDir + '/public/images/architects/' + architect._id + '/photo.jpg';
      gm(files.photo.path).resize(600, false).quality(80).write(newPath, function() {
        architect.photo = '/images/architects/' + architect._id + '/photo.jpg';
        fs.unlink(files.photo.path);
        architect.save(function(err, architect) {
          res.redirect('/auth/architects');
        });
      });
    });
  }
  else {
    architect.save(function(err, architect) {
      res.redirect('/auth/architects');
    });
  }
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
  var files = req.files;
  var id = req.params.id;

  Architect.findById(id).exec(function(err, architect) {

    var locales = post.en ? ['ru', 'en'] : ['ru'];

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'name'])
        && architect.setPropertyLocalised('name', post[locale].name, locale);

      checkNested(post, [locale, 'description'])
        && architect.setPropertyLocalised('description', post[locale].description, locale);
    });

    architect.meta.interval.start = set_date(post.interval.start);
    architect.meta.interval.end = set_date(post.interval.end);

    if (files.photo) {
      fs.mkdir(appDir + '/public/images/architects/' + architect._id, function() {
        var newPath = appDir + '/public/images/architects/' + architect._id + '/photo.jpg';
        gm(files.photo.path).resize(600, false).quality(80).write(newPath, function() {
          architect.photo = '/images/architects/' + architect._id + '/photo.jpg';
          fs.unlink(files.photo.path);
          architect.save(function(err, architect) {
            res.redirect('/auth/architects');
          });
        });
      });
    }
    else {
      architect.save(function(err, architect) {
        res.redirect('/auth/architects');
      });
    }
  });
}