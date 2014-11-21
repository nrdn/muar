$(document).ready(function() {
	$('.parallax-layer').parallax({
		mouseport: $('.parallax_block'),
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
			document.location.href = '/styles#0'
		}
	});
});