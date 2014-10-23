$(document).ready(function() {
	$('.image_second_block').click(function(event) {
		console.log($(this).index());
		$('.project_image_main').css({'margin-top':'-100%'});
		$('.project_image_second').hide().eq($(this).index()).show();
	})
})