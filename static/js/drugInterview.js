$('#drugInterview').click(function(e) {
	e.preventDefault();
//    alert('asd')
	$('#drugInterviewModal').modal({
		backdrop: 'static',
		keyboard: false
	});
});

$('.drugInterviewBtn').change(function(e) {
	e.preventDefault();
//	alert('asdasd')

	var btn = $(this);
	var name = btn.attr('name');
	var drug = btn.attr('drug');
	var csrf = $('#csrf').val();
	$.ajax({
		url: '/patient/save/drug/interview/',
		type: 'POST',
		data: {drug: drug, name: name, csrfmiddlewaretoken: csrf},
	})
		.done(function() {
			btn.removeAttr('disabled');
//			bootbox.alert('Interview erfolgreich abgeschlossen', function() {
//				$('#drugInterviewModal').modal('hide');
//				window.location.reload();
//			});
			$(btn).parents('.InterviewModal').find('.closeBtn').click(function() {
				window.location.reload();
			});
		})
		.fail(function() {
			btn.removeAttr('disabled');
			bootbox.alert(JS_LOCALE.getTrans('Ein Fehler ist aufgetreten, bitte wiederholen.'));
		})
});