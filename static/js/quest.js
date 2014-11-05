function minToTimeStr(value)
{
	var hours1 = Math.floor(value / 60);
	var minutes1 = value - (hours1 * 60);

	if (hours1.length == 1)
		hours1 = '0' + hours1;
	if (minutes1.length == 1)
		minutes1 = '0' + minutes1;
	if (minutes1 == 0)
		minutes1 = '00';
	if (hours1 >= 24) {
		hours1 = hours1;
		minutes1 = minutes1;
	}

	return hours1 + ':' + minutes1;
}

function triggerOnNewQuest(quest)
{
	$(quest).find(".vscroll,.v1scroll").not(".mCustomScrollbar").mCustomScrollbar({
		theme: "dark-thick",
		advanced: {
			updateOnContentResize: true
		}
	});
	$(quest).find("input.dial").css("color", "black");
	$(quest).find(".dial").knob();
	$(quest).find('.dialBOX').hide()
	var delay = 150;//1 seconds
	setTimeout(function() {
		$(quest).find('.dialBOX').delay(100).show();
	}, delay);
}

function animFirstStep(Quest, status, qNo)
{
	var kado = $(Quest).find('.TBOX .dial').val()
	$(Quest).find('.noQuestTxt').parents('.finalQuestion').removeClass('wilted');
	$(Quest).find('.noQuest').val(kado).trigger('change');
	$(Quest).find('.noQuestTxt').html(kado);
//	alert('dd')
	$(Quest).find('.LBOX').hide("drop", {direction: "left"}, "slow");
	$(Quest).find('.questMedImage').hide("drop", {direction: "left"}, "slow");
	$(Quest).find('.BBOX').switchClass("BBOX", "LBOX", 800, "easeInOutQuad");
	$(Quest).find('.BBOXlc').switchClass("BBOXlc", "BBOXlc1", 800, "easeInOutQuad");
	$(Quest).find('.RBOXc').switchClass("RBOXc", "RBOXc1", 800, "easeInOutQuad");
	$(Quest).find('.BBOXrc').switchClass("BBOXrc", "BBOXrc1", 600, "easeInOutQuad");
	if (status === 'no') {
		if (Quest.hasClass('INQBox')) {
			if (qNo == 1) {
				$(Quest).find('.noQuest').val('0').trigger('change');
				$(Quest).find('.noQuestTxt').html('keine');
				$(Quest).find('.noQuestTxt').parents('.finalQuestion').addClass('wilted');
			}
		}
		else {
			$(Quest).find('.noQuest').val('0').trigger('change');
			$(Quest).find('.noQuestTxt').html('keine');
			$(Quest).find('.noQuestTxt').parents('.finalQuestion').addClass('wilted');
		}
	}
}

function animBackToFirstStep(Quest, status)
{

	$(Quest).find('.orgLBOX').show("drop", {direction: "left"}, "slow");
	$(Quest).find('.questMedImage').show("drop", {direction: "left"}, "slow");
	$(Quest).find('.LBOX').switchClass("LBOX", "BBOX", 800, "easeInOutQuad");
	$(Quest).find('.BBOXlc1').switchClass("BBOXlc1", "BBOXlc", 800, "easeInOutQuad");
	$(Quest).find('.RBOXc1').switchClass("RBOXc1", "RBOXc", 800, "easeInOutQuad");
	$(Quest).find('.BBOXrc1').switchClass("BBOXrc1", "BBOXrc", 600, "easeInOutQuad");
	firstQuestion(Quest);
	if (status === 'no') {
		$(Quest).find('.noQuest').val('0').trigger('change');
		$(Quest).find('.noQuestTxt').html('keine');
		$(Quest).find('.noQuestTxt').parents('.finalQuestion').addClass('wilted')
	}
}

function firstQuestion(quest)
{

	$(quest).find('.infoLBOX').hide()
	$(quest).find('.Q').hide("drop", {direction: "left"}, "slow");
	$(quest).find('.Q1').show("drop", {direction: "left"}, "slow");
	$(quest).find('.Qs').switchClass("Qs", "Q", 600, "easeInOutQuad");
	$(quest).find('.Q1').switchClass("Q", "Qs", 300, "easeOutQuart");
}

function getKados()
{
	$.post("/patient/getmykados/", {
		csrfmiddlewaretoken: $('#csrf_token').val(),
	}, function(data) {
		kados = data;
		$('#kado').html(kados);
	})
		.fail(function() {
//			console.log("error");
		});
}

function submitQuest(csrf, medicine, ptime, new_time, qty, btn)
{

	$.post('/patient/quest/drug/taken/', {
		csrfmiddlewaretoken: csrf,
		medicine: medicine,
		ptime: ptime,
		ttime: new_time,
		qty: qty
	})
		.done(function(data) {
			if (data.status == true)
			{
				getKados();
				//$(btn).parents('.quest-row').fadeOut();
				$(btn).parents('.quest-row').html('<div class="loader"><p style="text-align:center;font-size:70px; padding-top:65px;"><i class="fa fa-check"></i> Erledigt!</p> </div>').fadeOut(2000).delay(2000).queue(function() {
					$(this).remove();
					if ($("#questList").find(".quest-row").length < 1) {
						window.location = '/patient/dashboard/';
					}
					$(btn).removeAttr('disabled');
				});
				// $(btn).parents('div.quest-row').attr('id','loading');

			}
			else
			{
//				alert(data.message);
				//TASK do someting else
			}
		})
		.fail(function() {
			$(btn).removeAttr('disabled');
			alert("FAILED");
			//TASK do someting 
		})
		.always(function() {

		});
}


function sorterTime(a, b)
{
	//alert(a.getAttribute('time'))
	return parseFloat(a.getAttribute('time')) - parseFloat(b.getAttribute('time'));
}
;

function sorterKados(a, b)
{
	//alert(a.getAttribute('time'))
	return parseFloat(a.getAttribute('kados')) - parseFloat(b.getAttribute('kados'));
}
;
$.fn.reverseChildren = function() {
	return this.each(function() {
		var $this = $(this);
		$this.append($('#newTreatment').html());
		$this.children().each(function() {
			$this.prepend(this)
		});
	});
};
var shown = false

var qToShow = []


function showQuest(value) {
	for (var i = 0; i < intakeJson.drugs.length; i++) {
		if ($(value).attr('time') == intakeJson.drugs[i]['time'] && $(value).attr('drug') == intakeJson.drugs[i]['drug']) {
			// TODO REMOVE NOT WORKING
			$(value).remove();
			//console.log(value)
			return
		}
	}

	for (var i = 0; i < seJson.se.length; i++) {
		var time = $(value).attr('time')
		var date = new Date(parseInt(time) * 1000);
		var today = new Date();
		if ($(value).attr('time') == seJson.se[i]['time'] && $(value).hasClass('AEQBox')) {
			if (date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getYear() == today.getYear()) {
			}
			else {
				// TODO REMOVE NOT WORKING
				$(value).remove();
				return;
			}
		}
	}
	$(value).appendTo($(value).parent('.jscroll-added'));
	$(value).hide();

	for (q = 0; q < qToShow.length; q++)
	{
		if ($(value).hasClass(qToShow[q]))
		{
			$(value).show();
			shown = true;
		}

	}
}


var intakeJson = {}
var seJson = {}


$.ajax({
	url: '/patient/intakeJson/',
	type: 'GET'
}).done(function(data) {
	intakeJson = data
}).fail(function() {
	console.log("error");
})


$.ajax({
	url: '/patient/seJson/',
	type: 'GET'
}).done(function(data) {
	seJson = data
}).fail(function() {
	console.log("error");
})

var latestQTime = 0
var timeRev = false
console.log(latestQTime)
if ($('#QUESTFilterBY').val() == 'DDSC' || $('#QUESTFilterBY').val() == 'KDSC')
	timeRev = true
function reqQuest()
{
	$.ajax({
		url: '/patient/getQuest/',
		type: 'GET',
		data: {latestQTime: latestQTime, timeRev: timeRev}
	}).done(function(data) {

		$('#questList').append('<div class="jscroll-inner"><div class="jscroll-added">' + data + '</div></div>');
		$('#QUESTFilterBY').trigger('change');
		$('#loading').hide("drop", {direction: "up"}, "slow");
	}).fail(function(data) {
		console.log(data);
	})
}

$('#questList').jscroll({
	loadingHtml: '<center><img src="/static/img/bar.gif" alt="Loading" /></center>',
	padding: 20,
	nextSelector: 'a.nextQset:last',
	callback: function() {
		processQuest()
	}
});

function processQuest() {
	shown = false;
	n = $('#QUESTFilterBY').val();

	var sortedDivs = null;
	var qsetBox = $('.jscroll-added:last');
	var rev = false;
	$(".emptyMsg").hide();

	switch (n)
	{
		case 'DASC':
			sortedDivs = qsetBox.find('.questBox').toArray().sort(sorterTime);
			break;
		case 'DDSC':
			sortedDivs = qsetBox.find('.questBox').toArray().sort(sorterTime);
			rev = true
			break;
		case 'KASC':
			sortedDivs = qsetBox.find('.questBox').toArray().sort(sorterKados);
			break;
		case 'KDSC':
			sortedDivs = qsetBox.find('.questBox').toArray().sort(sorterKados);
			rev = true;
			break;
	}
	qToShow = []
	$('.filterITEM').each(function() {
		var item = this;
		if ($(item).attr('quests') && $(item).is(':checked'))
		{
			var qs = $(item).attr('quests').split(' ')
			qToShow = qToShow.concat(qs);
		}
	});
	var futQuestTime = null
	$.each(sortedDivs, function(index, value) {
		var qtime = parseFloat($(value).context.attributes['time'].nodeValue)
		var ctime = parseFloat($('#timeInS').val())
		if (qtime < ctime)
		{
			showQuest(value);
		}
		else
		{
			$(value).find('.questBtn').attr('disabled', true);
			$(value).find('.questOKbtn').html('Nicht jetzt');

			if (futQuestTime == null || futQuestTime == qtime)
			{
				showQuest(value)
				futQuestTime = qtime
			}
		}
		$(value).removeClass('notSorted')
	});
	if (rev)
	{
		qsetBox.reverseChildren();
	}
	$('.ALQ').hide()
	if ($('#filter_OTHER').is(':checked'))
	{

		$('.ALQ').each(function() {
			var value = $(this);
			$('.AEQ').each(function() {
				if (parseFloat($(this).find('.questDrug').val()) === parseFloat($(value).find('.questDrug').val()) && parseFloat($(this).find('.ptime').val()) === parseFloat($(value).find('.ptime').val())) {
					$(value).fadeIn(200);
					$(value).insertAfter($(this));
					shown = true;
				}
			})
			$('.SEQ').each(function() {
				console.log($(this).attr('time'), $(value).attr('seTime'))
				if ($(this).attr('time') == $(value).attr('seTime')) {
					$(value).fadeIn(200);
					$(value).insertAfter($(this));
				}
			});
			if (!shown) {

				$(value).show();
				shown = true;
			}
		});
	}
	if (!shown) {
		$(".emptyMsg").hide();
		$('<div class="alert alert-info emptyMsg">Hier finden Sie ihre Therapie-Erinnerung und  andere Benachrichtigungen <br> </div>').appendTo("#questList");
	}
	$('.questBox').each(function() {
		triggerOnNewQuest($(this))
	})
}

$('#QUESTFilterBY').change(function() {
	$(this).parents('form#qOptions').submit()
	return;
})

$('.filterITEM').change(function() {
	qToShow = []
	$('.filterITEM').each(function() {
		var item = this;
		if ($(item).attr('quests') && $(item).is(':checked'))
		{
			var qs = $(item).attr('quests').split(' ')
			qToShow = qToShow.concat(qs);
		}
	});

	var qClass = $(this).attr('quests')
	if ($(this).is(':checked'))
	{
		$('.' + qClass).each(function() {
			$(this).show();
		});
	}
	else
	{
		$('.' + qClass).each(function() {
			$(this).hide();
		});
	}
})

$(document).on('click', '.fbutton', function() {
	$(".filtercontent").slideToggle();
});

$(document).on('click', '.reminderUpdateBtn', function(event)
{
	var btn = $(this);
	$.post('/patient/quest/alert/update/', {
		csrfmiddlewaretoken: $('#csrf_token').val(),
		reminderId: $(btn).attr('reminderId')
	})
		.done(function(data) {
			if (data.status == true)
			{
				getKados();
				//$(btn).parents('.quest-row').fadeOut();
				$(btn).parents('.questBox').hide("drop", {direction: "right"}, "slow", function() {
					if ($("#questList").find(".questBox").length <= 1) {
						window.location = '/patient/dashboard/';
					}
					$(btn).parents('.questBox').remove()
				});

			}
			else
			{
				alert(data.message);
				//TASK do someting else
			}
		})
		.fail(function() {
			alert("FAILED");
			//TASK do someting 
		})
		.always(function() {

		});

});

$(document).ready(function()
{
	$("input.dial").css("color", "black");
	$(".dial").knob();

//	$('#QUESTFilterBY').trigger('change');
	$(document).on('click', '.msgBtn', function(event) {
		$('#treatMsg').hide();
	});

	$('.setooltip').tooltip();
	$(".vscroll,.v1scroll").not(".mCustomScrollbar").mCustomScrollbar({
		theme: "dark-thick",
		advanced: {
			updateOnContentResize: true
		}
	});

	$('.date').inputmask("dd.mm.yyyy");
});


function nextQuestion(quest, q1, q2, status)
{
	var drug = quest.find('.questDrug').attr('value');
	var time = quest.find('.ptime').attr('value');

	$(quest).find('.no_kado').val('')
	$(quest).find('.infoLBOX').hide()
	if (drug != undefined) {
		if (q1 == 1 && status === 'no') {
			$(quest).find('.no_kado').val('1')
		}
		if (q1 != 7 && q1 != 4) {
			if (status === 'no') {
				if (q1 == 6) {
					reminderQuest(q1, drug, time, quest, $('#recommendation').val())
				}
				else if (q1 == 3) {
					reminderQuest(4, drug, time, quest)
				}
				else {
					reminderQuest(q1, drug, time, quest)
				}
			}
			if (q1 == 4) {
				reminderQuest(q1, drug, time, quest)
			}

		}
		if (q1 == 9 && q2 != 7) {
			var diary = $(quest).find(".diaryEntryTA").val()
			if (diary === '') {
				bootbox.alert('Persönliches Tagebuch ist leer', function() {
					$(quest).find(".diaryEntryTA").focus();
				});
				return;
			}
			$(quest).find('.personalDiary').val(diary);
		}
	}
	else if ($(quest).hasClass('AEQBox'))
	{

		if (q2 === 3 || q2 === 4)
		{
			$('.sideEffectSEQ').sort(function(a, b) {
				var at = $(a).data('se');
				var bt = $(b).data('se');
				if (typeof at === 'string' && typeof bt === 'string')
					return at.toLowerCase().localeCompare(bt.toLowerCase());
				return (at > bt) ? 1 : ((at < bt) ? -1 : 0);
			}).each(function(_, container) {
				$(container).parent().append(container);
			});
		}
		if (q2 === 4)
		{
			if ($(quest).find('.Q3 .sideEffectsSEQ .sideEffectSEQ').length === 0)
			{
				$(quest).find('.Q4 .questBtn.NoBtn').addClass('disabled');
			}
			else
			{
				$(quest).find('.Q4 .questBtn.NoBtn').removeClass('disabled');
			}
			var splSe = $(quest).find('.Q4 .splSE')
			$(splSe).parent().prepend(splSe)
		}
		else if (q2 === 3)
		{
			var info = $(quest).find('.Q3 .infoContent').html();
			$(quest).find('.infocontent').html(info);
			$(quest).find('.infoLBOX').show();

			var splSe = $(quest).find('.Q3 .splSE')
			$(splSe).parent().append(splSe)

		}
		else if (q2 === 6)
		{
			var info = $(quest).find('.Q6 .infoContent').html();
			$(quest).find('.infocontent').html(info);
			$(quest).find('.infoLBOX').show();
		}
	}
	$(quest).find('.Qs').hide("drop", {direction: "left"}, "slow");
	$(quest).find('.Qs').switchClass("Qs", "Q", 50, "easeInOutQuad");
	$(quest).find('.Q' + q2).switchClass("Q", "Qs", 50, "easeOutQuart");
	$(quest).find('.Q' + q2).hide();
	$(quest).find('.Q' + q2).show("drop", {direction: "left"}, "slow");
}


//Intake Quest
$(document).on('click', '.INQBox .questBtn', function() {

	var btn = $(this);

	if ($(btn).hasClass('disabled'))
	{
		return true;

	}

	var quest = $(this).parents('.questBox');
	var QuestionBox = $(this).parents('.questionP');
	var qNo = 0;

	if ($(QuestionBox).hasClass('Q1'))
		qNo = 1;
	else if ($(QuestionBox).hasClass('Q2'))
		qNo = 2;
	else if ($(QuestionBox).hasClass('Q3'))
		qNo = 3;
	else if ($(QuestionBox).hasClass('Q4'))
		qNo = 4;
	else if ($(QuestionBox).hasClass('Q5'))
		qNo = 5;
	else if ($(QuestionBox).hasClass('Q6'))
		qNo = 6;
	else if ($(QuestionBox).hasClass('Q7'))
		qNo = 7;
	else if ($(QuestionBox).hasClass('Q8'))
		qNo = 8;
	else if ($(QuestionBox).hasClass('Q9'))
		qNo = 9;

	if ($(btn).hasClass('YesBtn'))
	{
		switch (qNo)
		{
			case 1:
				animFirstStep(quest);
				nextQuestion(quest, 1, 2);
				break;
			case 2:
				nextQuestion(quest, 2, 3);
				break;
			case 3:
				$(quest).find('.qty').val(btn.attr('drug'));
				nextQuestion(quest, 3, 5);
				break;
			case 4:
				var drug = btn.parents('.questionP').find('.drugQty').val();
				if (drug === '' || !$.isNumeric(drug) || parseInt(drug) < 0) {
					bootbox.alert('Ungültig Menge', function() {
						btn.parents('.questionP').find('.drugQty').val('');
						btn.parents('.questionP').find('.drugQty').focus();
					});
					return
				}
				$(quest).find('.qty').val(btn.parents('.questionP').find('.drugQty').val());
				nextQuestion(quest, 4, 5);
				break;
			case 5:
				var name = btn.attr('time');
				var checked = false
				var drug = btn.parents('.questBox').find('.questDrug').attr('value');
				var time = btn.parents('.questBox').find('.ptime').attr('value');
				var recommendation = $('#recommendation').val();
				;
				$('input[name="' + name + '"]').each(function() {
					if ($(this).prop('checked')) {
						checked = true
						var time = $(this).val();
						var new_time = new Date(parseInt(name) * 1000)
						if (time === '1') {
							$(quest).find('.ttime').val(new_time.getTime() / 1000);
							$(quest).find('.questtime').val('1');
						}
						if (time === '2') {
							reminderQuest(5, drug, time, quest)
							new_time = new_time.addMinutes(31)
							$(quest).find('.ttime').val(new_time.getTime() / 1000);
							$(quest).find('.questtime').val('2');
						}
						if (time === '3') {
							reminderQuest(5, drug, time, quest)
							new_time = new_time.addMinutes(121)
							$(quest).find('.ttime').val(new_time.getTime() / 1000);
							$(quest).find('.questtime').val('3');
						}
						if (time === '4') {
							reminderQuest(5, drug, time, quest)
							new_time = new_time.addMinutes(1441)
							$(quest).find('.ttime').val(new_time.getTime() / 1000);
							$(quest).find('.questtime').val('4');
						}
					}
				});
				if (!checked) {
					bootbox.alert('Bitte wählen Medizin Zeit');
					return;
				}
				if (recommendation != '') {
					nextQuestion(quest, 5, 6);
				}
				else {
					nextQuestion(quest, 5, 7);
				}
				break;
			case 6:
				nextQuestion(quest, 6, 7);
				break;
			case 7:
				nextQuestion(quest, 7, 9);
				break;
			case 9:
				nextQuestion(quest, 9, 8);
				break;
		}
	}
	else if ($(btn).hasClass('NoBtn'))
	{
		switch (qNo)
		{
			case 1:
				animFirstStep(quest, 'no', qNo);
				nextQuestion(quest, 1, 8, 'no');
				break;
			case 2:
				var new_time = new Date();
				$(quest).find('.ttime').val(new_time.getTime() / 1000);
				nextQuestion(quest, 2, 7, 'no');
				break;
			case 3:
				nextQuestion(quest, 3, 4, 'no');
				break;
			case 4:
				nextQuestion(quest, 4, 5, 'no');
				break;
			case 5:
				nextQuestion(quest, 5, 7, 'no');
				break;
			case 6:
				nextQuestion(quest, 6, 7, 'no');
				break;
			case 7:
				nextQuestion(quest, 7, 8, 'no');
				break;
		}
	}
	else if ($(btn).hasClass('closeBtn'))
	{
		switch (qNo)
		{
			case 1:
//				animFirstStep(quest);
//				nextQuestion(quest, 1, 2);
				break;
			case 2:
//				nextQuestion(quest, 2, 3);
				break;
			case 3:
//				nextQuestion(quest, 3, 5);
				break;
			case 4:
//				nextQuestion(quest, 4, 5);
				break;
			case 5:
//				nextQuestion(quest, 5, 7);
				break;
			case 6:
//				nextQuestion(quest, 6, 7);
				break;
			case 7:
//				nextQuestion(quest, 6, 7);
				break;
			case 8:
//				nextQuestion(quest, 7, 8);
				var drug = btn.parents('.questBox').find('.questDrug').attr('value');
				$('#drug').val(drug);
				var ptime = btn.parents('.questBox').find('.ptime').attr('value');
				$('#ptime').val(ptime);
				var qty = btn.parents('.questBox').find('.qty').attr('value');
				$('#qty').val(qty);
				var ttime = btn.parents('.questBox').find('.ttime').attr('value');
				$('#ttime').val(ttime);
				var questtime = btn.parents('.questBox').find('.questtime').attr('value');
				$('#questtime').val(questtime);
				var reminder1 = btn.parents('.questBox').find('.reminder1').attr('value');
				$('#reminder1').val(reminder1);
				var reminder2 = btn.parents('.questBox').find('.reminder2').attr('value');
				$('#reminder2').val(reminder2);
				var reminder4 = btn.parents('.questBox').find('.reminder4').attr('value');
				$('#reminder4').val(reminder4);
				var reminder5 = btn.parents('.questBox').find('.reminder5').attr('value');
				$('#reminder5').val(reminder5);
				var reminder6 = btn.parents('.questBox').find('.reminder6').attr('value');
				$('#reminder6').val(reminder6);
				var pd = btn.parents('.questBox').find('.personalDiary').attr('value');
				$('#personalDiary').val(pd);
				var no_kado = btn.parents('.questBox').find('.no_kado').attr('value');
				$('#no_kado').val(no_kado);

				$('#questFrm').submit();
				$(quest).hide("drop", {direction: "right"}, "slow", function() {
					$(quest).remove();
				});

				break;
		}

	}
});

$(document).on('click', '.abtrtBtn', function() {
	var btn = $(this);
	var quest = $(this).parents('.questBox');
	animBackToFirstStep(quest)
})

$(document).on('click', '.switch, .conswitch, .intakeTime', function() {
	$(this).find('input[type="radio"]').prop('checked', true).trigger('change');
});

$('#questFrm').submit(function(e) {
	e.preventDefault();
	$.post("/patient/quest/drug/taken/", $(this).serialize())
		.done(function(data) {
			getKados();
		})
		.fail(function() {
			alert('error')
		})
});

function reminderQuest(reminder, drug, time, quest, recommendation, seQuest) {

	var csrf = $('#csrf').val();
	var sequest = ''
	if (seQuest == true) {
		sequest = '1'
	}
	$.ajax({
		url: '/patient/save/reminder/' + reminder + '/',
		type: 'POST',
		data: {drug: drug, time: time, recommendation: recommendation, csrfmiddlewaretoken: csrf, seQuest: sequest},
	})
		.done(function(data) {
			if (data.length > 100)
			{
				$(quest).after(data);
				triggerOnNewQuest($(quest).next())
				$(quest).next().find('.dialBOX').hide().delay(500).queue(function() {
					$(this).show();
//					alert('asd')
				});
			}
			getKados();
		})
		.fail(function() {
		})
}

$(document).on('click', '.Q3 .unselected .sideEffectSEQ .seTitleSEQ', function()
{
	var question = $(this).parents('.sideEffectSEQ');
	var quest = $(question).parents('.AEQBox');
	if ($(question).parents('.unselected').length)
	{
		var SE = $(quest).find('.Q4 .documentedSEs .mCSB_container').append(question);
		$(quest).find('.Q4').find('.YesBtn').addClass('disabled');
		nextQuestion(quest, 3, 4, 'no');
	}
	$(quest).find('.sideEffectSEQ.selected').removeClass('selected');
	question.addClass('selected');
	var info = $(question).find('.infoContent').html();
	$(quest).find('.infocontent').html(info);
	$(quest).find('.infoLBOX').show();

})




$(document).on('click', '.seGradLblSEQ:not(:empty)', function()
{
	var SEType = $(this);
	var quest = $(SEType).parents('.AEQBox');
	var SEList = $(SEType).parents('.sideEffectsSEQ');
	var question = $(SEType).parents('.sideEffectSEQ');
	if ($(SEType).parents('.sideEffectSEQ').hasClass('selected'))
		$(quest).find('.infoLBOX').hide();
	$(SEType).parents('.sideEffectSEQ').removeClass('selected').addClass('documented');
	$(SEType).parents('.sideEffectSEQ').find('.seRadio').attr('checked', 'checked');
	$(SEType).parents('.sideEffectSEQ').find('.seGradItmSEQ.selected').removeClass('selected');
	$(SEType).parents('.seGradItmSEQ').addClass('selected');
	var allSelectedSe = $(quest).find('.sideEffectsSEQ.documentedSEs .sideEffectSEQ').length;
	var allDocedSe = $(quest).find('.sideEffectsSEQ.documentedSEs .sideEffectSEQ.documented').length;
	if (allDocedSe === allSelectedSe)
		$(quest).find('.Q4 .YesBtn').removeClass('disabled');
	else
		$(quest).find('.Q4 .YesBtn').addClass('disabled');
});

//Adverse Effect Quest
$(document).on('click', '.AEQBox .questBtn', function() {

	var btn = $(this);
	if ($(btn).hasClass('disabled'))
	{
		return;
	}
	var quest = $(this).parents('.questBox');
	$(quest).find('.slidekadoTxt1').show('slow');
	$(quest).find('.slidekadoTxt2').hide('slow');
	var QuestionBox = $(this).parents('.questionP');
	var qNo = 0;
	if ($(QuestionBox).hasClass('Q1'))
		qNo = 1;
	else if ($(QuestionBox).hasClass('Q2'))
		qNo = 2;
	else if ($(QuestionBox).hasClass('Q3'))
		qNo = 3;
	else if ($(QuestionBox).hasClass('Q4'))
		qNo = 4;
	else if ($(QuestionBox).hasClass('Q5'))
		qNo = 5;
	else if ($(QuestionBox).hasClass('Q6'))
		qNo = 6;
	else if ($(QuestionBox).hasClass('Q7'))
		qNo = 7;
	else if ($(QuestionBox).hasClass('Q8'))
		qNo = 8;
	else if ($(QuestionBox).hasClass('Q9'))
		qNo = 9;
	if ($(btn).hasClass('YesBtn'))
	{
		switch (qNo)
		{
			case 1:
				checkSe(quest, btn);
				//animFirstStep(quest);
				//nextQuestion(quest, 1, 2);
				break;
			case 2:
				var activeSe = btn.attr('activeSe').split(',')
				if (activeSe == "") {
					nextQuestion(quest, 2, 3);
				}
				else {
					nextQuestion(quest, 2, 4);
					for (i = 0; i < activeSe.length; ++i) {
						if (activeSe[i] == 'y' || activeSe[i] == 'n')
							$(quest).find('.Q3 .unselected .sideEffectSEQ .seTitleSEQ[seID="sse"]').trigger('click');
						else
							$(quest).find('.Q3 .unselected .sideEffectSEQ .seTitleSEQ[seID="' + activeSe[i] + '"]').trigger('click');
					}
					for (i = 0; i < activeSe.length; i++) {
						$(quest).find('.seGradLblSEQ').each(function() {
							if ($(this).attr('setype') == activeSe[i]) {
								$(this).trigger('click')
							}
						});
					}
				}
				break;
			case 3:
//				nextQuestion(quest, 3, 5);
				break;
			case 4:
				nextQuestion(quest, 4, 5);
				break;
			case 5:
				nextQuestion(quest, 5, 6);
				break;
			case 6:
				var diary = $(quest).find(".diaryEntryTA").val();
				if (diary === '') {
					bootbox.alert('Persönliches Tagebuch ist leer', function() {
						$(quest).find(".diaryEntryTA").focus();
					});
					return;
				}
				$(btn).attr('disabled', 'disabled');
				saveSe(quest, btn, qNo);
//				nextQuestion(quest, 6, 7);
				break;
			case 7:
//				nextQuestion(quest, 7, 9);
				break;
			case 9:
//				nextQuestion(quest, 9, 8);
				break;
		}
	}
	else if ($(btn).hasClass('NoBtn'))
	{
		switch (qNo)
		{
			case 1:
				var time = $(quest).attr('time');
				var seQuest = true
				reminderQuest(7, '', time, quest, '', seQuest)
				saveSe(quest, btn, qNo);
//				animFirstStep(quest, 'no');
//				nextQuestion(quest, 1, 8, 'no');
				break;
			case 2:
				saveSe(quest, btn, qNo);
//				nextQuestion(quest, 2, 7, 'no');
				break;
			case 3:
//				nextQuestion(quest, 3, 4, 'no');
				break;
			case 4:
				nextQuestion(quest, 4, 3, 'no');
				break;
			case 5:
				$(quest).find('.diaryEntryTA').val('');
				$(btn).attr('disabled', 'disabled');
				saveSe(quest, btn, qNo);
//				nextQuestion(quest, 5, 7, 'no');
				break;
			case 6:
//				nextQuestion(quest, 6, 7, 'no');
				break;
			case 7:
//				nextQuestion(quest, 7, 8, 'no');
				break;
		}
	}
	else if ($(btn).hasClass('closeBtn'))
	{
		switch (qNo)
		{
			case 1:
//				animFirstStep(quest);
//				nextQuestion(quest, 1, 2);
				break;
			case 2:
//				nextQuestion(quest, 2, 3);
				break;
			case 3:
//				nextQuestion(quest, 3, 5);
				break;
			case 4:
//				nextQuestion(quest, 4, 5);
				break;
			case 5:
//				nextQuestion(quest, 5, 7);
				break;
			case 6:
//				nextQuestion(quest, 6, 7);
				break;
			case 7:
				$(quest).hide("drop", {direction: "right"}, "slow", function() {
					var time = $(quest).attr('time');
					var date = new Date(parseInt(time) * 1000);
					var today = new Date();
					if (date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getYear() == today.getYear())
					{
						$(quest).show();
						animBackToFirstStep(quest);
					}
					else {
						$(quest).remove();
					}
				});
				break;
			case 8:
				break;
		}


	}
});
$(document).on('click', '.abbrTOdocList', function() {
	var quest = $(this).parents('.questBox');
	if ($(quest).find('.Q4 .documentedSEs .sideEffectSEQ').length > 0)
		nextQuestion(quest, 3, 4, 'no');
	else
		nextQuestion(quest, 3, 2, 'no');
});
$(document).on('click', '.INQBox .abbrfromText', function() {
	var quest = $(this).parents('.questBox');
	nextQuestion(quest, 9, 7, 'no');
});
$(document).on('click', '.AEQBox .abbrfromText', function() {
	var quest = $(this).parents('.questBox');
	nextQuestion(quest, 6, 5, 'no');
});
function saveSe(quest, btn, qNo) {
	$(btn).attr('disabled', 'disabled')
	var SE = {
		'se': [],
		'csrf': '',
		'diary': '',
		'noKado': ''
	}
	var time = $(quest).attr('time');
	var ses = $(quest).attr('ses').split(', ');
	for (i = 0; i < ses.length; i++) {
		var x = {}
		$(quest).find('.selected').each(function() {
			var se = $(this).find('.seRadio').attr('se');
			if (ses[i] == se) {
				var setype = $(this).find('.seRadio').attr('value');
				x = {'se': se, 'setype': setype, 'time': time}
			}
		});
		if (x.se == undefined) {
			x = {'se': ses[i], 'setype': '', 'time': time}
		}
		SE.se.push(x);
	}
	$(quest).find('.selected').each(function() {
		var se = $(this).find('.seRadio').attr('se');
		if (se === 'sse') {
			var setype = $(this).find('.seRadio').attr('value');
			x = {'se': 'sse', 'setype': setype, 'time': time}
			SE.se.push(x);
		}
	});
	var csrf = $('#csrf').val();
	SE.csrf = csrf;
	SE.diary = $(quest).find('.diaryEntryTA').val();
	if (qNo === 1) {
		SE.noKado = '1'
	}
	$.ajax({
		url: '/patient/quest/update/side-effect/',
		type: 'POST',
		contentType: "application/json",
		data: JSON.stringify(SE),
	})
		.done(function(data) {
			if (data.message) {
				$(quest).find('.slidekadoTxt2').show();
				$(quest).find('.slidekadoTxt1').hide();
				$(quest).find('.noQuestTxt').parents('.finalQuestion').addClass('wilted')
			}
			$(btn).removeAttr('disabled')
			if (qNo == 1) {
				animFirstStep(quest);
				nextQuestion(quest, 1, 7);
				$(quest).find('.noQuest').val('0').trigger('change');
				$(quest).find('.noQuestTxt').html('keine');
				$(quest).find('.noQuestTxt').parents('.finalQuestion').addClass('wilted')
			}
			else {
				if (qNo == 2) {
					$(quest).find('.slidekadoTxt2').show();
					$(quest).find('.slidekadoTxt1').hide();
					//$(quest).find('.noQuest').val('0').trigger('change');
					//$(quest).find('.noQuestTxt').html('keine');
				}
				else {
					var kado = $(quest).find('.TBOX .dial').val()
					$(quest).find('.noQuest').val(kado).trigger('change');
					if (kado == 0) {
						$(quest).find('.noQuestTxt').html('keine');
						$(quest).find('.noQuestTxt').parents('.finalQuestion').addClass('wilted');
					}
					else {
						if (!data.message) {
							$(quest).find('.noQuestTxt').parents('.finalQuestion').removeClass('wilted');
						}
						$(quest).find('.noQuestTxt').html($(quest).find('.noQuest').val())
					}
				}
				nextQuestion(quest, qNo, 7);
			}
			getKados();
		})
		.fail(function() {
			$(btn).removeAttr('disabled')
//			console.log("error");
		})
}

function checkSe(quest, btn) {
	$(btn).attr('disabled', 'disabled')
	var date = $(quest).attr('time');
	$.ajax({
		url: '/patient/get/active/ses/',
		type: 'GET',
		data: {date: date}
	})
		.done(function(data) {
			$(btn).removeAttr('disabled')
			animFirstStep(quest);
			nextQuestion(quest, 1, 2);
			var i
			var activeSe = []
			for (i = 0; i < data.activeSe.length; ++i)
			{
				activeSe.push(data.activeSe[i])
			}
			for (i = 0; i < data.todaySES.length; i++) {
				$(quest).find('.seGradLblSEQ').each(function() {
					if ($(this).attr('setype') == data.todaySES[i]) {
						//$(this).trigger('click')
						activeSe.push(data.todaySES[i])
					}
				});
			}

			$(quest).find('.Q2 .YesBtn').attr('activeSe', activeSe);
			$(quest).find('.diaryEntryTA').val(data.DefaultDiary || '');
		})
		.fail(function() {
			$(btn).removeAttr('disabled');
		})
}

