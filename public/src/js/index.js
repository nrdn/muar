$(document).ready(function() {
	var loc_hash = window.location.hash;
	console.log(loc_hash);
	if (loc_hash == '#styles') {
		//alert('styles');
		scr = $('.intro_block').height() + $('.description_block.screen_block_height').height() - 28;
		$('body').animate({
     	scrollTop: scr,
    	}, 50 );
	}
	if (loc_hash == '#projects') {
		//alert('projects');
		scr = $('.intro_block').height() + $('.description_block.screen_block_height').height() + $('#styles').height() - 28;
		$('body').animate({
     	scrollTop: scr,
    	}, 50 );
 }

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
		scr = $('.intro_block').height() + $('.description_block.screen_block_height').height() - 28;
		$('body').animate({
     	scrollTop: scr,
    	}, 300 );
	});

	$('.menu_special').click(function(){
		scr = $('.intro_block').height() + $('.description_block.screen_block_height').height() + $('#styles').height() - 28;
		$('body').animate({
     	scrollTop: scr,
    	}, 300 );
	});


});