$(document).ready(function() {
	$('.image_second_block').click(function(event) {
		console.log($(this).index());
		//$('.project_image_main').css({'margin-top':'-100%'});
		$('.project_image_second').addClass('image_animate').css({'margin-top':'-100%','z-index':'0'}).eq($(this).index()).removeClass('image_animate').css({'margin-top':'0','z-index':'-1'});
	})
})