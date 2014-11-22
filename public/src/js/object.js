$(document).ready(function() {
	var subjectsGroup;
	var map;
	var oldLayer;


	$('.object_navigate.description').on('click', function(event) {
		$('.object_navigate').removeClass('current');
		$(this).addClass('current');
		$('.object_description_block').show();
	});

	$('.object_navigate.images').on('click', function(event) {
		$('.object_navigate').removeClass('current');
		$(this).addClass('current');
		$('.images_slide').show();
	});

	$('.object_navigate.subjects').on('click', function(event) {
		$('.object_navigate').removeClass('current');
		$(this).addClass('current');
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
		$('.subjects_slide').hide();
		$('.object_navigate').removeClass('current');

		var path = $(this).attr('path');
		var currentLayer = subjectsGroup.getLayer(path);

		if (map == undefined) {
			map = L.map('subjects_view').setView([0, 0], 3).addLayer(currentLayer);
			oldLayer = currentLayer;
		}
		else {
			map.removeLayer(oldLayer).setView([0, 0], 3).addLayer(currentLayer);
			oldLayer = currentLayer;
		}

	});


	$('.images_navigate_block_next').on('click', function(event) {
		var index = $(this).parents('.object_image').index();
		var length = $('.object_image').length - 1;

		index != length
			?	$(this).parents('.object_image').hide().next().show()
			: $('.object_image').hide().eq(0).show();
	});


	$('.images_navigate_block_prev').on('click', function(event) {
		var index = $(this).parents('.object_image').index();

		index != 0
			?	$(this).parents('.object_image').hide().prev().show()
			: $('.object_image').hide().last().show();
	});


	$('.object_slide_item.images').on('click', function(event) {
		var index = $(this).index();
		$('.object_images_block').show();
		$('.object_subjects_block').hide();
		$('.images_slide').hide();
		$('.object_navigate').removeClass('current');
		$('.object_image').hide().eq(index).show();
	});

	$(document).on('mouseup touchstart', function (event) {
		var container = $('.object_description_block, .images_slide, .subjects_slide');

		if (!container.is(event.target)
			&& container.has(event.target).length === 0)
		{
				container.hide();
				$('.object_navigate').removeClass('current');
		}
	});
});