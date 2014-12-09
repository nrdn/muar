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

	if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		$('.styles_line').swipe({
			swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
				switch (direction) {
					case 'left':
						$(this).animate({
							scrollLeft: '+=240'
						}, 300);
					break;
					case 'right':
						$(this).animate({
							scrollLeft: '-=240'
						}, 300);
					break;
				}
			},
			 threshold: 60
		});
	}

});