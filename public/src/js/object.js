$(document).ready(function() {
	$('.description').on('click', function(event) {
		$('.object_description_block').show();
	});

	$(document).mouseup(function (event) {
		var container = $('.object_description_block');

		if (!container.is(event.target)
			&& container.has(event.target).length === 0)
		{
				container.hide();
		}
	});
});