/**
 * 机房主体信息页面
 *
 *
 **/
function getQueryParam(params){
	
    var query = "";
    query = $('#indexSearch').serializeObject();
    query.pageIndex = params.offset/params.limit+1;
    query.pageSize = params.limit;
    query.setmode = $('#setmode').val();
    query.business = $('#business').val();
    query.domainName = $('#domainName').val();
    query.startDate = $('#start').val();
    query.endDate = $('#end').val();
    return query;
}

var userService = {
    getTableColumns:function(type){
        var columns = [];

        columns = [{
            checkbox: true
        }, {
            field: 'unitName',
            title: '单位名称'
        }, {
            field: 'serviceContent',
            title: '服务内容',
            formatter:fwnrFormatter,
            width:'240px'
        }, {
            field: 'registerId',
            title: '备案号',
            width:'150px'
        }, {
            field: '',
            title: '服务域名',
            formatter:function(value,row,index){
                var result = "";
                for (var n in row.domainList){
                    result+="["+row.domainList[n].domainName+"]";
                }
                return result;
            },
            width:'120px'
        }, {
            field: 'setmode',
            title: '<span title="接入方式">接入方式</span>',
            width:'100px',
            formatter:function(value,row,inedx){
                if(value==1){
                    return "租用";
                }else if(value=2){
                    return "自建";
                }else{
                    return "其它";
                }
            }
        }, {
            field: 'business',
            title: '<span title="业务类型">业务类型</span>',
            width:'80px',
            formatter:function(value,row,inedx){
                if(value==1){
                    return "IDC业务";
                }else if(value=2){
                    return "ISP业务";
                }
            }
        }, {
                field: 'updateTime',
                title:  '<span title="更新时间">更新时间</span>',
            }];
        return columns;
    },
    initTable:function(){
    	initTable.initBoostrapTable("indexTable","list",userService.getTableColumns(),getQueryParam);
        //initTable.initBoostrapTable("indexTable","/rptUser/userService/list",userService.getTableColumns(),getQueryParam);
    },
    searchBtn:function(){
        $('#serviceIndexSearch').click(function(){
            initTable.refreshTable("indexTable","/rptUser/userService/list");
        });
    },
    clearDate:function(){
        $("#myModaladd input").val("");
        $("#myModaladd select").val("");
    },
    addNew:function(){
        AjaxValidator.cleanAllFormError('serviceForm');
        $("#unitNameAdd").removeAttrs("disabled");
        $(".removeGroup").parent().parent().remove();
        $("#sserviceTitle").text("新增");
        $("#myModaladd").find("h4").text("新增信息");
        $("#serviceId").val('');
        userService.clearDate();
        //隶属地市码
        var html ='<select  id="userServiceArea" class="form-control selectpicker " multiple data-live-search="false" name="areaCode" required>' +
            '                            </select>';
        $("#parentAreaCode").html(html);
        cselect.initSelectCommon("userServiceArea","/common/getSubOrdArea","");
        //单位名称
        var htmls ='<select  id="unitNameAdd" class="form-control selectpicker " multiple data-live-search="false" name="userId" required>' +
            '                            </select>';
        $("#unitNameSel").html(htmls);
        cselect.initSelectCommon("unitNameAdd","/common/getUnitNameList","",1);
        //接入方式
        cselect.initSelectJcdm('jrfs','setmodeAdd',null);
        //接入方式
        cselect.initSelectJcdm('wzbalx','regType',null);
        //服务类型
        var dataList = jcdmCode.getData().fwnrArr;
        var fwnrHtml = "";
        for(var i in dataList){
            fwnrHtml += ' <li value="'+dataList[i].id+'"><a>'+dataList[i].mc+'</a></li>';
        }
        $("#serviceContent").children().remove();
        $("#serviceContent").append(fwnrHtml);
        $("#serviceContent li").click(function () {
            if($(this).attr("class")=="active"){
                $(this).removeClass("active");
            }else{
                $(this).addClass("active");
            }
        });
        $("#myModaladd").modal('show');
    },
    refreshIndex:function(){
        initTable.refreshTable("indexTable","servicelist");
    },
    save:function(){
        AjaxValidator.cleanAllFormError('serviceForm');
        var serviceInfo =  $('#serviceForm').serializeObject();
        // serviceInfo.userId = $("#unitNameAdd").val();
        var conttents ="";
        $("#serviceContent").find(".active").each(function (index,item) {
            if(conttents==""){
                conttents=item.value;
            }else{
                conttents+=","+item.value;
            }
        });
        var validate = true;
        if(conttents==""){
            $("label[name='serviceContent_error']").text("请选择服务内容");
            validate = false;
        }
        if(serviceInfo.areaCode == undefined || serviceInfo.areaCode==""){
            $("label[name='areaCode_error']").text("请选择隶属单位地市码");
            validate = false;
        }
        if(serviceInfo.userId==undefined || serviceInfo.userId==null){
            $("label[name='unitName_error']").text("请选择单位名称");
            validate = false;
        }
        if(!$('#serviceForm').valid()){
            validate = false;
        }
        if(!validate){
            return false;
        }
        if(Array.isArray(serviceInfo.userId)){
            serviceInfo.userId = serviceInfo.userId[0];
        }
        if(Array.isArray(serviceInfo.areaCode)){
            serviceInfo.areaCode = serviceInfo.areaCode.join(",");
        }
        var userInfo = icom.auth.getUserInfo();
        var domains = [];
        if(jQuery.isArray(serviceInfo.domainList)){
            for(var n=0;n< serviceInfo.domainList.length;n++){
                var domainList = {};
                domainList.domainId = serviceInfo.domainId[n];
                domainList.domainName = serviceInfo.domainList[n];
                domainList.userId = serviceInfo.userId;
                domainList.createUserId = userInfo.userId;
                domainList.updateUserId = userInfo.userId;
                domains.push(domainList);
            }

        }else{
            if(serviceInfo.domainList!=""){
                var domainList = {};
                domainList.domainId = serviceInfo.domainId;
                domainList.domainName = serviceInfo.domainList;
                domainList.userId = serviceInfo.userId;
                domainList.createUserId = userInfo.userId;
                domainList.updateUserId = userInfo.userId;
                domains.push(domainList);
            }
        }
        serviceInfo.domainList = domains;
        serviceInfo.serviceContent = conttents;
        serviceInfo.cityCodeList = userInfo.userAreaCode.split(",");
        if(serviceInfo.serviceId==''){
            serviceInfo.createUserId = userInfo.userId;
        }
        serviceInfo.updateUserId = userInfo.userId;
        $.ajax({
            url: 'validate',
            type: 'POST',
            contentType: 'application/json',
            data:JSON.stringify(serviceInfo),
            async:false,
            dataType: 'json',
            success: function(data){
                var map=data.errorsArgsMap;
                if(jQuery.isEmptyObject(map)){
                    var url = '';
                    var title = '';
                    if(serviceInfo.serviceId==''){
                        url = 'save';
                        title = '新增成功';
                    }else{
                        url = 'update';
                        title = '修改成功';
                    }
                    $.ajax({
                        url: url,
                        type: 'POST',
                        contentType: 'application/json',
                        data:JSON.stringify(serviceInfo),
                        async:false,
                        dataType: 'json',
                        success:function (data) {
                            if(data.resultCode==0){
                                swal({
                                    title: title,
                                    text: "已经保存了所有记录",
                                    type: "success",
                                }, function(isConfirm) {
                                    if(isConfirm) {
                                        userService.refreshIndex();
                                        $("#myModaladd").modal("hide");
                                    }
                                })
                            }else {
                                swal({
                                    title: "保存失败",
                                    text: data.resultMsg,
                                    type: "success",
                                }, function(isConfirm) {
                                })
                            }
                        }})
                }else{
                    for (var attr in map) {
                        if(attr!="domainName"){
                            var error_id = attr+'_error';
                            $('#serviceForm').find("label[id="+error_id+"]").text(map[attr]);
                        }else{
                            swal({
                                title: "校验失败",
                                text: map[attr],
                                type: "error",
                            }, function(isConfirm) {
                            })
                        }
                    }
                    return false;
                }
            }
        });
    },
    editHouse:function(service){
        AjaxValidator.cleanAllFormError('serviceForm');
        $(".removeGroup").parent().parent().remove();
        $("#sserviceTitle").text("修改");
        $("#myModaladd").find("h4").text("修改信息");
        $("#serviceId").val(service.serviceId);
        //隶属地市码
        var html ='<select  id="userServiceArea" class="form-control selectpicker " multiple data-live-search="false" name="areaCode" required>' +
            '                            </select>';
        $("#parentAreaCode").html(html);
        //隶属地市码
        cselect.initSelectCommon("userServiceArea","/common/getSubOrdArea",service.areaCode.split(","));
        //单位名称
        var htmls = '<input type="text" class="form-control" readonly value="'+service.userId+'" name="userId" required>';
        $("#unitNameSel").html(htmls);
       /* cselect.initSelectSingle('unitNameAdd','/common/getUnitNameList',service.userId);
        $("#unitNameAdd").attr("disabled","disabled");*/
        //接入方式
        cselect.initSelectJcdm('jrfs','setmodeAdd',service.setmode);
        //网站备案类型
        cselect.initSelectJcdm('wzbalx','regType',service.regType);
        $("#serviceTypes").val(service.serviceType);
        $("#registerId").val(service.registerId);
        $("#businesss").val(service.business);
        //服务类型
        var dataList = jcdmCode.getData().fwnrArr;
        var fwnrHtml = "";
        var serviceContents = service.serviceContent.split(",");
        for(var i in dataList){
            var flag = false;
            for(var n in serviceContents){
                if(dataList[i].id == serviceContents[n]){
                    flag = true;
                    break;
                }
            }
            if(flag){
                fwnrHtml += ' <li value="'+dataList[i].id+'" class="active"><a>'+dataList[i].mc+'</a></li>';
            }else{
                fwnrHtml += ' <li value="'+dataList[i].id+'"><a>'+dataList[i].mc+'</a></li>';
            }
        }
        $("#serviceContent").children().remove();
        $("#serviceContent").append(fwnrHtml);
        $("#serviceContent li").click(function () {
            if($(this).attr("class")=="active"){
                $(this).removeClass("active");
            }else{
                $(this).addClass("active");
            }
        });
        //域名
        var domainHtml = "";
        for(var m=0;m<service.domainList.length;m++){
            if(m==0){
                $("#domain1").val(service.domainList[m].domainName);
                $("#domainId").val(service.domainList[m].domainId);
            }else{
                domainHtml +='<div class="form-group"><input type="hidden" name="domainId" value="'+service.domainList[m].domainId+'">' +
                    '                          <label class="col-md-2 control-label p-n"><span class="text-danger">*&nbsp;</span>服务域名</label>' +
                    '                          <div class="col-md-4">\n' +
                    '                            <input type="text" class="form-control" name="domainList" value="'+service.domainList[m].domainName+'" required>' +
                    '                          </div>' +
                    '                          <div class="help-block m-b-n"> <a class="removeGroup"><i class="fa fa-minus-circle"></i> 删除</a> </div>' +
                    '                          <label name="domainName_error" class="control-label p-n error"></label>'
            }
        }
        $("#domain1").parent().parent().after(domainHtml);
        //删除添加的组
        $(".removeGroup").click(function () {
            $(this).parent().parent().remove();
        });
        $("#myModaladd").modal('show');
    },
    initBtn:function(){
        //接入方式
        cselect.initSelectJcdm('jrfs','setmode',null);
        //服务内容
        cselect.initSelectJcdm('fwnr','searchContent',null);
        //首页时间查询条件
        icom.tpick.createTimePick().initDoubleDate("start","end",4);
        //新增按钮
        $("#serviceAddBt").click(function () {
            userService.addNew();
        });
        //新增保存按钮
        $("#btnAdd").click(function () {
            userService.save();
        });

        //表单里面的新增
        $(".addGroup").click(function  () {
            var addGroupHTML=$(this).parent().parent().clone();
            addGroupHTML.find("a").removeClass("addGroup").addClass("removeGroup").html("<i class=\'fa fa-minus-circle\'></i> 删除");
            addGroupHTML.find("input").val("");
            $(this).parent().parent().after(addGroupHTML);
            //删除添加的组
            $(".removeGroup").click(function () {
                $(this).parent().parent().remove();
            });
        });

        //批量删除
        $("#index_delete").click( function () {
            var serviceList =  $("#indexTable").bootstrapTable('getSelections');
            if(serviceList.length<=0){
                swal({
                    title: "请至少选择一条数据操作",
                }, function(isConfirm) {
                })
            }else{
                var ids = [];
                for(var n in serviceList){
                    ids.push(serviceList[n].serviceId);
                }
                userService.delete(ids);
            }
        });

    },
    delete:function(idarr){
        swal({
            title: "确定要删除这条信息吗",
            text: "删除后将无法恢复，请谨慎操作！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "是的，我要删除！",
            cancelButtonText: "让我再考虑一下…",
            closeOnConfirm: false,
            closeOnCancel: false
        }, function(isConfirm) {
            if(isConfirm) {
                $.ajax({
                    url:"delete",
                    type:"POST",
                    data:{"ids":idarr},
                    async:false,
                    dataType: 'json',
                    success:function (data) {
                        if(data.resultCode==0){
                            swal({
                                title: "",
                                text: "删除成功",
                                type: "success",
                            }, function(isConfirm) {
                                if(isConfirm) {
                                    userService.refreshIndex();
                                }
                            })
                        }else{
                            swal({
                                title: "删除失败",
                                text: data.resultMsg,
                                type: "error",
                            }, function(isConfirm) {
                                if(isConfirm) {
                                    houseInfo.refreshIndex();
                                }
                            })
                        }
                    }});
            } else {
                swal("已取消", "取消了删除操作！", "error")
            }
        });
    },
    init:function(){
    	userService.initTable();
    	userService.initBtn();
    	userService.initTable();
    	userService.searchBtn();
    }
};

userService.init();

function editService(index){
    var serviceList = $("#indexTable").bootstrapTable('getData');
    userService.editHouse(serviceList[index]);
}

function deleteRow(index){
    var serviceList = $("#indexTable").bootstrapTable('getData');
    var serviceId = serviceList[index].serviceId;
    var idarr = [];
    idarr.push(serviceId);
    userService.delete(idarr);
}