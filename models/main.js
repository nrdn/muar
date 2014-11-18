var mongoose = require('mongoose'),
		mongooseLocale = require('mongoose-locale'),
			Schema = mongoose.Schema;

var userSchema = new Schema({
	login: String,
	password: String,
	email: String,
	status: {type: String, default: 'User'},
	date: {type: Date, default: Date.now},
});

var ageSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	meta: {
		interval: {
			start: Date,
			end: Date
		}
	},
	parent: { type: Schema.Types.ObjectId, ref: 'Age' },
	sub: [{ type: Schema.Types.ObjectId, ref: 'Age' }],
	date: {type: Date, default: Date.now}
});

var objectSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	ages: {
		main: { type: Schema.Types.ObjectId, ref: 'Age' },
		sub: [{ type: Schema.Types.ObjectId, ref: 'Age' }],
	},
	meta: {
		adress: { type: String, trim: true, locale: true },
		interval: {
			start: Date,
			end: Date
		}
	},
	architects: [{ type: Schema.Types.ObjectId, ref: 'Architect' }],
	categorys: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
	subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
	images: [{
		description: { type: String, trim: true, locale: true },
		original: String,
		thumb: String
	}],
	date: {type: Date, default: Date.now}
});

var subjectSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	meta: {
		inventory: String,
		interval: {
			start: Date,
			end: Date
		}
	},
	image: {
		original: String,
		thumb: String,
		tiles: String
	},
	date: {type: Date, default: Date.now}
});

var architectSchema = new Schema({
	name: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	meta: {
		interval: {
			start: Date,
			end: Date
		}
	},
	photo: String,
	date: {type: Date, default: Date.now}
});

var categorySchema = new Schema({
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	photo: String,
	date: {type: Date, default: Date.now}
});

var projectSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	photo: String,
	objects: [{ type: Schema.Types.ObjectId, ref: 'Object' }],
	date: {type: Date, default: Date.now}
});


// ------------------------
// *** Plugins Block ***
// ------------------------


architectSchema.plugin(mongooseLocale);
ageSchema.plugin(mongooseLocale);
objectSchema.plugin(mongooseLocale);
subjectSchema.plugin(mongooseLocale);
categorySchema.plugin(mongooseLocale);


// ------------------------
// *** Index Block ***
// ------------------------


architectSchema.index({'name.value': 'text', 'description.value': 'text'}, {language_override:'lg', default_language: 'ru'});
objectSchema.index({'title.value': 'text', 'description.value': 'text'}, {language_override:'lg', default_language: 'ru'});
subjectSchema.index({'title.value': 'text', 'description.value': 'text'}, {language_override:'lg', default_language: 'ru'});


// ------------------------
// *** Exports Block ***
// ------------------------


module.exports.User = mongoose.model('User', userSchema);
module.exports.Age = mongoose.model('Age', ageSchema);
module.exports.Object = mongoose.model('Object', objectSchema);
module.exports.Subject = mongoose.model('Subject', subjectSchema);
module.exports.Architect = mongoose.model('Architect', architectSchema);
module.exports.Category = mongoose.model('Category', categorySchema);