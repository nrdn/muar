$(document).ready(function() {

	$('.prev').click(function(){
		$('.styles_line').animate({
     	scrollLeft: '-=240',
    	}, 500 );
    });

	$('.next').click(function(){
		$('.styles_line').animate({
     	scrollLeft: '+=240',
    	}, 500 );
	});

	$('.goto_down a').click(function(){
		scr = $('.intro_block').height();
		$('body').animate({
     	scrollTop: scr,
    	}, 500 );
	});

	$('.styles_btn').click(function(){
		scr = $('.intro_block').height() + $('.description_block.screen_block_height').height()+15;
		$('body').animate({
     	scrollTop: scr,
    	}, 500 );
	});

	$('.menu_special').click(function(){
		scr = $('.intro_block').height() + $('.description_block.screen_block_height').height() + $('#styles').height() +15;
		$('body').animate({
     	scrollTop: scr,
    	}, 500 );
	});


/*
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
*/

	if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		$('.styles_line').swipe({
			swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
				switch (direction) {
					case 'left':
						$(this).animate({
							scrollLeft: '-=120'
						}, 300);
					break;
					case 'right':
						$(this).animate({
							scrollLeft: '+=120'
						}, 300);
					break;
				}
			},
			 threshold: 10
		});
	}

});