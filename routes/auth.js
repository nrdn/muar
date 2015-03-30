var User = require('../models/main.js').User;
var vmalib = require('vmalib');


// ------------------------
// *** Auth Block ***
// ------------------------


exports.main = function(req, res) {
  res.render('auth');
}


// ------------------------
// *** Login Block ***
// ------------------------


exports.login = function(req, res) {
  res.render('login');
}

exports.login_form = function(req, res) {
  var post = req.body;

  User.findOne({ 'login': post.login }).exec(function (err, person) {
    if (!person) return res.redirect('back');
    person.verifyPassword(post.password, function(err, isMatch) {
      if (isMatch) {
        req.session.user_id = person._id;
        req.session.status = person.status;
        req.session.login = person.login;
        vmalib.auth({user: 'robot.architect', pass: '37DksT82'}, function(err, cookie) {
          req.session.cookie_string = cookie;
          res.redirect('/auth');
        });
      }
      else {
        res.redirect('back');
      }
    });
  });
}


// ------------------------
// *** Logout Block ***
// ------------------------


exports.logout = function(req, res) {
  req.session.destroy();
  res.clearCookie('session');
  res.redirect('/login');
}


// ------------------------
// *** Registr Block ***
// ------------------------


exports.registr = function(req, res) {
  if (!req.session.user_id)
    res.render('registr');
  else
    res.redirect('/');
}

exports.registr_form = function(req, res) {
  var post = req.body;

  var user = new User({
    login: post.login,
    password: post.password,
    email: post.email
  });

  user.save(function(err, user) {
    // if(err) {throw err;}
    if (err) return res.redirect('back');
    console.log('New User created');
    req.session.user_id = user._id;
    req.session.login = user.login;
    req.session.status = user.status;
    res.redirect('/login');
  });
}