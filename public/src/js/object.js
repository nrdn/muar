$(document).ready(function() {
	var scr;
	var subjectsGroup;
	var map;
	var oldLayer;
	var OS =  {
		Windows: navigator.platform.indexOf("Win") > -1,
		Mac: navigator.platform.indexOf("Mac") > -1,
		Linux: navigator.platform.indexOf("Linux") > -1
	}
	var cross = 0;

	function UnityLoader (path) {
		var config = {
			width: '100%',
			height: '100%',
			params: {
				enableDebugging: '0',
				disableContextMenu: true,
				logoimage: '/images/design/models/models_logo.png',
				progressbarimage: '/images/design/models/models_progress.png',
				progressframeimage: '/images/design/models/models_progress_frame.png'
			}
		};

		var u = new UnityObject2(config);

		var $missingScreen = $('#unityPlayer').find('.missing');
		var $brokenScreen = $('#unityPlayer').find('.broken');
		var $unsupportedScreen = $('#unityPlayer').find('.unsupported');

		$missingScreen.hide();
		$brokenScreen.hide();
		$unsupportedScreen.hide();

		u.observeProgress(function (progress) {
			switch(progress.pluginStatus) {
				case 'broken':
					$brokenScreen.find('a').click(function (e) {
						e.stopPropagation();
						e.preventDefault();
						u.installPlugin();
						return false;
					});
					$brokenScreen.show();
				break;
				case 'unsupported':
					$unsupportedScreen.show();
				break;
				case 'missing':
					$missingScreen.find('a').click(function (e) {
						e.stopPropagation();
						e.preventDefault();
						u.installPlugin();
						return false;
					});
					$missingScreen.show();
				break;
				case 'installed':
					$missingScreen.remove();
				break;
				case 'first':
				break;
			}
		});

		u.initPlugin($('#unityPlayer')[0], path);
	}

	foot = $('.footer_block');
	$('.main_attached_objects').append(foot);

	$('.object_navigate.models').on('click', function(event) {
		$('.object_navigate').removeClass('current');
		$(this).addClass('current');
		$('.models_slide').show();
		$('.column_item').hide();
	});


	$('.object_navigate.description').on('click', function(event) {
		$('.object_navigate').removeClass('current');
		$(this).addClass('current');
		$('.object_description_block').show();
		$('.column_item').hide();
	});

	$('.object_navigate.images').on('click', function(event) {
		$('.object_navigate').removeClass('current');
		$(this).addClass('current');
		$('.images_slide').show();
		$('.column_item').show();
	});

	$('.object_navigate.subjects').on('click', function(event) {
		$('.object_navigate').removeClass('current');
		$(this).addClass('current');
		$('.subjects_slide').show();
		$('.column_item').hide();

		subjectsGroup = L.layerGroup();

		$('.object_slide_item.subjects').each(function() {
			var path = $(this).attr('path');

			var layer = L.tileLayer('/images/subjects/' + path + '/tiles/{z}/image_tile_{y}_{x}.jpg', {
				fitToMarkers: true,
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

	$('.images_zoom, .side_description_cross').data('clicked', true)

	/*$('.images_zoom').on('click', function(event) {
		$(this).data('clicked', !$(this).data('clicked'));

		if ($(this).data('clicked')) {
			$('.images_zoom').html('');
			$('.object_image').css({'background-size':'cover'});
		}
		else {
			$('.images_zoom').html('');
			$('.object_image').css({'background-size':'contain'});
		}
	});*/

	$('.side_description_cross').on('click', function(event) {
		$(this).data('clicked', !$(this).data('clicked'));
		$(this).off('click.popup');
		$('.next_arrow').css({'right':'370px'});

		if ($(this).data('clicked')) {
			$(this).removeClass('prop');
			$('.summary_description_block, .images_descriptons_block, .goto_down').show();
			$('.next_arrow').css({'right':'370px'});
			//$('.side_description_column').css({'bottom':'0px'});
			if (cross == 1) {
				$('body').css({'height':'100%','overflow':'hidden'});
				$('.main_description_block').hide();
			}
			else {
				$('body').css({'height':'auto','overflow':'auto'});
				$('.main_description_block').show();
			}
		}
		else {
			$(this).addClass('prop');
			$('.summary_description_block, .images_descriptons_block, .goto_down').hide();
			$('.next_arrow').css({'right':'0px'})
			//$('.side_description_column').css({'bottom':'100%'});
			$('body').css({'height':'100%','overflow':'hidden'});
			$('.main_description_block').hide();
		}
	});



	$('.goto_down a').on('click', function(event) {
		console.log($(this).attr('class'));
		if ($(this).attr('class') == 'scrolled') {
			scr = 0
		}
		else {
			scr = $('.object_images_block').height() / 1.5;
		}
			$('body').animate({
				scrollTop: scr,
			}, 500 );
	});

	var goto_down_navigation = function goto_down_navigation() {
	var scroll_top = $(document).scrollTop();
	if (scroll_top > ($('.object_images_block').height() / 1.5 - 100)) {
			$('.goto_down a').addClass('scrolled');
		} else {
			$('.goto_down a').removeClass('scrolled');
		}
	}

	$(document).on('scroll', goto_down_navigation)

	$('.object_slide_item.subjects').on('click', function(event) {
		$('body').css({'height':'100%','overflow':'hidden'});
		$('.main_description_block').hide();
		$('.goto_down').hide();
		$('.object_images_block, .object_3d_block').hide();
		$('.object_subjects_block').show();
		$('.subjects_slide').hide();
		$('.object_navigate').removeClass('current');
		$('.description_item.images').hide();
		//$('.object_navigate.subjects').addClass('current');
		cross = 1;

		var index = $(this).index();
		$('.description_item.subjects').hide().eq(index).show();

		var path = $(this).attr('path');
		var currentLayer = subjectsGroup.getLayer(path);

		if (map === undefined) {
			map = L.map('subjects_view').setView([0, 0], 3).addLayer(currentLayer);
			oldLayer = currentLayer;
		}
		else {
			map.removeLayer(oldLayer).setView([0, 0], 3).addLayer(currentLayer);
			oldLayer = currentLayer;
		}

	});

	$('.object_slide_item.models').on('click', function(event) {
		$('body').css({'height':'100%','overflow':'hidden'});
		$('.main_description_block').hide();
		if (OS.Windows || OS.Mac) {
			$('.object_3d_block').addClass('popup');
			$('.side_description_cross').on('click.popup', function() {
				$('.popup').hide();
				$('.summary_description_block, .images_descriptons_block').show();
			});
		}
		else {
			$('.object_images_block, .object_subjects_block').hide();
		}

		$('.summary_description_block, .images_descriptons_block, .goto_down').hide();
		$('.object_slide_navigate').hide();
		$('.object_3d_block').show();
		$('.subjects_slide').hide();
		$('.object_navigate').removeClass('current');

		var path = $(this).attr('path');
		UnityLoader(path);

	});


	$('.images_navigate_block_next').on('click', function(event) {
		var index = $(this).parents('.object_image').index();
		var length = $('.object_image').length - 1;

		if (index != length) {
			$(this).parents('.object_image').hide().next().show()
			$('.description_item.images').eq(index).hide().next().show();
		}
		else {
			$('.object_image').hide().eq(0).show();
			$('.description_item.images').hide().eq(0).show();
		}

	});


	$('.images_navigate_block_prev').on('click', function(event) {
		var index = $(this).parents('.object_image').index();

		if (index !== 0) {
			$(this).parents('.object_image').hide().prev().show();
			$('.description_item.images').eq(index).hide().prev().show();
		}
		else {
			$('.object_image').hide().last().show();
			$('.description_item.images').hide().last().show();
		}

	});


	$('.object_slide_item.images').on('click', function(event) {
		var index = $(this).index();
		$('.object_images_block').show();
		$('.object_subjects_block, .object_3d_block').hide();
		$('.images_slide').hide();
		$('.object_navigate').removeClass('current');
		$('.object_image').hide().eq(index).show();
		$('.description_item.subjects').hide();
		$('.description_item.images').hide().eq(index).show();
		$('.goto_down').show();
		$('body').css({'height':'auto','overflow':'auto'});
		$('.main_description_block').show();
		cross = 0;
	});

	$(document).on('mouseup touchstart', function (event) {
		var container = $('.object_description_block, .images_slide, .subjects_slide, .models_slide');

		if (!container.is(event.target)
			&& container.has(event.target).length === 0)
		{
				container.hide();
				$('.object_navigate').removeClass('current');
		}
	});
});