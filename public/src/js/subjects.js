$(document).ready(function() {
	function sortSubjects() {
		//$('.subject_item').hide();
		console.log($(this).attr('data-technique'));
		$('.subject_item').hide();
		$('.subject_item[data-technique='+ $(this).attr('data-technique') +']').show();
	}
	$('.technique_sort').on('click', sortSubjects);
});