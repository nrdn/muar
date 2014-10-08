exports.index = function(req, res) {
	res.redirect('/posts')
}

exports.main = function(req, res) {
	Object.aggregate()
	.group({
		'_id': {
			era: 'hostory.era',
			subAge: 'history.subAge'
		},
		'objects': {
			$push: {
				title: '$title',
				image: '$images.main',
				interval: '$ineterval'
			}
		}
	})
	.exec(function(err, eras) {
		res.render('main', {eras: eras})
	});
}


exports.locale = function(req, res) {
	res.cookie('locale', req.params.locale);
	res.redirect('back');
}