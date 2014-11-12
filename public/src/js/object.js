$(document).ready(function() {
	var subjectsGroup;
	var map;

	$('.description').on('click', function(event) {
		$('.object_description_block').show();
	});

	$('.images').on('click', function(event) {
		$('.images_slide').show();
	});

	$('.object_navigate.subjects').on('click', function(event) {
		$('.subjects_slide').show();

		subjectsGroup = L.layerGroup();

		$('.object_slide_item.subjects').each(function() {
			var path = $(this).attr('path');

			var layer = L.tileLayer('/images/subjects/' + path + '/tiles/{z}/image_tile_{y}_{x}.jpg', {
				minZoom: 1,
				maxZoom: 4,
				attribution: '',
				tileSize: '256',
				tms: false,
				continuousWorld: true
			});

			layer._leaflet_id = path;
			subjectsGroup.addLayer(layer);
		});
	});

	$('.object_slide_item.subjects').on('click', function(event) {
		$('.object_images_block').hide();
		$('.object_subjects_block').show();

		var path = $(this).attr('path');
		var currentLayer = subjectsGroup.getLayer(path);

		if (map == undefined) {
			map = L.map('subjects_view').setView([0, 0], 1);
			map.addLayer(currentLayer);
		}
		else {
			map.addLayer(currentLayer);
		}

	});

	$('.object_slide_item.images').on('click', function(event) {
		var index = $(this).index();
		$('.images_slide').hide();
		$('.object_images_block').show();
		$('.object_subjects_block').hide();
		$('.object_image').hide().eq(index).show();
	});

	$(document).mouseup(function (event) {
		var container = $('.object_description_block, .images_slide, .subjects_slide');

		if (!container.is(event.target)
			&& container.has(event.target).length === 0)
		{
				container.hide();
		}
	});
});