var Architect = require('../../models/main.js').Architect;


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

  architect.title.ru = post.ru.title;
  architect.description.ru = post.ru.description;
  architect.meta.interval.start = new Date(Date.UTC(post.interval.start, 1, 1));
  architect.meta.interval.end = new Date(Date.UTC(post.interval.end, 1, 1));

  architect.save(function(err, era) {
    res.redirect('/auth/eras');
  });
}