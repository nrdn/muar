var mongoose = require('mongoose'),
			Schema = mongoose.Schema;

var userSchema = new Schema({
	login: String,
	password: String,
	email: String,
	status: {type: String, default: 'User'},
	date: {type: Date, default: Date.now},
});

var postSchema = new Schema({
	title: {
		ru: String,
		en: String
	},
	description: {
		ru: String,
		en: String
	},
	category: String,
	photo: String,
	date: {type: Date, default: Date.now}
});

var eraSchema = new Schema({
	title: {
		ru: String,
		en: String
	},
	description: {
		ru: String,
		en: String
	},
	interval: {
		start: Date,
		end: Date
	},
	ages: [{
		title: {
			ru: String,
			en: String
		},
		interval: {
			start: Date,
			end: Date
		}
	}],
	date: {type: Date, default: Date.now}
});

var objectSchema = new Schema({
	title: {
		ru: String,
		en: String
	},
	description: {
		ru: String,
		en: String
	},
	history: {
		era: { type: Schema.Types.ObjectId, ref: 'Era' },
		ages: [Schema.Types.ObjectId],
	},
	meta: {
		adress: {
			ru: String,
			en: String
		},
		interval: {
			start: Date,
			end: Date
		}
	},
	architects: [{ type: Schema.Types.ObjectId, ref: 'Architect' }],
	categorys: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
	images: {
		main: String,
		second: [{
			title: String,
			path: String
		}]
	},
	subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
	date: {type: Date, default: Date.now}
});

var subjectSchema = new Schema({
	title: {
		ru: String,
		en: String
	},
	description: {
		ru: String,
		en: String
	},
	meta: {
		inventory: String,
		interval: {
			start: Date,
			end: Date
		}
	},
	images: [{
		title: String,
		path: String
	}],
	date: {type: Date, default: Date.now}
});

var architectSchema = new Schema({
	name: {
		ru: String,
		en: String
	},
	description: {
		ru: String,
		en: String
	},
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
	title: {
		ru: String,
		en: String
	},
	description: {
		ru: String,
		en: String
	},
	images: [String],
	date: {type: Date, default: Date.now}
});


// ------------------------
// *** Index Block ***
// ------------------------


// eraSchema.index({'title.ru': 'text', 'title.en': 'text'}, {default_language: 'ru'});


// ------------------------
// *** Exports Block ***
// ------------------------


module.exports.User = mongoose.model('User', userSchema);
module.exports.Post = mongoose.model('Post', postSchema);
module.exports.Era = mongoose.model('Era', eraSchema);
module.exports.Object = mongoose.model('Object', objectSchema);
module.exports.Subject = mongoose.model('Subject', subjectSchema);
module.exports.Architect = mongoose.model('Architect', architectSchema);
module.exports.Category = mongoose.model('Category', categorySchema);