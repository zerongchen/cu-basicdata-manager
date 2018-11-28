//表单后台校验方法
var AjaxValidator={};
AjaxValidator.isValid = function (formId, url){
    var result = AjaxValidator.doValidation(formId, url, null);
    return result;
};
AjaxValidator.doValidation = function(formId, url, data){
    var result = null;
    var $form = $('#' + formId);
    if(data==null){
        data = $form.serialize();
    }
    $.ajax({
        type: "POST",
        dataType: 'json',
        processData : false,
        async: false,
        url: url,
        data: data,
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
        success : function(ajaxValidationResult){
            AjaxValidator.cleanAllFormError(formId);
            var map=ajaxValidationResult.errorsArgsMap;
            for (var attr in map) {
                var error_id = attr+'_error';
                if(attr=='startIp:endIp'){
                    $form.find("label[name='startIP_error']").text(map[attr]);
                }else{
                    $form.find("label[id="+error_id+"]").text(map[attr]);
                }

            }
            if(jQuery.isEmptyObject(map)){
                result=true;
            }

        }
    });
    return result;
};
AjaxValidator.cleanAllFormError = function(formId){
    var $form = $('#' + formId);
    $form.find("label[class='control-label p-n error']").text('');
};