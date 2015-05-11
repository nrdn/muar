$(document).ready(function() {

	function sortSubjects() {
		window.location.hash = $(this).index();
	}

	function loadSubjects(technique_id) {
			console.log(parseInt(technique_id)+1);
			technique_id_nth = parseInt(technique_id)+1;
			$('.technique_sort').removeClass('current');
			$('.technique_sort:nth-child(' + technique_id_nth + ')').addClass('current');
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