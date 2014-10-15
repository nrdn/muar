$(document).ready(function() {
	$(document).on('keyup change', '.snake input', function() {
		$(this).parent('.snake').children('.save').attr('disabled', false);
	});

	$(document).on('click', '.save', function() {
		var $this = $(this);
		var $snake = $this.parent('.snake');

		if ($snake.attr('id')) {
			var age_id = $snake.attr('id');
			var age = {
				_id: age_id,
				ru: {
					title: $snake.children('.age_title').val()
				},
				interval: {
					start: $snake.children('.age_start').val(),
					end: $snake.children('.age_end').val()
				}
			};
			$.post('/auth/eras/ages/edit/', {age: age}).done(function(data) {
				$this.attr('disabled', true);
			});
		}
	});
});