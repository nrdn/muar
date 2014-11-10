$(document).ready(function() {
	$('.description').on('click', function(event) {
		$('.object_description_block').show();
	});

	$('.images').on('click', function(event) {
		$('.images_slide').show();
	});

	$('.subjects').on('click', function(event) {
		$('.object_images_block').hide();
		$('.object_subjects_block').show();
		var map = L.map('subjects_view').setView([0, 0], 1);

		L.tileLayer('/tiles/{z}/image_tile_{y}_{x}.jpg',{
			minZoom: 1,
			maxZoom: 4,
			attribution: '',
			tileSize: '256',
			tms: false,
			continuousWorld: true
		}).addTo(map);
	});

	$('.object_slide_item.images').on('click', function(event) {
		var index = $(this).index();
		// $('.images_slide').hide();
		$('.object_images_block').show();
		$('.object_subjects_block').hide();
		$('.object_image').hide().eq(index).show();
	});

	$(document).mouseup(function (event) {
		var container = $('.object_description_block, .images_slide');

		if (!container.is(event.target)
			&& container.has(event.target).length === 0)
		{
				container.hide();
		}
	});
});