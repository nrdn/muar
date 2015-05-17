$(document).ready(function() {
	var technique_id = 0;
	function sortSubjects() {
		window.location.hash = $(this).index();
	}
	function loadSubjects(technique_id) {
		$('.technique_sort').removeClass('current');
		$('.subject_item').hide();
			console.log('tech' + technique_id);
			if (technique_id == '' || technique_id == 0) {
				$('.subject_item').show();
				$('.technique_skip').addClass('current');
			}
			else {technique_id_nth = parseInt(technique_id)+1
				$('.technique_sort:nth-child(' + technique_id_nth + ')').addClass('current');
				$('.subject_item[data-technique='+ $('.technique_sort').eq(technique_id).attr('data-technique') +']').show();
			}
	}
	function hashchange_func() {
		var technique_id = window.location.hash.replace('#','');
		loadSubjects(technique_id);
	}
	window.onhashchange = hashchange_func;
	if (technique_id != 0) {
		var technique_id = window.location.hash.replace('#','');
	}
	loadSubjects(technique_id);
	$('.technique_sort').on('click', sortSubjects);
});