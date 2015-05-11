$(document).ready(function() {
	function sortSubjects() {
		$('.technique_sort').removeClass('current');
		$(this).addClass('current');
		$('.subject_item').hide();
		$('.subject_item[data-technique='+ $(this).attr('data-technique') +']').show();
	}
	$('.technique_sort').on('click', sortSubjects);
});