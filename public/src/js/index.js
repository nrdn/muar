$(document).ready(function() {
	var scale = $(document).width()/1280;
	$('#port').css({
		'width':$(document).width()+'px',
		'height':$(document).height()+'px'
		});
	$('.parallax-layer, .freeze')
			.css({
				'transform-origin':'50%',
				'transform':'scale(' + scale + ')'
			})
			.parallax({
				mouseport: $('#port, .periods'),
				freezeClass: 'freeze'
			});
	$('.period').each(function(index){
		$(this).on('click', function() {
			window.location.href="/styles/#"+index
		})
	})
})