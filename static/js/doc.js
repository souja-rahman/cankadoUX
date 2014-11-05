

$(document).ready(function() {
	$('#' + patient_userprofile_gender + '').attr('checked', true);
	//$('input[name="startDate"]').val(new Date().toJSON().slice(0,10));

	$('.editableDrugs').appendTo('.editableDrugsModel');
	$('#' + patient_userprofile_gender + '').attr('checked', true);
//$('input[name="startDate"]').val(new Date().toJSON().slice(0,10));
	$('.formData').mouseover(function() {

		$(this).find('.editbut').show();
	});
	$('.formData').mouseout(function() {

		$(this).find('.editbut').hide();
	});
	$('.formData').keypress(function() {
		$(this).find('.editbut').hide()
	});
});
//// Treatment selected
$('.treatmentRadio').change(function() {
	if ($(this).is(":checked")) {
		$('.medQtyTitl').hide();
		$('.editableDrugs').hide();
		$('.editableDrugs[tid="' + $(this).val() + '"]').show();
		if ($('.edit a bleDrugs[tid= " ' + $(this).val() + '"]').length)
		{
			$('.medQtyTitl').show();
		}
	}


	if (!$(this).is(":checked"))
	{
		return;
	}
	if ($(this).is('[assignedTreatment]'))
	{
//            $('#treatementOptions').hide();
		$('#treatementOptions').modal('hide');
	}
	else
	{
//            $('#treatementOptions').show();
		$('#treatementOptions').modal('show');
	}
	var p = $(this).parents('.treatmentItem')[0];
	var toDays = $(p).find('.endDay');
	var ldate = 0

// $(toDays).each(function(){
//ldate = (parseInt($(this).html(),10) > ldate)?parseInt($(this).html(),10):ldate ;

	//var d = new Date($('input[name="startDate"]').val())
	//d.setDate(d.getDate() + ldate);
	//$('#TreatmentCycleEndDate').val(d.toJSON().slice(5,7)+'/'+d.toJSON().slice(8,10)+'/'+d.toJSON().slice(0,4));
	// })


	$('input[name="startDate"]').change(function() {
		$('.treatmentRadio').trigger('change');
	})


});
/////   Assign Treatment
$('#btn-asignTreament').click(function() {
	if ($('.tinner .Tselected').length != 1) {
		bootbox.alert(JS_LOCALE.getTrans('Bitte wählen Sie eine Behandlung'));
		return;
	}
	$('.inpTID').val($($('.tinner .Tselected')[0]).attr('tid'));
	$('#frm-asignTreament').trigger('submit');
})
$('#frm-asignTreament').submit(function(event) {
	event.preventDefault();
	var btn = $('#btn-asignTreament')
	if ($('#startDate').val() === '') {
		bootbox.alert(JS_LOCALE.getTrans('Bitte wählen Sie Datum'));
		return false;
	}

	btn.attr('disabled', true);
	btn.html('Assigning....');
	$.post("/doctor/assignTreatment/", $(this).serialize())
		.done(function(data) {
			if (data == 'ok')
			{
				btn.html('Assigned');
				$('#btn-closeTreament').attr('disabled', true);
				$('#btn-resetTreament').attr('disabled', true);
				$('#successMsg').show();
				bootbox.alert(JS_LOCALE.getTrans('Behandlung erfolgreich zugewiesen'), function() {
					window.location.href = window.location.pathname;
				});

			}
			else
			{
				btn.removeAttr('disabled');
				btn.html('Start');
				data = jQuery.parseJSON(data)
				if (data.message)
				{
					bootbox.alert(data.message.join('\n'));
				}
				else
				{
					bootbox.alert(JS_LOCALE.getTrans('Fehler bei der Zuordnung Behandlung, versuchen Sie es erneut!'));
				}

				$(btn).removeClass('btn-info').addClass('btn-danger').delay(1000).queue(function() {
					$(this).removeClass('btn-dange r').addClass('btn-info');
					$(this).dequeue();
				});
			}

		})
		.fail(function() {
			btn.removeAttr('disabled');
			btn.html('Save');
			bootbox.alert(JS_LOCALE.getTrans("Fehler bei der Zuordnung Behandlung, versuchen Sie es erneut!"));
			$(btn).removeClass('btn-info').addClass('btn-danger').delay(1000).queue(function() {
				$(this).removeClass('btn-danger').addClass('btn-info');
				$(this).dequeue();
			});
		})
});
$('.tPauseBtn').click(function(event) {
	event.stopPropagation()
	var btn = $(this)
	btn.attr('disabled', 'disabled');
	var tid = btn.attr('treatment');
	$.post(url_doctor_pauseTreatment, {csrfmiddlewaretoken: csrf_token, pid: patient_id, tid: tid})
		.done(function() {
			bootbox.alert(JS_LOCALE.getTrans("Behandlung erfolgreich angehalten!"), function() {
				window.location.href = window.location.pathname;
			});
		})
})

$('.tResumeBtn').click(function(event) {
	event.stopPropagation()
	var btn = $(this)
	var tid = btn.attr('treatment');
	btn.attr('disabled', 'disabled');
	$.post(url_doctor_continueTreatment, {csrfmiddlewaretoken: csrf_token, pid: patient_id, tid: tid})
		.done(function() {
			bootbox.alert(JS_LOCALE.getTrans("Behandlung erfolgreich wieder aufgenommen!"), function() {
				window.location.href = window.location.pathname;
			});
		})
})

$('.tStopBtn').click(function(event) {
	event.stopPropagation()
	var btn = $(this);
	btn.attr('disabled', 'disabled');
	var tid = btn.attr('treatment');
	bootbox.confirm(JS_LOCALE.getTrans("Sind Sie sicher? Wollen Sie die Behandlung wirklich abbrechen?"), function(result) {
		if (result) {

			$.post(url_doctor_stopTreatment, {csrfmiddlewaretoken: csrf_token, pid: patient_id, tid: tid})
				.done(function() {
					bootbox.alert(JS_LOCALE.getTrans("Behandlung erfolgreich beendet!"), function() {
						window.location.href = window.location.pathname;
					});
				})
		}
		else {
			btn.removeAttr('disabled');
		}
	});
})


$('.tStartBtn').click(function(event) {

	event.stopPropagation()
	var btn = $(this)
	if ($(btn).hasClass('tRepeatBtn'))
	{
		$(this).parents('.treatmentItem').find('.treatmentRadio').removeAttr('assignedtreatment')

	}

	if ($(this).parents('.treatList').find('[assignedtreatment]').length)
	{
		bootbox.confirm(JS_LOCALE.getTrans("Sind Sie sicher? Dies wird die laufende  Behandlung ersetzen!"), function(result) {
			if (result)
			{

				$(btn).parents('.treatmentItem').find('.treatmentRadio').prop('checked', true);
				$(btn).parents('.treatmentItem').find('.treatmentRadio').trigger('change');
				$(btn).parents('.treatList').find('.activeTreatment').removeClass('activeTreatment')
				$(btn).parents('.treatmentItem').find('.panel-heading').addClass('activeTreatment')
			}
		});
	}
	else
	{
		$(btn).parents('.treatmentItem').find('.treatmentRadio').prop('checked', true);
		$(btn).parents('.treatmentItem').find('.treatmentRadio').trigger('change');
		$(btn).parents('.treatList').find('.activeTreatment').removeClass('activeTreatment')
		$(btn).parents('.treatmentItem').find('.panel-heading').addClass('activeTreatment')
	}
})


$(function() {


	$('.footable').footable({
		breakpoints: {
			phone: 320,
			tablet: 760,
			big: 2048
		}
	});
	$('.editProfile').bind('click', function(e) {
		e.preventDefault();
		var btn = $(this);
		if ($(btn).parents('.formData').find('.input').is(':radio')) {
			$('#Male').removeAttr('disabled');
			$('#Female').removeAttr('disabled');
			if ($('#Male').is(':checked')) {
				var val = "Male"
			}
			else {
				var val = "Female"
			}
			var valType = 'gender'
		}
		else {
			var val = $(btn).parents('.formData').find('.input').val();
			var valType = $(btn).parents('.formData').find('.input').attr('name');
		}
		if ($(btn).attr('value') === '1') {
			if (val === '') {
				bootbox.alert(JS_LOCALE.getTrans("Bitte geben Sie") +" <fieldname>");
				return false;
			}
			$.post("/doctor/update/patient/profile/", {
				csrfmiddlewaretoken: $('#csrf_token').val(),
				val: val,
				valType: valType,
				patient: patient_pk
			})
				.done(function(data) {
					if (data.status === 'phone') {
						bootbox.alert(JS_LOCALE.getTrans("Telefon muss eine Zahl nicht String sein."));
						$(btn).parents('.formData').find('.input').val('');
						return
					}
					if (data.status === 'dob') {
						bootbox.alert(JS_LOCALE.getTrans("Bitte wählen Sie ein Datum aus dem Kalender."));
						$(btn).parents('.formData').find('.input').val('');
						return
					}
					if (data.status === 'email') {
						bootbox.alert(JS_LOCALE.getTrans("Diese E-Mail-ID ist bereits an einen anderen Patienten zugeordnet, wählen Sie bitte ein anderes E-Mail."));
						$(btn).parents('.formData').find('.input').val('');
						return
					}
					if (data.status === 'invalid_email') {
						bootbox.alert(JS_LOCALE.getTrans("Bitte geben Sie eine gültige E-Mail-ID."));
						$(btn).parents('.formData').find('.input').val('');
						return
					}
					$(btn).parents('.formData').find('.input').attr('readonly', true);
					$('#Male').attr('disabled', true);
					$('#Female').attr('disabled', true);
				})
				.fail(function() {
					bootbox.alert(JS_LOCALE.getTrans("Es tut uns leid, können die Daten jetzt nicht aktualisieren, überprüfen pls Ihr Netzverbindung oder versuchen Sie es später noch einmal!"));
				})
			$(btn).html('Bearbeiten');
			$(btn).attr('value', '0');
			$(btn).parents('.formData').find('.input').attr('readonly', true);
		}
		else {
			$(btn).parents('.formData').find('.input').attr('readonly', false);
			$(btn).parents('.formData').find('.input').focus();
			$(btn).html('save');
			$(btn).attr('value', '1');
		}
	});
});
$(document).ready(function() {

	var d = new Date();
	var month = d.getMonth() + 1;
	var day = d.getDate();
	var output = (('' + day).length < 2 ? '0' : '') + day + '.' + (('' + month).length < 2 ? '0' : '') + month + '.' + d.getFullYear();
	$('input[name=startDate]').val(output);
});

$('.treatEditBtn').click(function(e) {
	e.preventDefault();
	var treatment = $(this).attr('treatment');
	if (treatment !== '') {
		$('.Titem').each(function(index, val) {
			var tr = $(this);
			var tid = tr.attr('tid');
			if (treatment === tid) {
				tr.addClass("Tselected");
				$('.editableDrugs').appendTo('.editableDrugsModel');
				$('.editableDrugs,#mmh').hide();
				if ($('.editableDrugs[tid="' + $(this).attr('tid') + '"]').show().length)
				{
					$('#mmh').show();
				}
				$('.editableDrugInputDoc').each(function(index, val) {
					var Doc = $(this);
					$('.editableDrugInputModal').each(function(index, val) {
						var modal = $(this);
						if (Doc.attr('drug') === modal.attr('drug')) {
							modal.val(Doc.val());
						}
					});
				});
			}
		});
	}
});

$(window).on('shown.bs.modal', function() {
	$(window).trigger('resize');
});


$('#ctcaefrm').submit(function(e) {
	e.preventDefault();
	var length = $('#seSearchResult tr').length - 1;
	$('#seSearchResult tr').each(function(index, val) {
		var row = $(this);
		if (index != length) {
			row.remove();
		}
	});
	var btn = $(this);
	var se = $('#se').val();
	if (se === '') {
		bootbox.alert(JS_LOCALE.getTrans('Nebeneffekt ist leer'));
		return;
	}
	$('#seLoading').show();
	$('#seSearchResultTable').hide();
	$.post('/doctor/search/se/', {
		csrfmiddlewaretoken: $('#csrf_token').val(),
		se: se,
	})
		.done(function(data) {

			$('#se').val('');
			if (data.length == 0) {
				var tr = $('#seSearchResult tr:first').clone().insertBefore('#seSearchResult tr:last').show();
				tr.find('.code').html(JS_LOCALE.getTrans('keine Nebenwirkungen gefunden'));
			}
			for (i = 0; i < data.length; i++) {
				var tr = $('#seSearchResult tr:last').clone().insertBefore('#seSearchResult tr:last').show();
				tr.find('.code').html(data[i].MedDRA_Code);
				tr.find('.se').html(data[i].sideeffect);
				if (data[i].doc_grade1 !== "" && data[i].doc_grade1 !== " -") {
					tr.find('.grade1').html('<div class="span2"><button class="btn btn-info btn-mini gradeBtn" grade="1" name="' + data[i].MedDRA_Code + '">' + S_LOCALE.getTrans('Wählen') + '</button></div> <div class="span9">Grad 1 : ' + data[i].doc_grade1 + '</div>');
				}
				if (data[i].doc_grade2 !== "" && data[i].doc_grade2 !== " -") {
					tr.find('.grade2').html('<div class="span2"><button class="btn btn-info btn-mini gradeBtn" grade="2" name="' + data[i].MedDRA_Code + '">' + S_LOCALE.getTrans('Wählen') + '</button></div> <div class="span9">Grad 2 : ' + data[i].doc_grade2 + '</div>');
				}
				if (data[i].doc_grade3 !== "" && data[i].doc_grade3 !== " -") {
					tr.find('.grade3').html('<div class="span2"><button class="btn btn-mini btn-info gradeBtn" grade="3" name="' + data[i].MedDRA_Code + '">' + S_LOCALE.getTrans('Wählen') + '</button></div> <div class="span9">Grad 3 : ' + data[i].doc_grade3 + '</div>');
				}
				if (data[i].doc_grade4 !== "" && data[i].doc_grade4 !== " -") {
					tr.find('.grade4').html('<div class="span2"><button class="btn btn-mini btn-info gradeBtn" grade="4" name="' + data[i].MedDRA_Code + '">' + S_LOCALE.getTrans('Wählen') + '</button></div> <div class="span9">Grad 4 : ' + data[i].doc_grade4 + '</div>');
				}
				if (data[i].doc_grade1 === "" && data[i].doc_grade2 === "" && data[i].doc_grade3 === "" && data[i].doc_grade4 === "") {
					tr.find('.grade1').html('Nicht grad verfügbar.');
				}
			}
			$('table').trigger('footable_redraw');
			$(window).trigger('resize');
			$('#seLoading').hide();
			$('#seSearchResultTable').show();
			$('.hideBtn').show();
		})
		.fail(function() {
			btn.removeAttr('disabled');
			btn.html('Suche');
			bootbox.alert(JS_LOCALE.getTrans('Ein Fehler aufgetreten bitte versuchen Sie es erneut.'));
		})
});
$('.hideBtn').click(function(e) {
	e.preventDefault();
	$('#seSearchResultTable').hide();
	$('.hideBtn').hide();
});


$('.gradeBtn').live('click', function() {
	var seid = $(this).attr('name');
	var grade = $(this).attr('grade');
	var patient = $('#patient').val();
	var treatment = CURRENT_TREATMENT;
	bootbox.confirm("Sind Sie sicher, Sie das grad speichern möchten?", function(result) {
		if (result) {
			$.post('/doctor/save/unexpected/grade/', {csrfmiddlewaretoken: csrf_token, patient: patient, seid: seid, grade: grade, treatment: treatment})
				.done(function(data) {
					if (data.status == true) {
						bootbox.alert(data.message + "! <img src='" + STATIC_URL + "img/accept.png' alt=''>", function() {
							window.location.reload();
						});
					}
					else {
						bootbox.alert(data.message + "! <img src='" + STATIC_URL + "img/delete.png' alt=''>");
					}
				})
				.fail(function() {
					btn.removeAttr('disabled');
					btn.html('Suche');
					bootbox.alert(JS_LOCALE.getTrans('Ein Fehler aufgetreten bitte versuchen Sie es erneut.'));
				})
		}
	});
});

$('.formEdit').click(function(e) {
	e.preventDefault();
	$(this).removeAttr('readonly');
});



