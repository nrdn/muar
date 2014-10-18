var st_cont_l = 0; // Количество стилей
var st_vis = 1; // Количество видимых стилей
var style_num = 0; //Номер стиля при загрузке
var styles_container_margin = 0; //Отступ контейнера стилей
var styles_container_width = 0; // Ширина контейнера стилей

$(document).ready(function() {
		var styles_block_width = $('.content_block_styles').width();	// Ширина контейнера стиля
		var styles_containers_length = $('.styles_container').length; // Количество контейнеров стилей

		function show_styles(style_num) {
			$('.styles_container').each(function(index){
				styles_container_width = $(this).width();
				if (style_num>index) {
					styles_container_margin = styles_container_margin + styles_container_width;
				}
				$(this).attr({'data-length': styles_container_width}).css({'min-width':styles_container_width});
				if (styles_container_width > styles_block_width) {
					$(this).addClass('inner_blocks');
				};
			});
			$('.content_block_styles').css({'margin-left':-styles_container_margin});
			//console.log(styles_container_margin);
			$('.content_title').text($('.styles_container').eq(style_num).attr('data_style_name'));
			$('.period_line').removeClass('active');
			$('.period').eq(style_num).find('.period_line').addClass('active');
		};
		show_styles(style_num);


	$('.styles_controls_front').on('click', function() {
		styles_container_margin = 0;
  	if (style_num < styles_containers_length - st_vis) {
  		style_num = ++style_num;
  		//console.log(style_num);
			show_styles(style_num);
		}
	});

	$('.styles_controls_back').on('click', function() {
		styles_container_margin = 0;
		if (style_num > 0) {
			style_num = --style_num;
			//console.log(style_num);
			show_styles(style_num);
		}
	});

	$('.period').on('click', function() {
		styles_container_margin = 0;
			show_styles($(this).index());
	});
});