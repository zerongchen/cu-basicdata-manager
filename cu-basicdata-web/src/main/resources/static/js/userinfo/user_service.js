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
            formatter:fwnrFormatter
        }, {
            field: 'registerId',
            title: '备案号'
        }, {
            field: '',
            title: '服务域名',
            formatter:function(value,row,index){
                var result = "";
                for (var n in row.domainList){
                    result+="["+row.domainList[n].domainName+"]";
                }
                return result;
            }
        }, {
            field: 'setmode',
            title: '<span title="接入方式">接入方式</span>',
            formatter:function(value,row,index){
                return getJCDM_STR('jrfs',value);
            },
            width:'80px'
        }, {
            field: 'business',
            title: '<span title="业务类型">业务类型</span>',
            formatter:businessFormatter,
            width:'80px'
        }, {
            field: 'czlx',
            title: '<span title="操作类型">操作类型</span>',
            formatter:czlxFormatter,
            width:'80px'
        }, {
            field: 'dealFlag',
            title: '<span title="处理状态">处理状态</span>',
            formatter:dealFlagFormatter2,
            width:'80px'
        } , {
                field: 'updateTime',
                title:  '<span title="更新时间">更新时间</span>',
                formatter: dateFormatter,
                width:'110px'
            }, {
                field: 'oplll',
                title: '操作',
                formatter:function(value,row,index){
                	var op = '';
                	var updateRole=$("#updateRole").val();
                    var delRole=$("#delRole").val();
                    if(row.czlx==3){
                        return '';
                    }
                    if(updateRole==1){
                    	op+='<a title="修改" href="#" onclick="editService('+index+')" class="m-r"><i class="fa fa-edit fa-lg"></i></a>';
                    }
                    if(delRole==1){
                    	op+='<a title="删除" href="#" onclick="deleteRow('+index+')" class="m-r"><i class="fa fa-close fa-lg"></i></a>';
                    }
                    return op;
                },
            width:'100px'
            }];
        return columns;
    },
    initTable:function(){
        initTable.initBoostrapTable("indexTable","servicelist",userService.getTableColumns(),getQueryParam,"commonButton");
    },
    searchBtn:function(){
        $('#serviceIndexSearch').click(function(){
            initTable.refreshTable("indexTable","servicelist");
        });
    },
    clearDate:function(){
        $("#myModaladd input").val("");
        $("#myModaladd select").val("");
    },
    addNew:function(){
        cleanErrorText("serviceForm");
        $("#serviceForm input").val("");
        $("#serviceForm select").val("");
        $("#unitNameAdd").removeAttrs("disabled");
        $(".removeGroup").parent().parent().remove();
        /*$("#sserviceTitle").text("新增");*/
        $("#myModaladd").find("h4").text("新增信息");
        $("#serviceId").val('');
        userService.clearDate();
        //隶属地市码
        var html ='<select  id="userServiceArea" class="form-control selectpicker " multiple data-live-search="false" name="areaCode" required>' +
            '                            </select>';
        $("#parentAreaCode").html(html);
        cselect.initAreaCode("userServiceArea","",1,"","",null);
      //单位名称
        var htmls = '<select class="form-control"  multiple="multiple" id="unitNameAdd" name="userId" >\n' +
            '                            </select>';
        $("#unitNameSel").html(htmls);
        // cselect.initSelectCommon("unitNameAdd","/getUserSelectInfo?nature=1","",1);
        cselect.initUserNames('/getUserSelectInfo?nature=1','unitNameAdd');
        $('#unitNameAdd').change(function (index,val) {
        	var userIds = $("#unitNameAdd").val();
            var html ='<select  id="userServiceArea" class="form-control selectpicker " multiple data-live-search="false" name="areaCode" required>' +
                '                            </select>';
            $("#parentAreaCode").html(html);
            if(userIds!=null){
            	cselect.initAreaCode("userServiceArea","",1,"",userIds[0],null);
            }
        });

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
        cleanErrorText("serviceForm");
        var query = new Array();
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
            $("label[name='areaCode_error']").text("请选择隶属单位");
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
                // domainList.domainId = serviceInfo.domainId[n];
                domainList.domainName = serviceInfo.domainList[n];
                domainList.userId = serviceInfo.userId;
                domainList.createUserId = userInfo.userId;
                domainList.updateUserId = userInfo.userId;
                domains.push(domainList);
            }

        }else{
            if(serviceInfo.domainList!=""){
                var domainList = {};
                // domainList.domainId = serviceInfo.domainId;
                domainList.domainName = serviceInfo.domainList;
                domainList.userId = serviceInfo.userId;
                domainList.createUserId = userInfo.userId;
                domainList.updateUserId = userInfo.userId;
                domains.push(domainList);
            }
        }
        serviceInfo.domainList = domains;
        serviceInfo.serviceContent = conttents;
        /*serviceInfo.cityCodeList = userInfo.userAreaCode.split(",");*/
        if(serviceInfo.serviceId==''){
            serviceInfo.createUserId = userInfo.userId;
        }
        serviceInfo.updateUserId = userInfo.userId;
        delete serviceInfo.domainId;
        serviceInfo.outIndex = 0;

        query.push(serviceInfo);

        var url = '';
        var title = '';
        if(serviceInfo.serviceId==''){
            url = '/userservice/save';
            title = '新增成功，请确认是否数据上报';
        }else{
            url = '/userservice/update';
            title = '修改成功，请确认是否数据上报';
        }

        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data:JSON.stringify(query),
            async:false,
            dataType: 'json',
            success:function (result) {
                if(result.resultCode==0){
                    swal({
                        title: title,
                        type: "success",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        showCancelButton: true,
                        closeOnCancel: true,
                        closeOnConfirm: true
                    }, function(isConfirm) {
                        var userIds = new Array();
                        for(var n in query){
                            userIds.push(query[n].userId);
                        }
                        if(isConfirm) {
                            userService.doPreJud(userIds);
                        }
                        userService.refreshIndex();
                        $("#myModaladd").modal("hide");
                    });
                  /*  swal({
                        title: title,
                        type: "success",
                    }, function(isConfirm) {
                        if(isConfirm) {
                            userService.refreshIndex();

                        }
                    })*/
                }else if(result.resultCode==3){
                 	 swal({
                	        title: "录入数据错误！",
                	        text: result.resultMsg,
                	        type: "error",
                	    });
                 }else {
                    if(result == null||JSON.stringify(result)=='{}'){
                        swal({title: "保存失败",type: "error"})
                    }else{
                        for (var idx in result.ajaxValidationResultMap) {
                            //console.log(idx+'@@@@@');
                            var map=result.ajaxValidationResultMap[idx].errorsArgsMap;
                            var error_id = "_error";
                            for (var attr in map) {
                                error_id = attr+'_error';
                                if(attr!="domainName" && attr!="domainList"){
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
                               /* if(idx==0){
                                    $('#serviceForm').find("label[id="+error_id+"]").text(map[attr]);
                                }else{
                                    var a=idx+1;
                                    $('#serviceForm'+a).find("label[id="+error_id+"]").text(map[attr]);
                                }*/

                            }
                        }
                    }
                }
            }});

        /*$.ajax({
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
        });*/
    },
    editHouse:function(service){
        cleanErrorText("serviceForm");
        $("#serviceForm input").val("");
        $("#serviceForm select").val("");
        $(".removeGroup").parent().parent().remove();
        /*$("#sserviceTitle").text("修改");*/
        $("#myModaladd").find("h4").text("修改信息");
        $("#serviceId").val(service.serviceId);
        //隶属地市码
        var html ='<select  id="userServiceArea" class="form-control selectpicker " multiple data-live-search="false" name="areaCode" required>' +
            '                            </select>';
        $("#parentAreaCode").html(html);
        //隶属地市码
        cselect.initAreaCode("userServiceArea",service.areaCode.split(","),1,"",service.userId,null);

        // sel.loadAreaCodeSel("userServiceArea",virtual.houseId,virtual.areaCode,virtual.userId);

        //单位名称
        var htmls = '<input type="hidden" class="form-control" readonly value="'+service.userId+'" name="userId" required>' +
            '<input type="text" class="form-control" readonly value="'+service.unitName+'" name="unitName" required>';
        $("#unitNameSel").html(htmls);
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
                    '                          <label class="col-md-2 control-label p-n">服务域名</label>' +
                    '                          <div class="col-md-4">\n' +
                    '                            <input type="text" class="form-control" name="domainList" value="'+service.domainList[m].domainName+'" required>' +
                    '                          </div>' +
                    '                          <div class="col-md-1 help-block m-t-none"> <a class="removeGroup"><i class="fa fa-minus-circle"></i> 删除</a> </div>' +
                    '                          <label name="domainName_error" class="control-label p-n error"></label></div>'
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
                var userIdArr = [];
                for(var n in serviceList){
                    ids.push(serviceList[n].serviceId);
                    userIdArr.push(serviceList[n].userId);
                }
                userService.delete(ids,userIdArr);
            }
        });
        //接入方式选择绑定事件
        $("#setmodeAdd").change(function () {
            var html = '<option value="">请选择</option>\n' +
                '                              <option value="1">IDC业务</option>\n' +
                '                              <option value="2">ISP业务</option>';
            if($("#setmodeAdd").val()==0){
                html = '<option value="">请选择</option>\n' +
                    '                              <option value="2">ISP业务</option>';
            }
            $("#businesss").children().remove();
            $("#businesss").append(html);
        });
    },doPreJud:function(ids){
        $.ajax({
            url:"/user/batchApprove",
            type:"POST",
            data:{"userIds":ids},
            async:false,
            dataType: 'json',
            success:function (data) {
            }
        });
    },
    delete:function(idarr,userIdArr){
        swal({
            title: "确定要删除这条信息吗",
            text: "删除后将无法恢复，请谨慎操作！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "是的，我要删除！",
            cancelButtonText: "取消",
            closeOnConfirm: false,
            closeOnCancel: true
        }, function(isConfirm) {
            if(isConfirm) {
                $.ajax({
                    url:"delete",
                    type:"POST",
                    data:{"ids":idarr},
                    async:false,
                    dataType: 'json',
                    success:function (result) {
                        if(result.resultCode == 0){
                            swal({
                            	title: "删除成功，请确认是否数据上报!",
                                type: "success",
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                showCancelButton: true,
                                closeOnCancel: true,
                                closeOnConfirm: true
                            }, function(isConfirm) {
                                if(isConfirm) {
                                	userService.doPreJud(userIdArr);
                                }
                                userService.refreshIndex();
                            })
                        }else{
                            swal({title: "删除失败",type: "error"})
                        }
                    }});
            }
        });
    },
    init:function(){
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
    var userId = serviceList[index].userId;
    var idarr = [];
    var userIdArr = [];
    idarr.push(serviceId);
    userIdArr.push(userId);
    userService.delete(idarr,userIdArr);
}