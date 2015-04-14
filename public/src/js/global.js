function getCookie(name) {
	var matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

function getProperty(field, locale) {
	var value = field.filter(function(v) {
		return v.lg === locale;
	})[0].value;

	return value;
}

$(document).ready(function() {
	var locale = getCookie('locale') || 'ru';

	var menu_navigation = function menu_navigation() {
	var scroll_top = $(document).scrollTop();
	if (scroll_top > 150) {
			$('.header_block').addClass('fixed_header');
			$('body').addClass('scrolled_page');
		} else {
			$('.header_block').removeClass('fixed_header');
			$('body').removeClass('scrolled_page');
		}
	}

	$(document).on('scroll', menu_navigation)


	var search = {
		val: '', buf: '',
		checkResult: function() {
			if (this.buf != this.val) {
				this.buf = this.val;
				this.getResult.call(search, this.val);
			}
		},
		getResult: function (result) {
			$.post('/search', {search: result}).done(function(data) {
				$('.objects_context, .architects_context, .subjects_context').hide().children('.context_results_block').empty();

				data.objects.forEach(function(object) {
					var context_result = $('<a/>', {'class': 'context_result', 'href': '/objects/' + object._id, 'text': getProperty(object.title, locale) });
					$('.objects_context').show().children('.context_results_block').append(context_result);
				});

				data.architects.forEach(function(architect) {
					var context_result = $('<a/>', {'class': 'context_result', 'href': '/architects/' + architect._id, 'text': getProperty(architect.name, locale) });
					$('.architects_context').show().children('.context_results_block').append(context_result);
				});

				data.subjects.forEach(function(subject) {
					var context_result = $('<a/>', {'class': 'context_result', 'href': '/subjects/' + subject._id, 'text': getProperty(subject.title, locale) });
					$('.subjects_context').show().children('.context_results_block').append(context_result);
				});
			});
		}
	};

	$('.search_field')
	.on('keyup change', function(event) {
		search.val = $(this).val();
	})
	.on('focusin', function(event) {
		search.interval = setInterval(function() {
			search.checkResult.call(search);
		}, 1000);
	})
	.on('focusout', function(event) {
		clearInterval(search.interval);
	});


	function toggleSearch() {
		$('.content_title_block').hide();
		$('.content_search_block').show();
		$('.search_field').focus();
	}

	function hideSearch() {
		$('.content_title_block').show();
		$('.content_search_block').hide();
	}

	$('.search_cross').on('click', hideSearch);

	$('.menu_item.search').on('click', toggleSearch);


	$('.search_title').click(function(event) {
		$('.objects_context, .architects_context, .subjects_context').hide().children('.context_results_block').empty();
		$('.search_field').val('').focus();
	});


});