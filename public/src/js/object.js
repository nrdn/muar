$(document).ready(function() {
	var subjectsGroup;
	var map;
	var oldLayer;

	$('.object_title').on('click', function(event) {
		window.history.go(-1);
	});

	$('.object_navigate.description').on('click', function(event) {
		$('.object_description_block').show();
	});

	$('.object_navigate.images').on('click', function(event) {
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
			map = L.map('subjects_view').setView([0, 0], 3).addLayer(currentLayer);
			oldLayer = currentLayer;
		}
		else {
			map.removeLayer(oldLayer).setView([0, 0], 3).addLayer(currentLayer);
			oldLayer = currentLayer;
		}

	});




	$('.object_images_block .next').on('click', function(event) {
			index++;
			$('.object_image').hide().eq(index).show();
	});

	$('.object_images_block .prev').on('click', function(event) {
			index--;
			$('.object_image').hide().eq(index).show();
	});

	$('.object_image .images_navigate_block_next').on('click', function(event) {
		var index = $(this).parents('.object_image').index();
		var length = $('.object_image').length - 1;

		index != length
			?	$(this).parents('.object_image').hide().next().show()
			: $('.object_image').hide().eq(0).show();
	});



	$('.object_image .images_navigate_block_prev').on('click', function(event) {
		var index = $(this).parents('.object_image').index();
		console.log(index);

		index != 0
			?	$(this).parents('.object_image').hide().prev().show()
			: $('.object_image').hide().last().show();
	});



	$('.object_slide_item.images').on('click', function(event) {
		var index = $(this).index();
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