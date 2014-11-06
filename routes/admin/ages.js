var Age = require('../../models/main.js').Age;


// ------------------------
// *** Handlers Block ***
// ------------------------


var set_date = function(year) {
  return new Date(Date.UTC(year, 0, 1));
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

  age.title = [{
    lg: 'ru',
    value: post.ru.title
  }];
  age.description = [{
    lg: 'ru',
    value: post.ru.description
  }];

  age.meta.interval.start = set_date(post.interval.start);
  age.meta.interval.end = set_date(post.interval.end);

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
  var id = req.params.id;

  Age.findById(id).exec(function(err, age) {

    age.i18n.title.set(post.ru.title, 'ru');
    age.i18n.description.set(post.ru.description, 'ru');
    age.meta.interval.start = set_date(post.interval.start);
    age.meta.interval.end = set_date(post.interval.end);

    age.save(function(err, age) {
      res.redirect('/auth/ages');
    });
  });
}