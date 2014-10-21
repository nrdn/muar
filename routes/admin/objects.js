var fs = require('fs');
var path = require('path');
var async = require('async');
var appDir = path.dirname(require.main.filename);

var Object = require('../../models/main.js').Object;
var Era = require('../../models/main.js').Era;


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
  Era.find().where('sub').equals(false).populate('ages').exec(function(err, eras) {
    res.render('auth/objects/add.jade', {eras: eras});
  });
}

exports.add_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var object = new Object();
  console.log(post)

  object.title.ru = post.ru.title;
  object.description.ru = post.ru.description;

  object.history.era = post.history.era;
  object.history.ages = post.history.ages;

  object.meta.interval.start = new Date(Date.UTC(post.meta.interval.start, 1, 1));
  object.meta.interval.end = new Date(Date.UTC(post.meta.interval.end, 1, 1));
  object.meta.adress.ru = post.meta.adress.ru;

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

  Era.find().where('sub').equals(false).populate('ages').exec(function(err, eras) {
    Object.findById(id).exec(function(err, object) {
      res.render('auth/objects/edit.jade', {object: object, eras: eras});
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