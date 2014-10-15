var Era = require('../../models/main.js').Era;
var Object = require('../../models/main.js').Object;

exports.json = function(req, res) {
	Object.aggregate()
	.sort('meta.interval.start meta.interval.end')
	.unwind('history.ages')
	.group({
		'_id': {
			era: '$history.era',
			age: '$history.ages'
		},
		'objects': {
			$push: {
				_id: '$_id',
				title: '$title',
				interval: '$meta.interval',
				image: '$images.main'
			}
		}
	})
	.group({
		'_id': {
			era: '$_id.era'
		},
		'ages': {
			$push: {
				age: '$_id.age',
				objects: '$objects'
			}
		}
	})
	.project({
		'_id': 0,
		'era': '$_id.era',
		'ages': '$ages'
	})
	.exec(function(err, eras) {
		Era.populate(eras, {path: 'era', select: '-_id -date -__v -description -ages -sub'}, function(err, eras) {
			Era.populate(eras, {path: 'ages.age', select: '-_id -date -__v -description -ages -sub'}, function(err, eras) {
				res.json(eras);
			});
		});
	});
}

exports.createEra = function(req, res) {
	var era = new Era();
	era.title.ru = 'Классицизм';
	era.description.ru = 'Супер стиль';
	era.interval.start = new Date(Date.UTC(2014, 3, 5));
	era.interval.end = new Date(Date.UTC(2014, 6, 12));
	era.ages = [
	{
		title: {
			ru: 'Ранний'
		},
		tag: 'before'
	},
	{
		title: {
			ru: 'Поздний'
		},
		tag: 'after'
	}];

	era.save(function(err, era) {
		res.send('ok');
	});
}

exports.createObject = function(req, res) {
	Era.find().exec(function(err, eras) {
		for (var i = 0; i < 10; i++) {
			var object = new Object();
			object.title.ru = 'Я объект ' + i;
			object.description.ru = 'Супер объект ' + i;
			object.history.era = eras[0]._id;
			object.history.ages = ['after'];
			object.meta.adress = 'Я адрес ' + i;
			object.meta.interval.start = new Date(Date.UTC(2014, 3, 5));
			object.meta.interval.end = new Date(Date.UTC(2014, 6, 12));
			object.save();
		};

		res.send('ok');
	});
}