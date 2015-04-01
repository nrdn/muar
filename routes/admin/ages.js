var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var gm = require('gm').subClass({ imageMagick: true });
var appDir = path.dirname(require.main.filename);

var Age = require('../../models/main.js').Age;


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
// *** Admin Ages Block ***
// ------------------------


exports.list = function(req, res) {
  Age.find().where('parent').exists(false).exec(function(err, ages) {
    res.render('auth/ages', {ages: ages});
  });
}

exports.list_sub = function(req, res) {
  var id = req.params.id;
  Age.findById(id).populate('sub').exec(function(err, age) {
    res.render('auth/ages/index_sub.jade', {age: age});
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

  if (req.params.age_id) {
    age.parent = req.params.age_id;
  }

  var locales = post.en ? ['ru', 'en'] : ['ru'];

  locales.forEach(function(locale) {
    checkNested(post, [locale, 'title'])
      && age.setPropertyLocalised('title', post[locale].title, locale);

    checkNested(post, [locale, 'description'])
      && age.setPropertyLocalised('description', post[locale].description, locale);

    checkNested(post, [locale, 'description_alt'])
      && age.setPropertyLocalised('description_alt', post[locale].description_alt, locale);
  });

  age.meta.interval.start = set_date(post.interval.start);
  age.meta.interval.end = set_date(post.interval.end);
  age.meta.archive.position = post.archive.position;

  if (!files.photo) {
    return (function () {
      age.save(function(err, age) {
        if (req.params.age_id) {
          Age.findById(req.params.age_id).exec(function(err, parent_age) {
            parent_age.sub.push(age._id);
            parent_age.save(function(err, parent_age) {
              res.redirect('/auth/ages/' + parent_age._id + '/sub');
            })
          });
        }
        else {
          res.redirect('/auth/ages');
        }
      });
    })();
  }

  fs.mkdir(appDir + '/public/images/ages/' + age._id, function() {
    var newPath = appDir + '/public/images/ages/' + age._id;
    gm(files.photo.path).resize(1600, false).quality(80).write(newPath + '/main.jpg', function() {
      gm(files.photo.path).resize(340, false).quality(80).write(newPath + '/thumb.jpg', function() {
        age.image.main = '/images/ages/' + age._id + '/main.jpg';
        age.image.thumb = '/images/ages/' + age._id + '/thumb.jpg';
        fs.unlink(files.photo.path);

        age.save(function(err, age) {
          if (req.params.age_id) {
            Age.findById(req.params.age_id).exec(function(err, parent_age) {
              parent_age.sub.push(age._id);
              parent_age.save(function(err, parent_age) {
                res.redirect('/auth/ages/' + parent_age._id + '/sub');
              })
            });
          }
          else res.redirect('/auth/ages');
        });
      });
    });
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
  var files = req.files;
  var id = req.params.id;

  Age.findById(id).exec(function(err, age) {

    var locales = post.en ? ['ru', 'en'] : ['ru'];

    locales.forEach(function(locale) {
      checkNested(post, [locale, 'title'])
        && age.setPropertyLocalised('title', post[locale].title, locale);

      checkNested(post, [locale, 'description'])
        && age.setPropertyLocalised('description', post[locale].description, locale);

      checkNested(post, [locale, 'description_alt'])
        && age.setPropertyLocalised('description_alt', post[locale].description_alt, locale);
    });


    age.meta.interval.start = set_date(post.interval.start);
    age.meta.interval.end = set_date(post.interval.end);
    age.meta.archive.position = post.archive.position;


    if (!files.photo) {
      return (function () {
        age.save(function(err, age) {
          res.redirect('/auth/ages');
        });
      })();
    }

    fs.mkdir(appDir + '/public/images/ages/' + age._id, function() {
      var newPath = appDir + '/public/images/ages/' + age._id;
      gm(files.photo.path).resize(1600, false).quality(80).write(newPath + '/main.jpg', function() {
        gm(files.photo.path).resize(340, false).quality(80).write(newPath + '/thumb.jpg', function() {
          age.image.main = '/images/ages/' + age._id + '/main.jpg';
          age.image.thumb = '/images/ages/' + age._id + '/thumb.jpg';
          fs.unlink(files.photo.path);

          age.save(function(err, age) {
            res.redirect('/auth/ages');
          });
        });
      });
    });

  });
}