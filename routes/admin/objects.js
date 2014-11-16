var fs = require('fs');
var path = require('path');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var mkdirp = require('mkdirp');
var appDir = path.dirname(require.main.filename);

var Object = require('../../models/main.js').Object;
var Age = require('../../models/main.js').Age;
var Architect = require('../../models/main.js').Architect;
var Category = require('../../models/main.js').Category;


// ------------------------
// *** Handlers Block ***
// ------------------------


var set_date = function(year) {
  return new Date(Date.UTC(year, 0, 1));
}


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
  Age.find().where('parent').exists(false).populate('sub').exec(function(err, ages) {
    Architect.find().exec(function(err, architects) {
      Category.find().exec(function(err, categorys) {
       res.render('auth/objects/add.jade', {ages: ages, architects: architects, categorys: categorys});
      });
    });
  });
}

exports.add_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var object = new Object();
  var images = [];

  object.title =[{
    lg: 'ru',
    value: post.ru.title
  }];
  object.description = [{
    lg: 'ru',
    value: post.ru.description
  }];

  object.ages.main = post.history.main;
  object.ages.sub = post.history.sub;

  object.architects = post.architects;
  object.categorys = post.categorys;

  object.meta.interval.start = set_date(post.interval.start);
  object.meta.interval.end = set_date(post.interval.end);
  object.meta.adress = [{
    lg: 'ru',
    value: post.ru.adress
  }];

  var public_path = appDir + '/public';

  var images_path = {
    original: '/images/objects/' + object._id + '/original/',
    thumb: '/images/objects/' + object._id + '/thumb/',
  }

  mkdirp.sync(public_path + images_path.original);
  mkdirp.sync(public_path + images_path.thumb);

  post.images.path.forEach(function(item, i) {
    images.push({
      path: post.images.path[i],
      description: post.images.description[i]
    });
  });

  async.forEach(images, function(image, callback) {
    var name = new Date();
    name = name.getTime();
    var original_path = images_path.original + name + '.jpg';
    var thumb_path = images_path.thumb + name + '.jpg';

    gm(public_path + image.path).resize(300, false).write(public_path + thumb_path, function() {
      gm(public_path + image.path).write(public_path + original_path, function() {
        object.images.push({
          original: original_path,
          thumb: thumb_path,
          description: image.description
        });
        callback();
      });
    });
  }, function() {
    object.save(function() {
      res.redirect('back');
    })
  });
}


// ------------------------
// *** Edit Objects Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;

  Age.find().where('parent').exists(false).populate('sub').exec(function(err, ages) {
    Object.findById(id).exec(function(err, object) {
      res.render('auth/objects/edit.jade', {object: object, ages: ages});
    });
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var id = req.params.id;

  Object.findById(id).exec(function(err, object) {

    object.i18n.title.set(post.ru.title, 'ru');
    object.i18n.description.set(post.ru.description, 'ru');

    object.ages.main = post.history.main;
    object.ages.sub = post.history.sub;

    object.meta.interval.start = set_date(post.interval.start);
    object.meta.interval.end = set_date(post.interval.end);
    object.meta.i18n.adress.set(post.ru.adress, 'ru');

    object.save(function(err, object) {
      res.redirect('/auth');
    });
  });
}