$(document).ready(function($) {
	$.fn.mapNavigate = function(options) {
		var defaults = {
			context: this,
			offsetX: 1,
			offsetY: 2.5
		};

		var opts = $.extend({}, defaults, options);

		$(this).on({
			mousemove: function(event) {
				var $context = $(opts.context);

				if (opts.offsetX) {
					$context.scrollLeft(event.pageX * opts.offsetX);
				}
				if (opts.offsetY) {
					$context.scrollTop(event.pageY * opts.offsetY);
				}
			}
		});

		return this;
	}
});