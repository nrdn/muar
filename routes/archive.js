var path = require('path');
var async = require('async');
var vmalib = require('vmalib');
var appDir = path.dirname(require.main.filename);

var Subject = require('../models/main.js').Subject;
var Age = require('../models/main.js').Age;
var Object = require('../models/main.js').Object;
var Architect = require('../models/main.js').Architect;

var technique = {engraving: 'Гравюра', lithography: 'Литография', photo: 'Фотография', drawing: 'Чертеж', painting: 'Живопись', picture: 'Рисунок', sculpture: 'Скульптура', maket: 'Макет', other: 'Другое'}

var meta_base = function() {
	return {
		'head': {
			'StateContractContractor': 'ООО "Народный архитектор"',
			'StateContractDate': '2014-12-22T00:00:00+03:00',
			'StateContractNo': '6369-01-41/14-14'
		}
	}
}


exports.ages = function(req, res) {
	var cookie = req.session.cookie_string;
	var id = req.body.id;
	var meta = meta_base();

	Age.findById(id).exec(function(err, age) {

		meta.head['StoryType'] = {'topic': 'storytype-architecture_epoch'};
		meta.head['Architecture'] = {'topic': age.meta.archive.position};
		meta.head['Owner'] = 'mkrf';
		meta.head['RigthUse'] = 'Разрешено';

		meta.head['Title'] = age.i18n.title.get('ru');
		meta.head['Lead'] = age.i18n.description_alt.get('ru');
		meta.head['URI'] = 'http://vma.muar.ru/styles/#' + age._id;
		meta.head['DateStart'] = age.meta.interval.start.getUTCFullYear().toString();
		meta.head['DateEnd'] = age.meta.interval.end.getUTCFullYear().toString();

		meta.body = age.i18n.description.get('ru');

		vmalib.create_document(cookie, meta, function(err, id) {
			age.meta.archive.id = id;
			age.save(function(err, age) {
				res.send(id);
			});
		});
	});
}


exports.architects = function(req, res) {
	var cookie = req.session.cookie_string;
	var id = req.body.id;
	var meta = meta_base();

	Architect.findById(id).exec(function(err, architect) {
		meta.head['StoryType'] = {'topic': 'storytype-architecture_architect'};
		meta.head['Owner'] = 'mkrf';
		meta.head['RigthUse'] = 'Разрешено';

		meta.head['Title'] = architect.i18n.name.get('ru');
		meta.head['Architect'] = architect.i18n.name.get('ru');
		meta.head['URI'] = 'http://vma.muar.ru/architects/' + architect._id;
		meta.head['DatesOfLife'] = architect.meta.interval.start.getUTCFullYear() + ' - ' + architect.meta.interval.end.getUTCFullYear();

		meta.body = architect.i18n.description.get('ru');

		vmalib.create_document(cookie, meta, function(err, id) {
			vmalib.get_document(cookie, id, function(err, obj) {
				var position = obj['entry']['document'][0]['head'][0]['Architect'][0]['$']['topic'];

				architect.meta.archive.id = id;
				architect.meta.archive.position = position;
				architect.save(function(err, architect) {
					res.send(id);
				});
			});
		});
	});
}


exports.objects = function(req, res) {
	var cookie = req.session.cookie_string;
	var id = req.params.id;

	Object.findById(id).populate('architects categorys subjects ages.sub').exec(function(err, object) {


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

					if (subject.meta.technique) {
						meta.head['Technique'] = technique[subject.meta.technique.tag];
						meta.head['TechniqueNote'] = subject.meta.technique.i18n.comment.get('ru');
					}

					meta.body = subject.i18n.description.get('ru');

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

			if (object.categorys.length > 0) {
				meta.head['Keywords'] = [];
				for (var i = object.categorys.length - 1; i >= 0; i--) {
					var category = object.categorys[i].i18n.title.get('ru');
					meta.head['Keywords'].push(category);
				}
			}

			meta.head['Title'] = object.i18n.title.get('ru');
			meta.head['DateStart'] = object.meta.interval.start.getUTCFullYear().toString();
			meta.head['DateEnd'] = object.meta.interval.end.getUTCFullYear().toString();
			meta.head['URI'] = 'http://vma.muar.ru/objects/' + object._id;
			// meta.head['Adress'] = object.meta.i18n.adress.get('ru');

			meta.body = object.i18n.description.get('ru');

			vmalib.create_document(cookie, meta, function(err, story_id) {

				async.series({
					link_architects: function(call_link_architects) {
						async.each(object.architects, function(architect, callback) {
							if (architect.meta.archive.id) {
								var architect_position = architect.meta.archive.position;

								vmalib.get_document(cookie, story_id, function(err, obj) {
									var meta = {'head': {'Architect': { 'topic': architect_position } } };

									vmalib.set_meta(meta, obj, function(err, obj) {
										vmalib.update_document(cookie, story_id, obj, function(err, result) {
											callback();
										});
									});
								});
							}
						}, function() {
							call_link_architects(null, 'ok');
						});
					},
					link_ages: function(call_link_ages) {
						async.each(object.ages.sub, function(age, callback) {
							if (age.meta.archive.id) {
								var age_position = age.meta.archive.position;

								vmalib.get_document(cookie, story_id, function(err, obj) {
									var meta = {'head': {'Architecture': { 'topic': age_position } } };

									vmalib.set_meta(meta, obj, function(err, obj) {
										vmalib.update_document(cookie, story_id, obj, function(err, result) {
											callback();
										});
									});
								});
							}
						}, function() {
							call_link_ages(null, 'ok');
						});
					},
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
					var out = {
						vma_id: object._id,
						archive_id: story_id,
						status: final_results
					}

					object.meta.archive.id = story_id;
					object.save(function(err, object) {
						res.send(out);
					});
				});

			});


		});


	});
}