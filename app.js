var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });
var async = require('async');

var mongoose = require('mongoose');
		mongoose.connect('localhost', 'main');

var express = require('express'),
		bodyParser = require('body-parser'),
		multer = require('multer'),
		accepts = require('accepts'),
		cookieParser = require('cookie-parser'),
		session = require('express-session'),
		methodOverride = require('method-override'),
			app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.set('json spaces', 2);
app.locals.pretty = true;

app.use(express.static(__dirname + '/public'));
app.use(multer({ dest: __dirname + '/uploads'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());

app.use(session({
	key: 'muar.sess',
	resave: false,
	saveUninitialized: false,
	secret: 'keyboard cat',
	cookie: {
		path: '/',
		maxAge: 1000 * 60 * 60 // 1 hour
	}
}));


app.use(function(req, res, next) {
	res.locals.session = req.session;
	res.locals.locale = req.cookies.locale || 'ru';
	next();
});


// -------------------
// *** Routes Block ***
// -------------------


var main = require('./routes/main.js');
var auth = require('./routes/auth.js');
var content = require('./routes/content.js');
var files = require('./routes/files.js');

var a_eras = require('./routes/admin/eras.js');
var a_objects = require('./routes/admin/objects.js');
var test = require('./routes/admin/test.js');


// ------------------------
// *** Midleware Block ***
// ------------------------


function checkAuth (req, res, next) {
	req.session.user_id ? next() : res.redirect('/login');
}


// ------------------------
// *** Handlers Block ***
// ------------------------


var deleteFolderRecursive = function(path) {
	if ( fs.existsSync(path) ) {
		fs.readdirSync(path).forEach(function(file, index){
			var curPath = path + '/' + file;
			fs.statSync(curPath).isDirectory()
				? fs.statSync(curPath).isDirectory()
				: fs.unlinkSync(curPath);
		});
		fs.rmdirSync(path);
	}
}


function toMatrix(arr, row) {
	var a = [];
	for (var i = 0; i < row;) {
		a[i] ? a[i].push(arr.shift()) : (a[i] = []);
		i = ++i % row;
		if (!arr.length) return a;
	}
}


// ------------------------
// *** Main Routers Block ***
// ------------------------


// === Main Route
app.route('/').get(main.index);

// === Columns Route
app.route('/columns').get(main.columns);


// === Locale Route
app.route('/lang/:locale').get(main.locale);


// ------------------------
// *** Admin Routers Block ***
// ------------------------


// === Admin eras Route
app.route('/auth/eras').get(checkAuth, a_eras.list);


// === Admin @add eras Route
app.route('/auth/eras/add')
	 .get(checkAuth, a_eras.add)
	 .post(checkAuth, a_eras.add_form);


// === Admin @edit eras Route
app.route('/auth/eras/edit/:id')
	 .get(checkAuth, a_eras.edit)
	 .post(checkAuth, a_eras.edit_form);


// === Admin ages Route
app.route('/auth/eras/:id/ages')
	 .get(checkAuth, a_eras.list_ages);


// === Admin @add ages Route
app.route('/auth/eras/:id/ages/add')
	 .get(checkAuth, a_eras.add_ages)
	 .post(checkAuth, a_eras.add_ages_form);


// === Admin @edit ages Route
app.route('/auth/eras/:era_id/ages/edit/:age_id')
	 .get(checkAuth, a_eras.edit_ages)
	 .post(checkAuth, a_eras.edit_ages_form);


// === Admin objects Route
app.route('/auth/objects').get(checkAuth, a_objects.list);


// === Admin @add objects Route
app.route('/auth/objects/add')
	 .get(checkAuth, a_objects.add)
	 .post(checkAuth, a_objects.add_form);


// === Admin @edit objects Route
app.route('/auth/objects/edit/:id')
	 .get(checkAuth, a_objects.edit)
	 .post(checkAuth, a_objects.edit_form);


// ------------------------
// *** Auth Routers Block ***
// ------------------------


// === Auth Route
app.route('/auth').get(checkAuth, auth.main);


// === Login Route
app.route('/login')
	 .get(auth.login)
	 .post(auth.login_form);


// === Logout Route
app.route('/logout').get(auth.logout);


// === Registr Route
app.route('/registr')
	 .get(auth.registr)
	 .post(auth.registr_form);


// ------------------------
// *** Static Routers Block ***
// ------------------------


// === Contacts Route
app.route('/contacts').get(content.contacts);


// ------------------------
// *** Old Routers Block ***
// ------------------------


// === Files #sitemap.xml Route
app.route('/sitemap.xml').get(files.sitemap);


// === Files #robots.txt Route
app.route('/robots.txt').get(files.robots);


// ------------------------
// *** Test Routers Block ***
// ------------------------


app.route('/test')
	 .get(test.json)

app.route('/c_era')
	 .get(test.createEra)

app.route('/c_object')
	 .get(test.createObject)


// ------------------------
// *** Error Handling Block ***
// ------------------------


app.use(function(req, res, next) {
	var accept = accepts(req);
	res.status(404);

	// respond with html page
	if (accept.types('html')) {
		res.render('error', { url: req.url, status: 404 });
		return;
	}

	// respond with json
	if (accept.types('json')) {
			res.send({
			error: {
				status: 'Not found'
			}
		});
		return;
	}

	// default to plain-text
	res.type('txt').send('Not found');
});

app.use(function(err, req, res, next) {
	var status = err.status || 500;

	res.status(status);
	res.render('error', { error: err, status: status });
});


// ------------------------
// *** Connect server Block ***
// ------------------------


app.listen(3000);
console.log('http://127.0.0.1:3000')