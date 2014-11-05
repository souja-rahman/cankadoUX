$(function(){
    $('.previewBtn').bind('click', function(e) {
        e.preventDefault();
        var id = $(this).attr('id');
        $.get("/doctor/print/receipt/", {
            id: id
        })
        .done(function(data) {
            $('#previewModal').modal();
            var pri = document.getElementById("contentstoprint").contentWindow;
            pri.document.open();
            pri.document.write(data);
            pri.document.close();
        })
        .fail(function() {
            bootbox.alert(JS_LOCALE.getTrans("Fehler in der Druck Quittung"));
        })
    });
    $('.print').bind('click', function(e) {
        e.preventDefault();
        var pri = document.getElementById("contentstoprint").contentWindow;
        pri.focus();
        pri.print();
        $('#previewModal').modal('hide');
    });
});

