var fs = require('fs');
var path = require('path');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var appDir = path.dirname(require.main.filename);

var Object = require('../../models/main.js').Object;
var Age = require('../../models/main.js').Age;


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
    res.render('auth/objects/add.jade', {ages: ages});
  });
}

exports.add_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var object = new Object();

  object.title =[{
    lg: 'ru',
    value: post.ru.title
  }];
  object.description = [{
    lg: 'ru',
    value: post.ru.description
  }];

  object.ages.main = post.history.era;
  object.ages.sub = post.history.ages;

  object.meta.interval.start = set_date(post.meta.interval.start);
  object.meta.interval.end = set_date(post.meta.interval.end);
  object.meta.adress = [{
    lg: 'ru',
    value: post.meta.adress.ru
  }];

  var public_path = appDir + '/public';

  var path = {
    main: '/images/objects/' + object._id + '/main/',
    second: '/images/objects/' + object._id + '/second/',
  }

  fs.mkdir(public_path + '/images/objects/' + object._id);

  var single = function(type, callback) {
    fs.mkdir(public_path + path[type], function() {
      fs.rename(public_path + post.images[type], public_path + path[type] + post.images[type].split('/')[3]);
      object.images[type] = path[type] + post.images[type].split('/')[3];
      callback(null, type);
    });
  }

  var multi = function(type, callback) {
    fs.mkdir(public_path + path[type], function() {
      async.forEach(post.images[type], function(image, loop_callback) {
        fs.rename(public_path + image.path, public_path + path[type] + image.path.split('/')[3]);
        object.images[type].push({
          path: path[type] + image.path.split('/')[3],
          description: image.description
        });
        loop_callback();
      }, function() {
        callback(null, type);
      });
    });
  }

  async.parallel([
    async.apply(single, 'main'),
    async.apply(multi, 'second')
  ], function(err, results) {
    object.save(function(err, object) {
      res.send(object);
    });
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