$(document).ready(function() {
	$('.navigate_age').click(function(event) {
		var age_index = $(this).index();
		var style_index = $(this).closest('.navigate_style_block').index();
		var $style = $('.style_block').eq(style_index);
		var age_offset_top = $style.children('.age_block').eq(age_index).offset().top;
		var style_scroll_top = $style.scrollTop();
		var style_offset_top = $style.offset().top;

		$style.animate({
			'scrollTop': age_offset_top + style_scroll_top - style_offset_top
		}, 300);
	});

	$('.navigate_style_title').click(function(event) {
		var style_index = $(this).index('.navigate_style_title');
		var outer_offset_top = $('.styles_block').offset().top;

		$('.navigate_style_ages').hide().eq(style_index).show();

		$('.styles_block').animate({
			'scrollLeft': style_index * 1280
		}, 300);

		$('.style_block').eq(style_index).on('scroll', function() {

			$(this).children('.age_block').each(function() {
				var $this = $(this);
				var age_offset_top = $this.offset().top;

				age_offset_top <= outer_offset_top
					? $('.navigate_style_block').eq(style_index).find('.navigate_age').css('color', 'black').eq($(this).index()).css('color', 'red')
					: false;
			});
		});
	});
});