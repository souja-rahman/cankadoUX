function fileValidation(form){
    var drug = $(form).find('#drug').val();
    if (drug != undefined){
        if(drug.match(/\s/g) != null) {
            bootbox.alert("Please remove space from drugname", function(){
                $(form).find('#drug').focus();
            });
            return false;
        }
    }
    var othername = $(form).find('#drugothername').val();
    if (othername != undefined){
        if(othername.match(/\s/g) != null) {
            bootbox.alert("Please remove space from Other Name", function(){
                $(form).find('#drugothername').focus();
            });
            return false;
        }
    }
    var img = $(form).find(".flUpload")
    var file = $(img).val();
    if (file === ''){
        $(form).find('.submitBtn').attr('disabled', 'disabled');
        return true;
    }
    var extension = file.split('.').pop().toUpperCase();
    if (extension!="PNG" && extension!="JPG" && extension!="JPEG"){
        bootbox.alert('Invalid file type, only jpg/png images allowed!!');
        return false;
    }
    var iSize = ($(img)[0].files[0].size / 1024 / 1024);
    if (iSize > 2){
        bootbox.alert('Image Size should be upto 2Mb!');
        return false;
    }
    $(form).find('.submitBtn').attr('disabled', 'disabled');
    return true;
}