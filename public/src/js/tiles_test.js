$(document).ready(function() {
	var map = L.map('map').setView([0, 0], 1);

	L.tileLayer('/tiles/{z}/image_tile_{y}_{x}.jpg',{
	minZoom: 1,
	maxZoom: 4,
	attribution: '',
	tileSize: '100',
	tms: false,
	continuousWorld: true
	}).addTo(map);
});