$(document).ready(function() {
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
				$('.objects_context, .architects_context, .subjects_context').hide().children('.context_results').empty();

				data.objects.forEach(function(object) {
					var search_result = $('<a/>', {'class': 'search_result', 'href': '/objects/' + object._id, 'text': object.title[0].value});
					$('.objects_context').show().children('.context_results').empty().append(search_result);
				});

				data.architects.forEach(function(architect) {
					var search_result = $('<a/>', {'class': 'search_result', 'href': '/architects/' + architect._id, 'text': architect.name[0].value});
					$('.architects_context').show().children('.context_results').empty().append(search_result)
				});
			});
		}
	}

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


	$('.menu_item.search').click(function(event) {
		$('.content_title_block').hide();
		$('.content_search_block').show();
		$('.search_field').focus();
	});

	$(document).mouseup(function (event) {
		var container = $('.content_search_block');

		if (!container.is(event.target)
			&& container.has(event.target).length === 0)
		{
				container.hide();
				$('.content_title_block').show();
		}
	});
});