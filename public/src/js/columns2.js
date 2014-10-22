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
			console.log(style_num);
				$('.period').eq(style_num).addClass('active');
				var $this_st = $('.styles_container').eq(style_num);
				console.log($this_st.attr('data-scroll-top'))
				$('body').animate({scrollTop : $this_st.attr('data-scroll-top')}, 250)
		}

		show_styles(style_num);

		$('.period').on('click', function() {
			$('.period').removeClass('active')
			show_styles($(this).index());
		})
})