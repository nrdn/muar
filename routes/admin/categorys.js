var fs = require('fs');
var path = require('path');
var gm = require('gm').subClass({ imageMagick: true });
var async = require('async');
var appDir = path.dirname(require.main.filename);

var Category = require('../../models/main.js').Category;


// ------------------------
// *** Handlers Block ***
// ------------------------


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
// *** Admin Categorys Block ***
// ------------------------


exports.list = function(req, res) {
  Category.find().exec(function(err, categorys) {
    res.render('auth/categorys/', {categorys: categorys});
  });
}


// ------------------------
// *** Add Categorys Block ***
// ------------------------


exports.add = function(req, res) {
  res.render('auth/categorys/add.jade');
}

exports.add_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var category = new Category();

  var locales = post.en ? ['ru', 'en'] : ['ru'];

  locales.forEach(function(locale) {
    checkNested(post, [locale, 'title'])
      && category.setPropertyLocalised('title', post[locale].title, locale);

    checkNested(post, [locale, 'description'])
      && category.setPropertyLocalised('description', post[locale].description, locale);
  });

  if (files.photo) {
    fs.mkdir(appDir + '/public/images/categorys/' + category._id, function() {
      var newPath = appDir + '/public/images/categorys/' + category._id + '/photo.jpg';
      gm(files.photo.path).resize(600, false).quality(80).write(newPath, function() {
        category.photo = '/images/categorys/' + category._id + '/photo.jpg';
        fs.unlink(files.photo.path);
        category.save(function(err, era) {
          res.redirect('/auth/categorys');
        });
      });
    });
  }
  else {
    category.save(function(err, category) {
      res.redirect('/auth/categorys');
    });
  }
}


// ------------------------
// *** Edit Categorys Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;

  Category.findById(id).exec(function(err, category) {
    res.render('auth/categorys/edit.jade', {category: category});
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var id = req.params.id;

  Category.findById(id).exec(function(err, category) {

    var locales = post.en ? ['ru', 'en'] : ['ru'];

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'title'])
        && category.setPropertyLocalised('title', post[locale].title, locale);

      checkNested(post, [locale, 'description'])
        && category.setPropertyLocalised('description', post[locale].description, locale);
    });

    if (files.photo) {
      fs.mkdir(appDir + '/public/images/categorys/' + category._id, function() {
        var newPath = appDir + '/public/images/categorys/' + category._id + '/photo.jpg';
        gm(files.photo.path).resize(600, false).quality(80).write(newPath, function() {
          category.photo = '/images/categorys/' + category._id + '/photo.jpg';
          fs.unlink(files.photo.path);
          category.save(function(err, era) {
            res.redirect('/auth/categorys');
          });
        });
      });
    }
    else {
      category.save(function(err, category) {
        res.redirect('/auth/categorys');
      });
    }
  });
}