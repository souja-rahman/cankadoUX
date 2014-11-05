    $(function() {
        $('.datetimepicker').datetimepicker({
            pickDate: false
        });
    });
    $('#timeInterview').click(function(e) {
        e.preventDefault();
        $('#timeInterviewModal').modal({
            backdrop : 'static',
            keyboard : false
        });
    });
    $('#timeForm').submit(function(e) {
        e.preventDefault();
        var form = $(this);
        var breakfast = $('#breakfast').val();
        var lunch = $('#lunch').val();
        var dinner = $('#dinner').val();
        var sleep = $('#sleep').val();
        var free_selectable = $('#free_selectable').val();
        var csrf = $('#csrf').val();
        if (breakfast === ''){
            bootbox.alert(JS_LOCALE.getTrans('Geben Sie bitte Breakfast Zeit'));
            return;
        }
        if (lunch === ''){
            bootbox.alert(JS_LOCALE.getTrans('Geben Sie bitte Mittagessen Zeit'));
            return;
        }
        if (dinner === ''){
            bootbox.alert(JS_LOCALE.getTrans('Geben Sie bitte Abendessen Zeit'));
            return;
        }
        if (sleep === ''){
            bootbox.alert(JS_LOCALE.getTrans('Geben Sie bitte Schlaf Zeit'));
            return;
        }
        if (free_selectable === ''){
            bootbox.alert(JS_LOCALE.getTrans('Geben Sie bitte Frei wählbar'));
            return;
        }
        form.find('.submitBtn').attr('disabled', 'disabled')
        $.ajax({
            url: '/patient/save/time/interview/',
            type: 'POST',
            data: {breakfast: breakfast, lunch:lunch, dinner:dinner, sleep:sleep, free_selectable:free_selectable, csrfmiddlewaretoken:csrf},
        })
        .done(function() {
            form.find('.submitBtn').removeAttr('disabled')
            bootbox.alert('Interview erfolgreich abgeschlossen', function(){
                $('#timeInterviewModal').modal('hide');
                window.location.reload();
            });
        })
        .fail(function() {
            form.find('.submitBtn').removeAttr('disabled')
            bootbox.alert(JS_LOCALE.getTrans('Ein Fehler ist aufgetreten, bitte wiederholen.'));
        })
        return false;
    });

  if($("#breakfastTime").length !== 0) {
    $('#breakfast').val($('#breakfastTime').val());
  }
  if($("#lunchTime").length !== 0) {
    $('#lunch').val($('#lunchTime').val());
  }
  if($("#dinnerTime").length !== 0) {
    $('#dinner').val($('#dinnerTime').val());
  }
  if($("#sleepTime").length !== 0) {
    $('#sleep').val($('#sleepTime').val());
  }
