$(document).ready(function() {
	// var scale = $(document).width()/1280;
	$('.parallax-layer')
			// .css({
			// 	'transform':'scale(' + scale + ')'
			// })
			.parallax({
				mouseport: $('.parallax_block'),
				freezeClass: 'freeze'
			});

	$('.period').each(function(index){
		$(this).on('click', function() {
			window.location.href="/styles/#" + index
		})
	})
})