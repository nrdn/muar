$(document).ready(function($) {
	$.fn.mapNavigate = function(options) {
		var defaults = {
			context: this,
			offsetX: 1,
			offsetY: 1,
		};

		var opts = $.extend({}, defaults, options);

		$(this).on({
			mousemove: function(event) {
				var $context = $(opts.context);

				if (offsetX)
					$context.scrollLeft(event.pageX * opts.offsetX);
				else if (offsetY)
					$context.scrollTop(event.pageY * opts.offsetY);
			}
		});

		return this;
	}
});