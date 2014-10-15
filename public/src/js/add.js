$(document).ready(function() {
	var count = $('.child').size();
	var eng = true;
	var event = false;
	var project = false;
	var news = false;


// ------------------------
// *** Toggles Block ***
// ------------------------


	function checkEnglish () {
		if (eng === true)
			$('.en').prop('disabled', true);
		else
			$('.en').prop('disabled', false).show();
	}

	function toggleEnglish () {
		if (eng = !eng) {
			eng = true;
			$('.en').prop('disabled', eng).hide();
			$('.ru').css('float','none');
		}
		else {
			eng = false;
			$('.en').prop('disabled', eng).show();
			$('.ru').css('float','left');
		}
	}


// ------------------------
// *** Constructors Block ***
// ------------------------


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


	$('.sub').hide().eq(0).show().children('input').attr('disabled', false);
	$('.glob').change(function() {
		var index = $(this).children('option:selected').index();
	  $('.sub').hide().eq(index).show();
	  $('.sub').children('input').attr('disabled', true);
	  $('.sub').eq(index).children('input').attr('disabled', false);
	});


	function snakeForward () {
		var snake = $('.snake');
		snake.first().clone().removeAttr('id')
			.find('input').val('').end()
			.insertAfter(snake.last());
	}

	function snakeBack () {
		if ($('.snake').size() == 1) return null;
		$(this).parent('.snake').remove();
	}


	$('.toggle_eng').on('click', toggleEnglish);
	$(document).on('click', '.back', snakeBack);
	$('.forward').on('click', snakeForward);


	$('form').submit(function(event) {
		var areas = $('textarea');
		areas.each(function() {
			var newValue = $(this).val().replace(/\n/g, "<br />");
			$(this).val(newValue);
		});
		$('form').submit();
	});



});