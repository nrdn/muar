$(document).ready(function() {

	function ageScroll (event) {
		var scroll_percentage = 100 * $(this).scrollTop() / ($(this).children('.style_block_inner').height() - $(this).height());

		$('.navigate_style_block').eq(event.data.style_index).children('.navigate_style_progress').css('width', scroll_percentage + '%');

		$(this).find('.age_block').each(function() {
			var $this = $(this);
			var age_offset_top = $this.offset().top;
			var outer_offset_top = $('.styles_block').offset().top;

			if (age_offset_top <= outer_offset_top)
				$('.navigate_style_block').eq(event.data.style_index).find('.navigate_age').css('color', 'black').eq($this.index()).css('color', 'red')
		});
	}

	function stylesSlide (event) {
		var style_index = window.location.hash.replace('#','');
		$('.navigate_style_ages').hide().eq(style_index).show();

		$('.styles_block').animate({
			'scrollLeft': +style_index * 1280
		}, 300);
		$('.style_block').off().eq(style_index).on('scroll', {style_index: +style_index}, ageScroll);
	}
	stylesSlide()

	$(window).on('hashchange', stylesSlide);

	$('.navigate_age').click(function(event) {
		var age_index = $(this).index();
		var style_index = $(this).closest('.navigate_style_block').index();
		var $style = $('.style_block').eq(style_index);
		var age_offset_top = $style.find('.age_block').eq(age_index).offset().top;
		var style_scroll_top = $style.scrollTop();
		var style_offset_top = $style.offset().top;

		$style.animate({
			'scrollTop': age_offset_top + style_scroll_top - style_offset_top
		}, 300);
	});

	$('.navigate_style_title').click(function(event) {
		var style_index = $(this).index('.navigate_style_title');

		$('.navigate_style_ages').hide().eq(style_index).show();

		window.location.hash = style_index;
	});

});