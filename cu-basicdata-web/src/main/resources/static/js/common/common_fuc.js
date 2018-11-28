//...
(function(){$('input[type="file"]').prettyFile();})();

//更多查询 prompt-search
function showsearch() {
    if($('.prompt-search').css('display') == 'none') {
        $('.prompt-search').show();
    } else {
        $('.prompt-search').hide();
    }
};


//IP地址使用方式
function ipTypeFormatter(value){
    if(value==0){
        return '静态';
    }else if(value==1){
        return '动态';
    }else if(value==2){
        return '保留';
    }else if(value==3){
        return '专线';
    }else if(value==999){
        return '云虚拟';
    }{
        return '';
    }
}

//处理状态2(1-未上报，2-已上报)
function dealFlagFormatter2(value){
    if(value==0){
        return '未上报';
    }else if(value==1){
        return '已上报';
    }else{
        return '';
    }
}

//使用类型(1-自用，2-租用)
function useTypeFormatter(value){
    if(value==1){
        return '自用';
    }else if(value==2){
        return '租用';
    }else{
        return '';
    }
}

//分配状态(1-未分配  、2-已分配)
function distributionFormatter(value){
    if(value==1){
        return '未分配';
    }else if(value==2){
        return '已分配';
    }else{
        return '';
    }
}

//占用状态(1-未占用 、2-已占用)
function occupancyFormatter(value){
    if(value==1){
        return '未占用';
    }else if(value==2){
        return '已占用';
    }else{
        return '';
    }
}

var czlxArr = new Array();
czlxArr[czlxArr.length] = new Array('1','新增');
czlxArr[czlxArr.length] = new Array('2','变更');
czlxArr[czlxArr.length] = new Array('3','删除');
function getCzlxArr(){
    return czlxArr;
}
//操作类型
function czlxFormatter(value, row, index){
    var result = "未知";
    for(var i = 0; i < czlxArr.length; i++) {
        if(value == czlxArr[i][0]){
            result = czlxArr[i][1];
            break;
        }
    }
    return result;
}

//处理标记（0-未预审、1-预审不通过、2-上报审核中、3-上报审核不通过、4-提交上报、5-上报成功、6-上报失败）
var dealFlagArr = new Array();
dealFlagArr[dealFlagArr.length] = new Array('0','未预审');
dealFlagArr[dealFlagArr.length] = new Array('1','预审不通过');
dealFlagArr[dealFlagArr.length] = new Array('2','上报审核中');
dealFlagArr[dealFlagArr.length] = new Array('3','上报审核不通过');
dealFlagArr[dealFlagArr.length] = new Array('4','提交上报');
dealFlagArr[dealFlagArr.length] = new Array('5','上报成功');
dealFlagArr[dealFlagArr.length] = new Array('6','上报失败');
function getDealFlagArr(){
    return dealFlagArr;
}
//操作类型
function dealFlagFormatter(value, row, index){
    var result = "未知";
    for(var i = 0; i < dealFlagArr.length; i++) {
        if(value == dealFlagArr[i][0]){
            result = dealFlagArr[i][1];
            break;
        }
    }
    return result;
}

//机房服务性质
function jfxzFormatter(value, row, index){
    var result = "";
    var dataList = jcdmCode.getData().jfxzArr;
    for(var n in dataList){
        if(value==dataList[n].id){
            return dataList[n].mc;
        }
    }
    return "";
}

//服务内容
function fwnrFormatter(value, row, index){
    var result = "";
    var dataList = jcdmCode.getData().fwnrArr;
    if(value!=null){
        var fwnrs = value.split(",");
        for(var n in fwnrs){
            for(var i = 0; i <  dataList.length; i++) {
                if(fwnrs[n] ==  dataList[i].id){
                    result += "["+dataList[i].mc+"]";
                    break;
                }
            }
        }

    }
    return result;
}

//单位名称
function unitNameFormatter(value, row, index){
    var result = "";
    for(var n in value ){
        if(value[n]!=null){
            result+="["+value[n]+"]";
        }
    }
    return result;
}

//应用服务类型
function appServerName(value, row, index){
    var typeStr = "";
    if(value==0){
        typeStr = "内部应用";
    }else{
        typeStr = "电信业务/对外应用服务";
    }
    return typeStr;
}

//接入方式
function setmodeFormatter(value, row, index) {
    if(value==1){
        return "租用";
    }else if(value=2){
        return "自建";
    }else{
        return "其它";
    }
}

//业务类型
function businessFormatter(value, row, index) {
    if(value==1){
        return "IDC业务";
    }else if(value=2){
        return "ISP业务";
    }
}

//证件类型
function zjlxFormatter(value, row, index) {
    var dataList = jcdmCode.getData().zjlxArr;
    for(var n in dataList){
        if(value==dataList[n].id){
            return dataList[n].mc;
        }
    }
}

/**
 * 用于格式化日期的处理方法(格式：yyyy-MM-dd HH:mm:ss)
 *
 * @param cellValue 表格单元格的内容
 * @param options
 * @param rowObject
 * @return
 */
function dateFormatter(cellValue, options, rowObject) {
    if (!$.trim(cellValue)) {
        return "";
    }
    var d = new Date(cellValue);
    var day = d.getDate();
    var mon = d.getMonth() + 1;
    var year = d.getFullYear();
/*    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();*/
    if (day < 10) {
        day = "0" + day;
    }
    if (mon < 10) {
        mon = "0" + mon;
    }
/*    if(hours < 10){
        hours = "0" + hours;
    }
    if(minutes < 10){
        minutes = "0" + minutes;
    }
    if(seconds < 10){
        seconds = "0" + seconds;
    }*/
    var formattedDate = year + "-" + mon + "-" + day /*+ " " + hours + ":" + minutes + ":" + seconds*/;
    return formattedDate;
}
/**
 * 用于格式化日期的处理方法(格式：yyyy-MM-dd)
 */
function dateFormatter2(cellValue, options, rowObject) {
    if (!$.trim(cellValue)) {
        return "";
    }
    var d = new Date(cellValue);
    var day = d.getDate();
    var mon = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (mon < 10) {
        mon = "0" + mon;
    }
    var formattedDate = year + "-" + mon + "-" + day;
    return formattedDate;
}

function setFormdata(fieldArray, currentRow, $containerPanel){
    var selector = '';
    for(var i = 0 ; i < fieldArray.length ; i++){
        var template = '*[name="{0}"]';
        if(i != (fieldArray.length -1)){
            template += ',';
        }
        selector += $.validator.format(template, fieldArray[i]);
    }
    $(selector, $containerPanel).each(function(){
        var $this = $(this);
        var element = $this.get(0);
        if(element == undefined){
            return;
        }
        switch(element.tagName){
            case 'TEXTAREA':
            case 'SELECT':
            case 'INPUT':
                var _name = $this.attr('name');
                var _value = currentRow[_name];
                $this.val(_value);
                break;
        }
    });
}

//警告提示 先使用着
//针对input框 section只有单个input
function warn(section,warning) {
    clearWarn($('#'+section));
    $('#'+section).children('.col-md-4').last().after('<div class="col-md-3 has-error"><span class="help-block m-b-none"> <i class="fa fa-info-circle"></i>'+warning+'</span></div>');
    $('#'+section).find('input').attr('onfocus', 'clearWarn($(\'#'+section+'\'))');
    return false;
}

function clearWarn($secion){
    $secion.children('.has-error').remove();
    $secion.find('.has-error').remove();
}

//form表单校验
function myCheck(obj)
{
    for(var en in obj) //下面减一是因为数组的下标为0
    {
        var obj1 = obj[en];
        if(jQuery.isArray(obj[en])){
            for(var m in obj1){
                if(!myCheck(obj1[m])){
                    return false;
                };
            }

        }else{
            if(obj[en]!="" && obj[en]!=undefined && en!="outIndex" && en!="innerIndex")
            {
                return false;
            }
        }

    }
    return true;

}


function getJCDM_STR(type,value){
    var dataList = jcdmCode.getData();
    var resultList = [];
    switch (type)
    {
        case "jfxz":
            resultList = dataList.jfxzArr;
            break;
        case "zjlx":
            resultList = dataList.zjlxArr;
            break;
        case "jrfs":
            resultList = dataList.jrfsArr;
            break;
    }
    for(var n in resultList){
        if(resultList[n].id == value){
            return resultList[n].mc;
        }
    }
}

function js_export(value,id){
    var isIE = (navigator.userAgent.indexOf('MSIE') >= 0);
    if (isIE) {
        var strHTML = value;
        var winSave = window.open();
        winSave.document.open("text","utf-8");
        winSave.document.write(strHTML);
        winSave.document.execCommand("SaveAs",true,"核验结果.txt");
        winSave.close();
    } else {
        var elHtml = value;
        var mimeType =  'text/plain';
        $('#'+id).attr('href', 'data:' + mimeType  +  ';charset=utf-8,' + encodeURIComponent(elHtml));
        document.getElementById(id).click();
    }
}

function isEmptyForm(formId) {
    let data = $('#'+formId).formToJSON();
    let isEmpty=true;
    $.each(data, function(i, val) {
        if (val=='' || val==undefined || val==null){

        }else {
            isEmpty=false;
        }
    });
    return isEmpty;
}

//清除错误信息
function cleanErrorText(id){
    $("#"+id).find("label[class='control-label p-n error']").text('');
    $("#"+id).find("label[class='col-md-10 p-l-lg col-md-offset-2 text-danger']").text('');
    $("#"+id).find("label[class='col-md-8 p-l-lg col-md-offset-2 text-danger']").text('');
    $("#"+id).find("input").removeClass("error");
    $("#"+id).find("select").removeClass("error");
}

function approveUser(id) {

    $.ajax({
        url:"/user/approve",
        type:"POST",
        data:{"userId":id},
        async:false,
        dataType: 'json',
        success:function (data) {

        }
    });
}