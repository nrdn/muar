$(document).ready(function() {

$('.side_description_cross').on('click', function(event) {
		$(this).data('clicked', !$(this).data('clicked'));
		if ($(this).data('clicked')) {
			$('.summary_description_block').hide();
		}
		else {
			$('.summary_description_block').show();
		};
});

	var map = L.map('subject_view').setView([0, 0], 3);

	var path = $('.subject_map').attr('path');

	L.tileLayer('/images/subjects/' + path + '/tiles/{z}/image_tile_{y}_{x}.jpg', {
		minZoom: 1,
		maxZoom: 4,
		attribution: '',
		tileSize: '256',
		tms: false,
		continuousWorld: true
	}).addTo(map);
});