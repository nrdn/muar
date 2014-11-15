$(document).ready(function() {
	$('.form_images_second').sortable({placeholder: 'column_placeholder', cancel: '.image_second_description'});

	$('.form_image_main').filedrop({
		url: '/preview',
		paramname: 'image',
		fallback_id: 'image_main_fallback',
		allowedfiletypes: ['image/jpeg','image/png','image/gif'],
		allowedfileextensions: ['.jpg','.jpeg','.png','.gif'],
		maxfiles: 1,
		maxfilesize: 8,
		dragOver: function() {
			$(this).css('outline', '2px solid red');
		},
		dragLeave: function() {
			$(this).css('outline', 'none');
		},
		uploadStarted: function(i, file, len) {

		},
		uploadFinished: function(i, file, response, time) {
			$('.form_image_main').css('background-image','url(' + response + ')');
			$('.form_image_main').attr('path', response);
			console.log(response);
		},
		progressUpdated: function(i, file, progress) {

		},
		afterAll: function() {
			$('.form_image_main').css('outline', 'none');
		}
	});



	$('.form_images_second').filedrop({
		url: '/preview',
		paramname: 'image',
		// fallback_id: 'images_second_fallback',
		allowedfiletypes: ['image/jpeg','image/png','image/gif'],
		allowedfileextensions: ['.jpg','.jpeg','.png','.gif'],
		maxfiles: 5,
		maxfilesize: 8,
		dragOver: function() {
			$(this).css('outline', '2px solid red');
		},
		dragLeave: function() {
			$(this).css('outline', 'none');
		},
		uploadStarted: function(i, file, len) {

		},
		uploadFinished: function(i, file, response, time) {
			var image = $('<div />', {'class': 'image_second_preview', 'path': response, 'style': 'background-image:url(' + response + ')'});
			var description = $('<div />', {'class': 'image_second_description', 'contenteditable': true, 'text':'Описание'});
			$('.form_images_second').append(image.append(description));
			console.log(response);
		},
		progressUpdated: function(i, file, progress) {

		},
		afterAll: function() {
			$('.form_images_second').css('outline', 'none');
		}
	});

});