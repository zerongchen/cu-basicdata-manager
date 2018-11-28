/************
 * 用户虚拟机信息页面js
 *
 * *********/
edit = 0;
var stepValue=0;
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

    query.name = $("#name").val();
    query.networkAddress = $("#networkAddress").val();
    query.type = $("#type").val();
    return query;
}

var userVirtual = {
    getTableColumns:function(type){
        var columns = [];

        columns = [{
            checkbox: true
        }, {
            field: 'unitName',
            title: '单位名称',
        }, {
            field: 'houseName',
            title: '机房名称',
        }, {
            field: 'name',
            title: '虚拟主机名'
        }, {
            field: 'networkAddress',
            title: '网络地址',
        }, {
            field: 'type',
            title: '类型',
            formatter:function(value,row,inedx){
                if(value==1){
                    return "共享式";
                }else if(value==2){
                    return "专用式";
                }else if (value==3){
                    return "云虚拟";
                } else {
                    return "其它";
                }
            }
        }, {
            field: 'mgnAddress',
            title: '管理地址',
        }, {
            field: 'czlx',
            title: '操作类型',
            formatter:function(value,row,index){
            	if(value==1){
            		return "新增";
            	}else if(value==2){
            		return "变更";
            	}else if(value==3){
            		return "删除";
            	}
            }
        }, {
            field: 'dealFlag',
            title: '处理状态',
            formatter:dealFlagFormatter2
        } , {
            field: 'updateTime',
            title: '更新时间',
            formatter: dateFormatter
        }, {
            field: 'opll',
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
            }
        }];
        return columns;
    },

    initTable:function(){
        initTable.initBoostrapTable("indexTable","listData",userVirtual.getTableColumns(),getQueryParam,"commonButton");
    },
    searchBtn:function(){
        $('#serviceIndexSearch').click(function(){
            initTable.refreshTable("indexTable","listData");
        });
    },
    initSelect:function(){
        //首页时间查询条件
        icom.tpick.createTimePick().initDoubleDate("start","end",4);
        // 初始化机房下拉选
        cselect.initSelectSingle("houseId","/getHouseSelectInfo");
    },
    initClick:function(){
        $("#index_delete").on('click',deleteRows);
    },

    clearDate:function(){
        $("#myModaladd input").val("");
        $("#myModaladd select").val("");
    },

    refreshIndex:function(){
        initTable.refreshTable("indexTable","listData");
    },
    addNew:function(){
        $("#virtualForms").find("label.error").text("");
        $("#unitNameAdd").removeAttrs("disabled");
        $(".removeGroup").parent().parent().remove();
        $("#virtualTitle").html('<i class="fa fa-plus m-r-xs"></i>新增');
        $("#myModaladd").find("h4").text("新增信息");
        $("#virtualTitle").addClass('addTitle').parent().parent().show();
        $("#virtualId_sa").val('');
        $("select[name='areaCode']").chosen("destroy").init();
        //单位名称
        var htmls = '<select class="form-control"  multiple="multiple" id="unitNameAdd" name="userId" >\n' +
            '                            </select>';
        $("#unitNameSel").html(htmls);
        // cselect.initSelectCommon("unitNameAdd","/getUserSelectInfo?nature=1","",1);
        cselect.initUserNames('/getUserSelectInfo?nature=1&&setMode=1','unitNameAdd');

        //机房
        var html1 ='<select  id="houseIdAdd" class="form-control  "  name="houseId" required>' +
            '                            </select>';
        $("#houseIds").html(html1);
        cselect.initSelectCommon("houseIdAdd","/getHouseSelectInfo","",1,1);
        //隶属地市码
        var html ='<select  id="areaCodeEdit" class="form-control " name="areaCode" required>' +
            '                            </select>';
        $("#parentAreaCode").children().empty();
        $("#parentAreaCode").html(html);
        userVirtual.clearData();
        //隶属地市码事件绑定
        $("#unitNameAdd").change(function(val,index){
            var userIds = $("#unitNameAdd").val();
            var html ='<select  id="areaCodeEdit" class="form-control " name="areaCode" required>' +
                '                            </select>';
            $("#parentAreaCode").children().empty();
            $("#parentAreaCode").html(html);
            var userId = null;
            if(val.currentTarget.value!=null){
                userId = val.currentTarget.value;
                sel.loadAreaCodeSel("areaCodeEdit",null,null,userId);
            }
            /*if (val.selected!=undefined){
                // sel.loadAreaCodeSel("areaCodeEdit",houseId,null,userId);
                sel.loadAreaCodeSel("areaCodeEdit","",null,userId);
                // cselect.initAreaCode("areaCodeEdit","","",houseId,userId);
            }*/
        });

       /* $("#houseIdAdd").chosen().change(function(index,val){
            var userIds = $("#unitNameAdd").val();
            var html ='<select  id="areaCodeEdit" class="form-control " name="areaCode" required>' +
                '                            </select>';
            $("#parentAreaCode").children().empty();
            $("#parentAreaCode").html(html);
            var houseIds = $("#houseIdAdd").val();
            var userId = null;
            var houseId = null;
            if(userIds!=null){
                userId = userIds[0];
            }
            if(houseIds!=null){
                houseId=houseIds[0];
            }
            if (val.selected!=undefined){
                cselect.initAreaCode("areaCodeEdit","","",houseId,userId);
                // sel.loadAreaCodeSel("areaCodeEdit",houseId,null,userId);
            }
        });*/

        $("#addPlus").val(1);
        $("#myModaladd").modal('show');
    },
    save:function(){
        var validate = true;
        var url = '';
        var title = '';
        var query = new Array();
        var userInfo = icom.auth.getUserInfo();
        if($("#virtualId_sa").val()=="" || $("#virtualId_sa").val()==undefined){
            url = 'save';
            title = '新增成功，请确认是否数据上报';
            $("#virtualForms").find("label.error").text("");
            var allForm = $('#virtualForms').find('form');
            var form;
            var data;
            for (var i=0;i<allForm.length;i++){
                form =  allForm.eq(i);
                data = form.formToJSON();
                data.outIndex = i;
                if(!form.valid()){
                    if(data.areaCode == undefined || data.areaCode==""){
                        form.find("label[name='areaCode_error']").text("请选择隶属单位地市码");
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
                    form.find("label[name='areaCode_error']").text("请选择隶属单位地市码");
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
                query.push(data);
            }
        }else{
            url = 'update';
            title = '修改成功，请确认是否数据上报';
            form = $('#virtualForms').find('form');
            var data = $("#virtualForm").serializeObject();
            if(!$("#virtualForm").valid()){
                if(data.areaCode == undefined || data.areaCode==""){
                    form.find("label[name='areaCode_error']").text("请选择隶属单位地市码");
                }
                if(data.houseId == undefined || data.houseId==""){
                    form.find("label[name='houseId_error']").text("请选择机房");
                }
                return false;
            }
            if(data.areaCode == undefined || data.areaCode==""){
                form.find("label[name='areaCode_error']").text("请选择隶属单位地市码");
                validate = false;
            }
            if(data.houseId == undefined || data.houseId==""){
                form.find("label[name='houseId_error']").text("请选择机房");
                validate = false;
            }
            if(!validate){
                return false;
            }
            if(Array.isArray(data.areaCode)){
                data.areaCode = data.areaCode.join(",");
            }
            query.push(data);
        }
        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data:JSON.stringify(query),
            async:false,
            dataType: 'json',
            success:function (result) {
            	 $("label.error").text('');//先清空lable下error信息
                 if(result.resultCode==0 || result.resultCode==2){
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
                             userVirtual.doPreJud(userIds);
                         }
                         userVirtual.refreshIndex();
                         $("#myModaladd").modal("hide");
                     });
                   /*  swal({
                    	 title: title,
                         text: "已经保存了所有记录",
                         type: "success"
                     }, function(isConfirm) {


                        /!* if(isConfirm) {
                        	 userVirtual.refreshIndex();
                        	 $("#myModaladd").modal("hide");
                         }*!/
                     })*/
                 }else if(result.resultCode==3){
                   	 swal({
              	        title: "录入数据错误！",
              	        text: result.resultMsg,
              	        type: "error",
              	    });
                  }else{
                 	if(result == null||JSON.stringify(result)=='{}'){
                         swal({title: "保存失败",type: "error"})
                     }else{
                     	for (var idx in result.ajaxValidationResultMap) {
                     		 var map=result.ajaxValidationResultMap[idx].errorsArgsMap;
                              var error_id = "_error";
                              for (var attr in map) {
                            	  error_id = attr+'_error';
                              	if(idx!=1){
                              		$('#virtualForm').find("label[name="+error_id+"]").text(map[attr]);
                              	}else{
                              		$('#virtualForm'+idx).find("label[name="+error_id+"]").text(map[attr]);
                              	}
                              }
                     	}
                        
                     }
                 }
                /*if(data.resultCode!=1){
                    swal({
                        title: title,
                        text: "已经保存了所有记录",
                        type: "success",
                    }, function(isConfirm) {
                        if(isConfirm) {
                            userVirtual.refreshIndex();
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
                }*/
            }})
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
                        $('#virtualForms').find("label[name="+error_id+"]").eq(data.outIndex).text(map[attr]);
                    }
                    return false;
                }
            }
        });*/
    },
initbtn:function(){
    //新增按钮
    $("#virtualAddBt").click(function () {
        userVirtual.addNew();
    });
    //页面中新增事件绑定
    $(".addTitle").click(function () {
        var addTitleHTML=$(this).parent().parent().parent().clone();
        addTitleHTML.find("h5>a").removeClass("addTitle").addClass("removeTitleContent").html("<i class=\'fa fa-minus\'></i> 删除");

        stepValue = stepValue+1;
        $("#addPlus").val( stepValue);
        var id = "areaCodeEdit"+stepValue;
        var parent_id = "parentAreaCode"+stepValue;
        var nameId = "unitNameAdd"+stepValue;
        var houseId = "houseIdAdd" + stepValue;
        var nowId = "distributeTimeId_sa"+stepValue;
        var formId = addTitleHTML.find("form").attr('id')+stepValue;
        var unitNameSelId = 'unitNameSel'+stepValue;
        //表单id
        addTitleHTML.find("form").attr('id',formId);
        //隶属单位
        // addTitleHTML.find("#areaCodeEdit").next('div').remove();
        // addTitleHTML.find("#areaCodeEdit").attr('id',id).empty();
        addTitleHTML.find("#parentAreaCode").attr('id',parent_id);
        //单位名称
        addTitleHTML.find("#unitNameSel").attr('id',unitNameSelId);

        //机房
        addTitleHTML.find("#houseIdAdd").next('div').remove();
        addTitleHTML.find("#houseIdAdd").attr('id',houseId);

        addTitleHTML.find("input").val("");
        addTitleHTML.find("select").val("");
        $(this).parent().parent().parent().after(addTitleHTML);
        addTitleHTML.find("label.error").text('');
        
        addTitleHTML.find("select[name='areaCode']").chosen("destroy").init();
        // addTitleHTML.find("select[name='userId']").on("change",function(){
        // 	var value = addTitleHTML.find("form").formToJSON().userId;
        // 	var id = addTitleHTML.find("select[name='areaCode']").attr("id");
        // 	sel.loadAreaCodeSel(id,null,null,value);
        // });
        
        //cselect.initSelectCommon(id,'/common/getSubOrdArea',"");
        var html ='<select  id="'+id+'" class="form-control "  name="areaCode" required></select>';
        $("#"+parent_id).children().empty();
        $("#"+parent_id).html(html);
        var htmls = '<select class="form-control"  multiple="multiple" id="'+nameId+'" name="userId" >\n' +
            '                            </select>';
        $("#"+unitNameSelId).html(htmls);
        cselect.initSelectCommon(houseId,"/getHouseSelectInfo","",1,1);
        // cselect.initSelectCommon(nameId,"/getUserSelectInfo","",1);
        cselect.initUserNames('/getUserSelectInfo?nature=1&&setMode=1',nameId);
        $("#"+nameId).change(function(val,inedx){
            var html ='<select  id="'+id+'" class="form-control " name="areaCode" required>' +
                '</select>';
            $("#"+parent_id).children().empty();
            $("#"+parent_id).html(html);
            var userId = null;
            if(val.currentTarget.value!=null){
                userId = val.currentTarget.value;
                // cselect.initAreaCode(areaCodeId,"",1,houseId,userId,null,1);
                sel.loadAreaCodeSel(id,null,null,userId);
            }
        });

        /*$("#"+houseId).chosen().change(function(index,val){
            var userIds = $("#"+houseId).val();
            var houseIds = $("#"+nameId).val();
            var userid = null;
            var houseid = null;
            if(userIds!=null){
                userid = userIds[0];
            }
            if(houseIds!=null){
                houseid=houseIds[0];
            }
            var html ='<select  id="'+id+'" class="form-control" name="areaCode" required></select>';
            $("#"+parent_id).children().remove();
            $("#"+parent_id).html(html);
            if (val.selected!=undefined){
                // sel.loadAreaCodeSel(id,houseid,null,userid);
                cselect.initAreaCode(id,"","",houseid,userid);
            }
        });*/


        //删除添加的组
        $(".removeTitleContent").click(function () {
            $(this).parent().parent().parent().remove();
            stepValue = stepValue-1;
        });

        });

        //新增保存按钮
        $("#btnAdd").click(function () {
            userVirtual.save();
        });
        
      //用户选择级联改动地市码改动
      //   $("#unitNameSel").on("change",function(){
      //   	var value = $("#virtualForm").formToJSON().userId;
      //   	sel.loadAreaCodeSel("areaCodeEdit",null,null,value);
      //   });
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
    clearData:function () {
        $("#virtualForms").find("label.error").text("");
        $("#virtualForm input").val("");
        $("#virtualForm select").val("");
        $(".removeTitleContent").parent().parent().parent().remove();
    }
    ,
    editInfo:function(virtual){
        userVirtual.clearData();
        $("#unitNameAdd").attr("disabled","disabled");
        $(".removeGroup").parent().parent().remove();
        $("#virtualTitle").html('修改').parent().parent().hide();
        $("#myModaladd").find("h4").text("修改信息");
        $("#virtualTitle").removeClass('addTitle');
        $("#virtualId_sa").val(virtual.virtualId);
        $("#typeId").val(virtual.type);
        $("#mgnAddressId").val(virtual.mgnAddress);
        $("#nameId").val(virtual.name);
        $("#virtualNoId").val(virtual.virtualNo);
        $("#networkAddressId").val(virtual.networkAddress);
        edit++;
        //单位名称
        var htmls = '<input type="text" class="form-control" readonly value="'+virtual.unitName+'" required>' +
            '<input type="hidden" class="form-control" readonly value="'+virtual.userId+'" name="userId" required>';
        $("#unitNameSel").html(htmls);
        //机房
        var html1 ='<select  id="houseIdAdd" class="form-control  " name="houseId" required>' +
            '                            </select>';
        $("#houseIds").html(html1);
        cselect.initSelectCommon("houseIdAdd","/getHouseSelectInfo",[virtual.houseId],1,1);
       /* //隶属地市码
        var html ='<select  id="userhhArea" class="form-control selectpicker " multiple data-live-search="false" name="areaCode" required>' +
            '                            </select>';*/
       /* $("#parentAreaCode").html(html);*/
        var html ='<select  id="areaCodeEdit" class="form-control " name="areaCode" required>' +
            '                            </select>';
        $("#parentAreaCode").children().empty();
        $("#parentAreaCode").html(html);
        edit++;
        // sel.loadAreaCodeSel("areaCodeEdit",virtual.houseId,virtual.areaCode,virtual.userId);
        //cselect.initSelectCommon("areaCodeEdit",'/common/getAreaByUserId?userId='+virtual.userId,virtual.areaCode.split(","));
            '                            </select>';
        /*$("#parentAreaCode").html(html);
        cselect.initSelectCommon("userhhArea",'/common/getSubOrdArea',virtual.areaCode.split(","));
            '                            </select>';
        $("#parentAreaCode").html(html);*/
        // sel.loadAreaCodeSel("areaCodeEdit",virtual.areaCode.split(","),1,null,virtual.userId);
        cselect.initAreaCode("areaCodeEdit",virtual.areaCode.split(","),1,null,virtual.userId);
        $("#addPlus").val(1);
        $("#myModaladd").modal('show');
    },
    init:function(){
        userVirtual.initSelect();
        userVirtual.initTable();
        userVirtual.searchBtn();
        userVirtual.initClick();
        userVirtual.initbtn();
    }
};

userVirtual.init();


function editService(index){
    var serviceList = $("#indexTable").bootstrapTable('getData');
    userVirtual.editInfo(serviceList[index]);
}

/**
 * 删除单条记录
 * @param index
 */
function deleteRow(index){
    // 批量删除或者删除单条记录
    var serviceList = $("#indexTable").bootstrapTable('getData');
    var idArr = [];
    var userIdArr = [];
    var virtualId = serviceList[index].virtualId;
    var userId =serviceList[index].userId;
    idArr.push(virtualId);
    userIdArr.push(userId);
    batchDelete(idArr,userIdArr);

}

/**
 * 批量删除
 * @param index
 */
function deleteRows(){
    var idList =  $("#indexTable").bootstrapTable('getSelections');
    if(idList.length<=0){
        swal({
            title: "",
            text: "请至少选择一条数据操作",
            type: "success",
        }, function(isConfirm) {
        })
    }else{
        var idArr = [];
        var userIdArr = [];
        for(var n in idList){
            idArr.push(idList[n].virtualId);
            userIdArr.push(idList[n].userId);
        }
        batchDelete(idArr,userIdArr);
    }
}

function batchDelete(idArr,userIdArr) {
    swal({
        title: "确定要删除这条信息吗",
        text: "删除后将无法恢复，请谨慎操作！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是的，我要删除！",
        cancelButtonText: "取消",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function(isConfirm) {
        if(isConfirm) {
            $.ajax({
                url:"/uservirtual/batchDelete",
                type:"POST",
                data:{"ids":idArr},
                async:false,
                dataType: 'json',
                success:function (data) {
                    if(data.resultCode == 0 || data.resultCode == 2){
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
                            	userVirtual.doPreJud(userIdArr);
                            }
                            userVirtual.refreshIndex();
                        })
                    }else{
                        swal({
                            title: "删除失败",
                            text: data.resultMsg,
                            type: "error",
                        }, function(isConfirm) {
                            if(isConfirm) {
                                userVirtual.refreshIndex();
                            }
                        })
                    }
                }});
        } else {
            swal("已取消", "取消了删除操作！", "error")
        }
    });
}