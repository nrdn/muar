$(document).ready(function() {
	$('.period').each(function(index){
		$(this).on('click', function() {
			window.location.href="/columns#"+index
		})
	})
})