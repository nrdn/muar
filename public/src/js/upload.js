$(document).ready(function() {
	$('.form_images_upload').sortable({placeholder: 'column_placeholder', cancel: '.image_upload_description'});

	$('.form_images_upload').filedrop({
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
			$(this).css('outline', '1px solid red');
		},
		uploadStarted: function(i, file, len) {

		},
		uploadFinished: function(i, file, response, time) {
			var image_upload_block = $('<div />', {'class': 'image_upload_block'});
			var image = $('<div />', {'class': 'image_upload_preview', 'style': 'background-image:url(' + response + ')'});
			var description = $('<textarea />', {'class': 'image_upload_description', 'name': 'images[description]', 'text':'Описание'});
			var form = $('<input />', {'class': 'image_upload_form', 'type': 'hidden', 'name': 'images[path]', 'value': response});
			$('.form_images_upload').append(image_upload_block.append(image, description, form));
		},
		progressUpdated: function(i, file, progress) {

		},
		afterAll: function() {
			$('.form_images_upload').css('outline', '1px solid red');
		}
	});

});