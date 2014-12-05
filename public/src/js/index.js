$(document).ready(function() {
	$('.intro_block_background').css({'background-attachment':'scroll'})

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
		$('.intro_block_background').css({'background-attachment':'fixed'})
		scr = $('.intro_block').height();
		$('body').animate({
     	scrollTop: scr,
    	}, 500, function(){
    		$('.intro_block_background').css({'background-attachment':'scroll'})
    	} );
	});

})