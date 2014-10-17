var col_n = 0; // Количество колонок
var m_left = 0; // Отступ блока с колонками слева
var col_vis = 4; // Количество видимых колонок
$(document).ready(function() {
    var per_l = $('.styles_container .periods_col').length-col_vis;
    var m_left_r = $('.styles_container').width()+3;
    console.log(per_l+' '+m_left_r);


    $('.styles_controls_front').click(function(event) {
    	console.log('212'+' '+col_n+' '+per_l);
    	if (col_n >= 0 && col_n < per_l) {
    		m_left = m_left - m_left_r;
    		console.log (m_left);
    		$('.content_block_styles').css({'margin-left': m_left});
    		col_n = col_n+1;
			}
		});

    $('.styles_controls_back').click(function(event) {
    	console.log('312'+' '+col_n+' '+per_l);
    	if (col_n > 0 && col_n <= per_l) {
	    	m_left = m_left + m_left_r;
	    	console.log (m_left);
	    	$('.content_block_styles').css({'margin-left': m_left});
	    	col_n = col_n-1;
    	}
    });
});