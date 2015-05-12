$(document).ready(function() {


	var styles_navigation = function styles_navigation() {

		var styles_scroll = $(document).scrollTop() - $('#styles').offset().top + 200;
		var per_scroll = $(document).scrollTop() - $('#projects').offset().top + 200;
		//console.log('st ' + styles_scroll);
		//console.log('per ' + per_scroll);
		if ($(document).scrollTop() > ($('body').height() / 1.3 - 100)) {
			$('.goto_down a').addClass('scrolled');
		} else {
				$('.goto_down a').removeClass('scrolled');
		}
		if (per_scroll < 0 && styles_scroll > 0) {
			$('.m_item').removeClass('current_menu');
			$('.m_item.menu_styles').addClass('current_menu');
			$('.footer_block').show();
		}
		else if (per_scroll > 0 && styles_scroll > 0) {
			$('.m_item').removeClass('current_menu');
			$('.m_item.menu_special').addClass('current_menu');
			$('.footer_block').show();
		}
		else {
	 		$('.m_item').removeClass('current_menu');
	 		$('.footer_block').hide();
		}
	}

	$(document).on('scroll', styles_navigation)


	$('.styles_line_nav.prev').click(function(){
		$('.styles_line').animate({
     	scrollLeft: '-=240',
    	}, 500 );
    });

	$('.styles_line_nav.next').click(function(){
		$('.styles_line').animate({
     	scrollLeft: '+=240',
    	}, 500 );
	});

	$('.special_line_nav.prev').click(function(){
		$('.object_images_block').animate({
     	scrollLeft: '-=630',
    	}, 500 );
    });

	$('.special_line_nav.next').click(function(){
		$('.object_images_block').animate({
     	scrollLeft: '+=630',
    	}, 500 );
	});


	$('.styles_btn').click(function(){
		scr = $('.intro_block').height() + $('.description_block.screen_block_height').height();
		$('body').scrollTop(scr);
	});

	$('.menu_special').click(function(){
		scr = $('.intro_block').height() + $('.description_block.screen_block_height').height() + $('#styles').height();
		$('body').scrollTop(scr);
	});

	$('.goto_down a').on('click', function(event) {
		if ($(this).attr('class') == 'scrolled') {
			scr = 0
		}
		else {
			scr = $('body').height() / 1.3;
		}
			$('body').animate({
				scrollTop: scr,
			}, 500 );
	});

	function hashchange_func() {
		loc_hash = window.location.hash;
		console.log(loc_hash);
			if (loc_hash == '#styles') {
				console.log('st');
				scr = $('.intro_block').height() + $('.description_block.screen_block_height').height();
				$('body').scrollTop(scr);
			}
			else if (loc_hash == '#projects') {
				console.log('pr');
				scr = $('.intro_block').height() + $('.description_block.screen_block_height').height() + $('#styles').height();
				$('body').scrollTop(scr);
	 		}
	 		else {
	 			$('.m_item').removeClass('current_menu');
	 			$('body').scrollTop(0);
	 		}
		}
	window.onload = hashchange_func;
	window.onhashchange = hashchange_func;
});