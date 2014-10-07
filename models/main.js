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
	subAges: [{
		title: String,
		tag: String
	}],
	objects: [{
		subAge: String,
		object: { type: Schema.Types.ObjectId, ref: 'Object' }
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
	meta: {
		adress: String,
		interval: {
			start: Date,
			end: Date
		}
	},
	architects: [{ type: Schema.Types.ObjectId, ref: 'Architect' }],
	category: String,
	images: [String],
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
	images: [String],
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
	photos: [String],
	date: {type: Date, default: Date.now}
});


// ------------------------
// *** Exports Block ***
// ------------------------


module.exports.User = mongoose.model('User', userSchema);
module.exports.Post = mongoose.model('Post', postSchema);
module.exports.Era = mongoose.model('Era', eraSchema);
module.exports.Object = mongoose.model('Object', objectSchema);
module.exports.Subject = mongoose.model('Subject', subjectSchema);
module.exports.Architect = mongoose.model('Architect', architectSchema);