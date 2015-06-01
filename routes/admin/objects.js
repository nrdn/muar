var fs = require('fs');
var path = require('path');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var mkdirp = require('mkdirp');
var del = require('del');

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

var alphabetSort = function(field, arr) {
  arr.sort(function(a, b) {
    var a = a.i18n[field].get('ru');
    var b = b.i18n[field].get('ru');

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
  return arr;
}


// ------------------------
// *** Admin Objects Block ***
// ------------------------


exports.list = function(req, res) {
  Object.find().exec(function(err, objects) {
    Age.find().where('parent').exists(false).populate('sub').exec(function(err, ages) {
      res.render('auth/objects/', {objects: objects, ages: ages});
    });
  });
}


// ------------------------
// *** Add Objects Block ***
// ------------------------


exports.add = function(req, res) {
  Age.find().where('parent').exists(false).populate('sub').exec(function(err, ages) {
    Architect.find().exec(function(err, architects) {
      architects = alphabetSort('name', architects);
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

  var locales = post.en ? ['ru', 'en'] : ['ru'];

  locales.forEach(function(locale) {
    checkNested(post, [locale, 'title'])
      && object.setPropertyLocalised('title', post[locale].title, locale);

    checkNested(post, [locale, 'description'])
      && object.setPropertyLocalised('description', post[locale].description, locale);

    checkNested(post, [locale, 'adress'])
      && object.setPropertyLocalised('meta.adress', post[locale].adress, locale);
  });

  object.ages.main = post.history.main;
  object.ages.sub = post.history.sub;

  object.hidden = post.hidden;

  object.architects = post.architects != '' ? post.architects : []
  object.categorys = post.categorys != '' ? post.categorys : []

  object.meta.interval.start = set_date(post.interval.start);
  object.meta.interval.end = set_date(post.interval.end);


  if (!post.images) {
    return (function () {
      object.images = [];
      object.save(function() {
        res.redirect('back');
      });
    })();
  }


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

  async.forEachSeries(images, function(image, callback) {
    var name = new Date();
    name = name.getTime();
    var original_path = images_path.original + name + '.jpg';
    var thumb_path = images_path.thumb + name + '.jpg';

    gm(public_path + image.path).resize(300, false).write(public_path + thumb_path, function() {
      gm(public_path + image.path).write(public_path + original_path, function() {
        object.images.push({
          original: original_path,
          thumb: thumb_path,
          description: [{
            lg: 'ru',
            value: image.description
          }]
        });
        callback();
      });
    });
  }, function() {
    object.save(function() {
      res.redirect('back');
    });
  });
}


// ------------------------
// *** Edit Objects Block ***
// ------------------------


exports.edit = function(req, res) {
  var id = req.params.id;
  var public_path = appDir + '/public';
  var preview_path = '/images/preview/';
  var images_preview = [];

  Age.find().where('parent').exists(false).populate('sub').exec(function(err, ages) {
    Architect.find().exec(function(err, architects) {
      architects = alphabetSort('name', architects);
      Category.find().exec(function(err, categorys) {
        Object.findById(id).exec(function(err, object) {
          async.forEach(object.images, function(image, callback) {
            var image_path = appDir + '/public' + image.original;
            var image_name = image.original.split('/')[5];
            fs.createReadStream(image_path).pipe(fs.createWriteStream(public_path + preview_path + image_name));
            images_preview.push(preview_path + image_name);
            callback();
          }, function() {
            res.render('auth/objects/edit.jade', {object: object, images_preview: images_preview, ages: ages, architects: architects, categorys: categorys});
          });
        });
      });
    });
  });
}

exports.edit_form = function(req, res) {
  var post = req.body;
  var files = req.files;
  var id = req.params.id;
  var images = [];

  Object.findById(id).exec(function(err, object) {

    var locales = post.en ? ['ru', 'en'] : ['ru'];

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'title'])
        && object.setPropertyLocalised('title', post[locale].title, locale);

      checkNested(post, [locale, 'description'])
        && object.setPropertyLocalised('description', post[locale].description, locale);

      checkNested(post, [locale, 'adress'])
        && object.setPropertyLocalised('meta.adress', post[locale].adress, locale);
    });

    object.ages.main = post.history.main;
    object.ages.sub = post.history.sub;

    object.architects = post.architects != '' ? post.architects : []
    object.categorys = post.categorys != '' ? post.categorys : []

    object.hidden = post.hidden;

    object.meta.interval.start = set_date(post.interval.start);
    object.meta.interval.end = set_date(post.interval.end);


    var public_path = appDir + '/public';

    var images_path = {
      original: '/images/objects/' + object._id + '/original/',
      thumb: '/images/objects/' + object._id + '/thumb/',
    }

    del.sync([public_path + images_path.original, public_path + images_path.thumb]);

    if (!post.images) {
      return (function () {
        object.images = [];
        object.save(function() {
          res.redirect('back');
        });
      })();
    }

    mkdirp.sync(public_path + images_path.original);
    mkdirp.sync(public_path + images_path.thumb);

    object.images = [];

    post.images.path.forEach(function(item, i) {
      images.push({
        path: post.images.path[i],
        description: post.images.description[i]
      });
    });

    async.forEachSeries(images, function(image, callback) {
      var name = new Date();
      name = name.getTime();
      var original_path = images_path.original + name + '.jpg';
      var thumb_path = images_path.thumb + name + '.jpg';

      gm(public_path + image.path).resize(300, false).write(public_path + thumb_path, function() {
        gm(public_path + image.path).write(public_path + original_path, function() {
          object.images.push({
            original: original_path,
            thumb: thumb_path,
            description: [{
              lg: 'ru',
              value: image.description
            }]
          });
          callback();
        });
      });
    }, function() {
      object.save(function() {
        res.redirect('back');
      })
    });
  });
}