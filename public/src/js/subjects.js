$(document).ready(function() {

	function sortSubjects() {
		$('.technique_sort').removeClass('current');
		window.location.hash = $(this).index();
	}

	function loadSubjects(technique_id) {
			$('.technique_sort').eq(technique_id).addClass('current');
			$('.subject_item').hide();
			$('.subject_item[data-technique='+ $('.technique_sort').eq(technique_id).attr('data-technique') +']').show();
	}

	function hashchange_func() {
		var technique_id = window.location.hash.replace('#','');
		loadSubjects(technique_id);
	}
	window.onhashchange = hashchange_func;
	var technique_id = window.location.hash.replace('#','');
	loadSubjects(technique_id);
	$('.technique_sort').on('click', sortSubjects);
});