$(document).ready(function() {
	$('.description').on('click', function(event) {
		$('.object_description_block').show();
	});

	$('.images').on('click', function(event) {
		$('.object_images_navigate').show();
	});

	$('.object_image_navigate').on('click', function(event) {
		var index = $(this).index();
		$('.object_image').hide().eq(index).show();
	});

	$(document).mouseup(function (event) {
		var container = $('.object_description_block, .object_images_navigate');

		if (!container.is(event.target)
			&& container.has(event.target).length === 0)
		{
				container.hide();
		}
	});
});