var styles_container_height = 0;
var style_num = 0;

$(document).ready(function() {
	$('.styles_container').each(function(index){
				styles_container_height = $(this).find('h2').offset().top-55;
				// + styles_container_height;
				$(this).attr('data-scroll-top', styles_container_height);
		})

	if(window.location.hash) {
			style_num = window.location.hash.replace(/#/g, '');
		}

	function show_styles(style_num) {
				$('.period').eq(style_num).addClass('active');
				var $this_st = $('.styles_container').eq(style_num);
				$('body').animate({scrollTop : $this_st.attr('data-scroll-top')}, 250)
		}

		show_styles(style_num);

		$('.period').on('click', function() {
			$('.period').removeClass('active');
			//$(this).width(400);
			show_styles($(this).index());
			var t_o = $(this).offset().left;
			var t_wi = $(this).width() ;
			var t_wi_p = t_wi/2;
			var per_m = 640 - t_wi_p - t_o;
			console.log(t_wi + ' opop: ' + t_wi_p + 'oop:' +per_m);
			//$('.periods').css({'margin-left':per_m});
			//console.log('Оффсет: ' + $(this).offset().left + ' Ширина: ' + $(this).width() + ' Отступ периодов: ' + (640 - ($(this).width()/2)));
		})
})