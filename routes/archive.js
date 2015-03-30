var path = require('path');
var async = require('async');
var vmalib = require('vmalib');
var appDir = path.dirname(require.main.filename);

var Subject = require('../models/main.js').Subject;
var Age = require('../models/main.js').Age;
var Object = require('../models/main.js').Object;

var meta_base = function() {
	return {
		'head': {
			'StateContractContractor': 'ООО "Народный архитектор"',
			'StateContractDate': '2014-12-22T00:00:00+04:00',
			'StateContractNo': '6368-01-41/14-14'
		}
	}
}

exports.upload = function(req, res) {
	var cookie = req.session.cookie_string;
	var meta = meta_base();

	Subject.findById('547b605dcad81c00000b4e23').exec(function(err, subject) {
		meta.head['Title'] = subject.i18n.title.get('ru');

		meta.body = subject.i18n.description.get('ru').replace(/<br \/>/g, '\n');

		vmalib.upload_file(cookie, appDir + '/public/' + subject.image.original, meta, function(err, id) {
			res.send(id);
		});
	});
}

exports.create = function(req, res) {
	var cookie = req.session.cookie_string;
	var meta = meta_base();

	Age.findById('54758b0ffa3ffc1bcbe1793e').exec(function(err, age) {

		meta.head['StoryType'] = {'topic': 'storytype-architecture_epoch'};
		meta.head['Architecture'] = {'topic': 'architecture_6jkbzv9ncjlh2ms3gag'};
		meta.head['Owner'] = 'mkrf';
		meta.head['RigthUse'] = 'Разрешено';

		meta.head['Title'] = age.i18n.title.get('ru');
		meta.head['Lead'] = age.i18n.description_alt.get('ru');
		meta.head['URI'] = 'http://vma.muar.ru/styles/#' + age._id;
		meta.head['DateStart'] = age.meta.interval.start.getUTCFullYear().toString();
		meta.head['DateEnd'] = age.meta.interval.end.getUTCFullYear().toString();

		meta.body = age.i18n.description.get('ru').replace(/<br \/>/g, '\n');

		vmalib.create_document(cookie, meta, function(err, id) {
			res.send(id);
		});
	});
}

exports.connect = function(req, res) {
	var cookie = req.session.cookie_string;
	var meta = meta_base();

	var doc_id = 'doc6jt8tcv49dk184qweut';
	var story_id = 'doc6jtrsj4990y1al4yi3iq';

	vmalib.document_to_story(cookie, doc_id, story_id, null, function(err, result) {
		res.send(result);
	});
}



exports.sync = function(req, res) {
	var cookie = req.session.cookie_string;
	var id = req.params.id;

	Object.findById(id).populate('architects subjects').exec(function(err, object) {


		async.series({
			images: function(call_images) {
				async.map(object.images, function(image, callback) {
					var meta = meta_base();
					var img_path = appDir + '/public' + image.original;

					vmalib.upload_file(cookie, img_path, meta, function(err, id) {
						callback(null, id);
					});
				}, function(err, results) {
					call_images(null, results);
				});
			},
			subjects: function(call_subjects) {
				async.map(object.subjects, function(subject, callback) {
					var meta = meta_base();
					var img_path = appDir + '/public' + subject.image.original;
					meta.head['Title'] = subject.i18n.title.get('ru');
					meta.head['NumberInventory'] = subject.meta.inventory;
					meta['body'] = subject.i18n.description.get('ru') || '';

					vmalib.upload_file(cookie, img_path, meta, function(err, id) {
						callback(null, id);
					});
				}, function(err, results) {
					call_subjects(null, results);
				});
			}
		}, function(err, results) {

			var meta = meta_base();

			meta.head['StoryType'] = {'topic': 'storytype-architecture_object'};
			meta.head['Owner'] = 'mkrf';
			meta.head['RigthUse'] = 'Разрешено';

			meta.head['Title'] = object.i18n.title.get('ru');
			meta.body = object.i18n.description.get('ru').replace(/<br \/>/g, '\n');

			vmalib.create_document(cookie, meta, function(err, story_id) {

				async.series({
					link_images: function(call_link_images) {
						async.each(results.images, function(doc_id, callback) {
							vmalib.document_to_story(cookie, doc_id, story_id, null, function(err, result) {
								callback();
							});
						}, function() {
							call_link_images(null, 'ok');
						});
					},
					link_subjects: function(call_link_subjects) {
						async.each(results.subjects, function(doc_id, callback) {
							vmalib.document_to_story(cookie, doc_id, story_id, null, function(err, result) {
								callback();
							});
						}, function() {
							call_link_subjects(null, 'ok');
						});
					}
				}, function(err, final_results) {
					res.send(final_results);
				});

			});


		});


	});
}