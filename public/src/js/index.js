$(document).ready(function() {
	var scale = $(document).width()/1280;
	$('.parallax-layer')
	.css({
		'transform-origin':'50%',
		'transform':'scale(' + scale + ')'
	})
	.parallax({
		mouseport: $('.parallax_block, .slides_arrows_block'),
		freezeClass: 'freeze'
	});

	$('.parallax_block').on({
		mouseover: function() {
			$('.intro_title').css('color', 'red');
		},
		mouseout: function() {
			$('.intro_title').removeAttr('style');
		},
		click: function() {
			document.location.href = '/styles';
		}
	});
});