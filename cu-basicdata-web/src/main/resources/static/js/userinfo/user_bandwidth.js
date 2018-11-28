
var stepValue=0;
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
    query.bandWidth = $('#bandWidth').val();
    query.distributeTime = $('#distributeTime').val();
    query.startDate = $('#start').val();
    query.endDate = $('#end').val();
    if($("#sel_house").val()!=null){
        query.houseIDs = $("#sel_house").val().join(",");
    }
    return query;
}

var userBandWidth = {
    getTableColumns:function(type){
        var columns = [];

        columns = [{
            checkbox: true
        }, {
            field: 'unitName',
            title: '单位名称',
        }, {
            field: 'houseName',
            title: '机房名称'
        }, {
            field: 'distributeTime',
            title: '资源分配日期',
            width:'150px'
        }, {
            field: 'bandWidth',
            title: '网络带宽(Mbps)',
            width:'150px'
        }, {
            field: 'czlx',
            title: '操作类型',
            formatter:czlxFormatter,
            width:'100px'
        }, {
            field: 'dealFlag',
            title: '处理状态',
            formatter:dealFlagFormatter2,
            width:'100px'
        } , {
                field: 'updateTime',
                title: '更新时间',
                formatter: dateFormatter,
                width:'150px'
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
                    	op+='<a title="修改" href="#" onclick="editBandWidth('+index+')" class="m-r"><i class="fa fa-edit fa-lg"></i></a>';
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
        initTable.initBoostrapTable("indexTable","bandwidthlist",userBandWidth.getTableColumns(),getQueryParam,"commonButton");
    },
    searchBtn:function(){
        $('#serviceIndexSearch').click(function(){
            initTable.refreshTable("indexTable","bandwidthlist");
        });
    },
    clearData:function(){
        $("#userHHChildForm input").val("");
        $("#userHHChildForm select").val("");
        $(".removeTitleContent").parent().parent().parent().remove();
    },
    addNew:function(){
        cleanErrorText("myModaladd");
        $("#unitNameAdd").removeAttrs("disabled");
        $(".removeGroup").parent().parent().remove();
        $("#bandWidthTitle").html('<i class="fa fa-plus m-r-xs"></i>新增');
        $("#myModaladd").find("h4").text("新增信息");
        $("#bandWidthTitle").addClass('addTitle').parent().parent().show();
        $("#bandWidthId_sa").val('');
        $("select[name='areaCode']").chosen("destroy").init();
        //隶属地市码
        var html ='<select  id="userServiceArea" class="form-control  "  name="areaCode" required></select>';
        $("#parentAreaCode").children().empty();
        $("#parentAreaCode").html(html);
        //单位名称
        /*var htmls ='<select  id="unitNameAdd" class="form-control selectpicker " multiple data-live-search="false" name="userId" required>' +
            '                            </select>';*/
        var htmls = '<select class="form-control"  multiple="multiple" id="unitNameAdd" name="userId" >\n' +
            '                            </select>';
        $("#unitNameSel").html(htmls);
        // cselect.initSelectCommon("unitNameAdd","/getUserSelectInfo","",1);
        cselect.initUserNames('/getUserSelectInfo','unitNameAdd');
        //机房
        var html1 ='<select  id="houseIdAdd" class="form-control  "  name="houseId" required>' +
            '                            </select>';
        $("#houseIds").html(html1);
        cselect.initSelectCommon("houseIdAdd","/getHouseSelectInfo","",1,1);

        $('#unitNameAdd').change(function(val,index){
            var html ='<select  id="userBandWidthArea" class="form-control " name="areaCode" required></select>';
            $("#parentAreaCode").children().empty();
            $("#parentAreaCode").html(html);
            var userId = null;
            if(val.currentTarget.value!=null){
                userId = val.currentTarget.value;
                sel.loadAreaCodeSel("userBandWidthArea",null,null,userId);
            }
        });

        userBandWidth.clearData();
        icom.tpick.createTimePick().initSingleDate("distributeTimeId_sa",4);
        $("#addPlus").val(1);
        $("#myModaladd").modal('show');
    },
    refreshIndex:function(){
        initTable.refreshTable("indexTable","bandwidthlist");
    },
    save:function(){
        cleanErrorText("myModaladd");
        var validate = true;
        var url = '';
        var title = '';
        var query = new Array();
        var userInfo = icom.auth.getUserInfo();
        if($("#bandWidthId_sa").val()=="" || $("#bandWidthId_sa").val()==undefined){
            url = 'save';
            title = '新增成功，请确认是否数据上报';
            var allForm = $('#hhForms').find('form');
            var form;
            var data;
            for (var i=0;i<allForm.length;i++){
                form =  allForm.eq(i);
                data = form.formToJSON();
                data.outIndex = i;
                if(!form.valid()){
                    if(data.areaCode == undefined || data.areaCode==""){
                        form.find("label[name='areaCode_error']").text("请选择隶属单位");
                    }
                    if(data.houseId == undefined || data.houseId==""){
                        form.find("label[name='houseId_error']").text("请选择机房");
                    }
                    if(data.userId == undefined || data.userId==""){
                        form.find("label[name='unitName_error']").text("请选择单位名称");
                    }
                    return false;
                }
                if(data.areaCode == undefined || data.areaCode==""){
                    form.find("label[name='areaCode_error']").text("请选择隶属单位");
                    validate = false;
                }
                if(data.houseId == undefined || data.houseId==""){
                    form.find("label[name='houseId_error']").text("请选择机房");
                    validate = false;
                }
                if(data.userId == undefined || data.userId==""){
                    form.find("label[name='unitName_error']").text("请选择单位名称");
                    validate = false;
                }
                if(!validate){
                    return false;
                }
                if(Array.isArray(data.areaCode)){
                    data.areaCode = data.areaCode.join(",");
                }
                
                /*data.createUserId = userInfo.userId;
                data.updateUserId = userInfo.userId;
                data.cityCodeList = userInfo.userAreaCode.split(",");*/
                query.push(data);
            }
        }else{
            url = 'update';
            title = '修改成功，请确认是否数据上报';
            var data = $("#userHHChildForm").serializeObject();
            if(!$("#userHHChildForm").valid()){
                if(data.areaCode == undefined || data.areaCode==""){
                    $("#userHHChildForm").find("label[name='areaCode_error']").text("请选择隶属单位");
                }
                if(data.houseId == undefined || data.houseId==""){
                    $("#userHHChildForm").find("label[name='houseId_error']").text("请选择机房");
                }
                return false;
            }
            if(data.areaCode == undefined || data.areaCode==""){
                $("#userHHChildForm").find("label[name='areaCode_error']").text("请选择隶属单位");
                validate = false;
            }
            if(data.houseId == undefined || data.houseId==""){
                $("#userHHChildForm").find("label[name='houseId_error']").text("请选择机房");
                validate = false;
            }
            if(!validate){
                return false;
            }
            if(Array.isArray(data.areaCode)){
                data.areaCode = data.areaCode.join(",");
            }
           /* data.updateUserId = userInfo.userId;
            data.cityCodeList = userInfo.userAreaCode.split(",");*/
            data.outIndex = 0;
            query.push(data);
        }
        /*$.ajax({
            url: 'validate',
            type: 'POST',
            contentType: 'application/json',
            data:JSON.stringify(query),
            async:false,
            dataType: 'json',
            success: function(data){
                var map=data.errorsArgsMap;
                if(jQuery.isEmptyObject(map)){
                    
                }else{
                    for (var attr in map) {
                        var error_id = attr+'_error';
                        $('#hhForms').find("label[name="+error_id+"]").eq(data.outIndex).text(map[attr]);
                    }
                    return false;
                }
            }
        });*/
        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data:JSON.stringify(query),
            async:false,
            dataType: 'json',
            success:function (data) {
                if(data.resultCode==0){
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
                            if(userIds.indexOf(query[n].userId)<0){
                                userIds.push(query[n].userId);
                            }
                        }
                        if(isConfirm) {
                            userBandWidth.doPreJud(userIds);
                        }
                        userBandWidth.refreshIndex();
                        $("#myModaladd").modal("hide");
                    });
                   /* swal({
                        title: title,
                        type: "success",
                    }, function(isConfirm) {

                        /!*if(isConfirm) {
                            userBandWidth.refreshIndex();
                            $("#myModaladd").modal("hide");
                        }*!/
                    })*/
                }else if(data.resultCode==3){
                  	 swal({
               	        title: "录入数据错误！",
               	        text: data.resultMsg,
               	        type: "error",
               	    });
                }else {
                	if(data.resultCode==1){
                		for (var idx in data.ajaxValidationResultMap) {
                            var error_id = idx+'_error';
                            var map = data.ajaxValidationResultMap[idx].errorsArgsMap
                       	 	for (var attr in map) {
                                var error_id = attr + '_error';
                                if(idx==0){
                                	$('#userHHChildForm').find("label[name="+error_id+"]").text(map[attr]);
                                }else{
                                	$('#userHHChildForm' + idx).find("label[name="+error_id+"]").text(map[attr]);
                                }
                            }
                        }
                		/*swal({
                            title: "保存失败",
                            text: data.resultMsg,
                            type: "success",
                        }, function(isConfirm) {
                        	
                        })*/
                	}
                    
                }
            }})
    },
    initBtn:function(){

        //首页时间查询条件
        icom.tpick.createTimePick().initDoubleDate("start","end",4);
        icom.tpick.createTimePick().initSingleDate("distributeTime",4);
        //机房下拉框
        var house_sel = icom.rsel.createRichSelect("sel_house",{
            language: "zh-CN", //提示语言
            width:'200px',
            minimumInputLength: 0,//最小需要输入多少个字符才进行查询,或者不写
            placeholder:"请选择",
            allowClear:true,//重新加载是否清空
            //maximumSelectionLength: 3, //最多选择个数
            ajax: {
                url: '/getHouseSelectInfo',
                data: function (params) {
                    var query = {
                        houseName: params.term  //插件固定参数 term:输入框的值, _type:"query"
                    };
                    // Query parameters will be ?search=[term]&type=public
                    return query;
                },
                processResults: function(data, params) {
                    let results = new Array();
                    $.each(data, function(i, n){
                        results.push({id:n.value,text:n.title})
                    });
                    return {
                        results: results  //必须赋值给results并且必须返回一个obj
                    };
                }
            }
        });
        house_sel.render();
        //新增按钮
        $("#bandWidthAddBt").click(function () {
            userBandWidth.addNew();
        });
        //页面中新增事件绑定
        $(".addTitle").click(function () {
            var addTitleHTML=$(this).parent().parent().parent().clone();
            addTitleHTML.find("h5>a").removeClass("addTitle").addClass("removeTitleContent").html("<i class=\'fa fa-minus\'></i> 删除");
            stepValue = stepValue+1;
            $("#addPlus").val( stepValue);
            var id = "parentAreaCode"+stepValue;
            var nameId = "unitNameAdd"+stepValue;
            var houseId = "houseIdAdd" + stepValue;
            var formId = addTitleHTML.find("form").attr('id')+stepValue;
            var areaCodeId = "userBandWidthArea"+stepValue;
            var unitNameSelId = 'unitNameSel'+stepValue;
            //表单id
            addTitleHTML.find("form").attr('id',formId);
            //隶属单位
            addTitleHTML.find("#parentAreaCode").attr('id',id);
            //单位名称
            addTitleHTML.find("#unitNameSel").attr('id',unitNameSelId);

            //机房
            addTitleHTML.find("#houseIdAdd").next('div').remove();
            addTitleHTML.find("#houseIdAdd").attr('id',houseId);
            //日期
            var nowId = "distributeTimeId_sa"+stepValue;
            addTitleHTML.find('#distributeTimeId_sa').attr('id',nowId);
            addTitleHTML.find('#distributeTimeId_sa').removeAttr("lay-key");
            addTitleHTML.find("input").val("");
            addTitleHTML.find("select").val("");
            $(this).parent().parent().parent().after(addTitleHTML);
            addTitleHTML.find("label.error").text('');
            //隶属地市码
            var html ='<select  id="'+areaCodeId+'" class="form-control " name="areaCode" required>' +
                '                            </select>';
            $("#"+id).children().empty();
            $("#"+id).html(html);
            var htmls = '<select class="form-control"  multiple="multiple" id="'+nameId+'" name="userId" >\n' +
                '                            </select>';
            $("#"+unitNameSelId).html(htmls);
            cselect.initSelectCommon(houseId,"/getHouseSelectInfo","",1,1);
            cselect.initUserNames('/getUserSelectInfo?nature=1',nameId);
            // cselect.initSelectCommon(,"/getUserSelectInfo","",1);

            $('#'+nameId).change(function(val,index){
                var html ='<select  id="'+areaCodeId+'" class="form-control  "  name="areaCode" required></select>';
                $("#"+id).children().empty();
                $("#"+id).html(html);
                var userId = null;
                if(val.currentTarget.value!=null){
                    userId = val.currentTarget.value;
                    // cselect.initAreaCode(areaCodeId,"",1,houseId,userId,null,1);
                    sel.loadAreaCodeSel(areaCodeId,null,null,userId);
                }
            });

            icom.tpick.createTimePick().initSingleDate(nowId,4);
            //删除添加的组
            $(".removeTitleContent").click(function () {
                $(this).parent().parent().parent().remove();
                stepValue = stepValue -1;
            });

        });

        //新增保存按钮
        $("#btnAdd").click(function () {
            userBandWidth.save();
        });
        
        
        $("#distributeTimeId_sa").click(function(){
        	$("#layui-laydate4").click(function(){
        		var value = $("#distributeTimeId_sa").val();
        		if(value!=null&&value!=''){
        			$("#distributeTime_error").text('');
        		}
            });
        });
        
/*        //用户选择级联改动地市码改动
        $("#unitNameSel").on("change",function(){
        	var value = $("#userHHChildForm").formToJSON().userId;
        	sel.loadAreaCodeSel("areaCodeEdit",null,null,value);
        });*/
        
        //批量删除
        $("#index_delete").click( function () {
            var banwidthList =  $("#indexTable").bootstrapTable('getSelections');
            if(banwidthList.length<=0){
                swal({
                    title: "请至少选择一条数据操作",
                }, function(isConfirm) {
                })
            }else{
                var ids = [];
                var userIdArr = [];
                for(var n in banwidthList){
                    ids.push(banwidthList[n].hhId);
                    userIdArr.push(banwidthList[n].userId);
                }
                userBandWidth.delete(ids,userIdArr);
            }
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
    delete:function(ids,userIdArr){
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
        }, function (isConfirm) {
        	if (isConfirm) {
                $.ajax({
                    url:"delete",
                    type:"POST",
                    data:{"hhIds":ids},
                    async:false,
                    dataType: 'json',
                    success:function (result) {
                    	if(result.resultCode == 0 || result.resultCode == 2){
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
                                	userBandWidth.doPreJud(userIdArr);
                                }
                                userBandWidth.refreshIndex();
                            })
                        }else{
                            swal({
                                title: "删除失败",
                                text: data.resultMsg,
                                type: "error",
                            }, function(isConfirm) {
                                if(isConfirm) {
                                    userBandWidth.refreshIndex();
                                }
                            })
                        }
                    }});
            } else {
                swal("已取消", "取消了删除操作！", "error")
            }
        });
    },
    editInfo:function(bandWidth){
        userBandWidth.clearData();
        cleanErrorText("myModaladd");
        $("#unitNameAdd").attr("disabled","disabled");
        $(".removeGroup").parent().parent().remove();
        $("#bandWidthTitle").html('修改').parent().parent().hide();
        $("#myModaladd").find("h4").text("修改信息");
        $("#bandWidthTitle").removeClass('addTitle');
        $("#bandWidthId_sa").val(bandWidth.hhId);
        $("#bandWidthId").val(bandWidth.bandWidth);
        //单位名称
        var htmls = '<input type="text" class="form-control" readonly value="'+bandWidth.unitName+'" name="unitName" required><input type="hidden" name="userId" value="'+bandWidth.userId+'">';
        $("#unitNameSel").html(htmls);
        //机房
        var html1 ='<select  id="houseIdAdd" class="form-control "  name="houseId" required>' +
            '                            </select>';
        $("#houseIds").html(html1);
        cselect.initSelectCommon("houseIdAdd","/getHouseSelectInfo",[bandWidth.houseId],1,1);
        //隶属地市码
        var html ='<select  id="userBandWidthArea" class="form-control " name="areaCode" required>' +
            '                            </select>';
        $("#parentAreaCode").children().empty();
        $("#parentAreaCode").html(html);
        //隶属地市码
        cselect.initAreaCode("userBandWidthArea",bandWidth.areaCode.split(","),1,null,bandWidth.userId,null,1);
        icom.tpick.createTimePick().initSingleDate("distributeTimeId_sa",4);
        $("#distributeTimeId_sa").val(bandWidth.distributeTime);
        $("#addPlus").val(1);
        $("#myModaladd").modal('show');
    },
    init:function(){
        userBandWidth.initBtn();
        userBandWidth.initTable();
        userBandWidth.searchBtn();
    }
};

userBandWidth.init();

function editBandWidth(index){
    var bandList = $("#indexTable").bootstrapTable('getData');
    userBandWidth.editInfo(bandList[index]);
}

function deleteRow(index){
    var bandList = $("#indexTable").bootstrapTable('getData');
    var hhId = bandList[index].hhId;
    var userId = bandList[index].userId;
    var idarr = [];
    var userIdArr = [];
    idarr.push(hhId);
    userIdArr.push(userId);
    userBandWidth.delete(idarr,userIdArr);
}

