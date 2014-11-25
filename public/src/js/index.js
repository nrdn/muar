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

});