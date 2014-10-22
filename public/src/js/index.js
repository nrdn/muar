$(document).ready(function() {
	$('.parallax-layer').parallax({
				mouseport: $("#port")
			});
	$('.period').each(function(index){
		$(this).on('click', function() {
			window.location.href="/columns/alt#"+index
		})
	})
})