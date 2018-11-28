edit = 0;
var frameList = [];
$(function(){

    icom.tpick.createTimePick().initDoubleDate("start","end",4);

    loadSelectHouse('sel_house');

    $("#infotable").bootstrapTable('destroy').bootstrapTable({
        method: 'post',
        url: '/serviceapi/pre/house/rack/query',
        queryParams: getQueryParam,
        contentType: 'application/x-www-form-urlencoded',
        striped: true,
        undefinedText: '',
        showColumns: !0,
        toolbar: "#commonButton",
        pagination: true,
        sidePagination: 'server',
        iconSize: "outline",
        icons: {
            columns: "glyphicon-list",
        },
        clickToSelect:true,
        pageSize: 10,
        pageList: [10, 25, 50, 100, 200],
        uniqueId:'frameId',
        columns: [{field: '' ,checkbox:true},
            {field: 'frameId',title: '机架ID',visible:false},
            {field: 'houseName',title: '机房名称'},
            {field: 'frameName',title: '机架/机位名称'},
            {field: 'unitName',title: '单位名称',formatter:userNameFormatter},
            {field: 'useType',title: '使用类型',width:'75px',formatter: useTypeFormatter},
            {field: 'distribution',title: '分配状态',width:'75px',formatter: distributionFormatter},
            {field: 'occupancy',title: '占用状态',width:'75px',formatter: occupancyFormatter},
            {field: 'czlx',title: '操作类型',width:'75px',formatter: czlxFormatter},
            {field: 'dealFlag',title: '处理状态',width:'100px',formatter: dealFlagFormatter2},
            {field: 'updateTime',title: '更新时间',width:'100px',formatter: dateFormatter},
            {field: 'operating',title: '操作',width:'65px',formatter: operateFormatter}
        ]
    });


    function getQueryParam(params){
        var query = "";
        query = $('#searchForm').serializeObject();
        if($("#sel_house").val()!=null){
            query.houseIDs = $("#sel_house").val().join(",");
            query.houseId='';
        }
        query.pageIndex = params.offset/params.limit+1;
        query.pageSize = params.limit;
        query.czlx = $('#czlx').val();
        query.unitName = $('#userNameQuery').val();
        query.useType = $('#useType').val();
        query.occupancy = $('#occupancy').val();
        query.startDate = $('#start').val();
        query.endDate = $('#end').val();
        return query;
    }

    $('#searchBtn').click(function(){
        $("#infotable").bootstrapTable('refresh')
    });

    //新增
    $('#btnAdd').on('click',function(e){
        e.preventDefault();
        $("label.error").text('');
        $("label[name='areaCode_error']").text("");
        var valid=addValidate();
        if(valid){
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/serviceapi/pre/house/rack/insert',
                contentType: 'application/json',
                data: JSON.stringify(frameList),
                success : function(result){
                    if(result.resultCode==0){
                        var houseIds=[];
                        $.each(frameList,function(index,value){
                            if($.inArray(value.houseId,houseIds)==-1) {
                                houseIds.push(value.houseId);
                            }
                        });
                        swal({
                            title: "新增成功，请确认是否数据上报",
                            type: "success",
                            showCancelButton: true,
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            closeOnConfirm: true,
                            closeOnCancel: true
                        }, function(isConfirm) {
                            if(isConfirm) {
                                $.ajax({
                                    url:'/houseinfo/preJudHouse',
                                    type:"post",
                                    dataType: 'json',
                                    data: {'houseIds' : houseIds},
                                    success:function(result){
                                        window.location.href = '/houseinfo/houseRack';
                                    }
                                });
                            }else{
                                window.location.href = '/houseinfo/houseRack';
                            }
                        })

                        /*swal({
                            title: "新增成功，请进行机房主体数据上报",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonText: "确定",
                            closeOnConfirm: true
                        }, function(isConfirm) {
                            if(isConfirm) {
                                window.location.href = '/houseinfo/houseRack';
                            }
                        })*/
                    } else if(result.resultCode==3){
                   	 swal({
             	        title: "录入数据错误！",
             	        text: result.resultMsg,
             	        type: "warning",
             	    });
                    }else{
                    	if(result == null||JSON.stringify(result)=='{}'){
                            swal({title: "保存失败",type: "error"})
                        }else{
                            var errorMsg = "";
                        	for (var idx in result.ajaxValidationResultMap) {
                       		 var map=result.ajaxValidationResultMap[idx].errorsArgsMap;
                                var error_id = "_error";
                                for (var attr in map) {
                                	error_id = attr+'_error';
                                	if(idx!=1){
                                		$('#framChildForm').find("label[id="+error_id+"]").text(map[attr]);
                                	}else{
                                		$('#framChildForm'+idx).find("label[id="+error_id+"]").text(map[attr]);
                                	}

                                    if(errorMsg==""){
                                        errorMsg = map[attr];
                                    }else{
                                        errorMsg = errorMsg +"<br/>"+ map[attr];
                                    }
                                }
                       	    }
                            swal({title: "校验失败",text: errorMsg,type: "error",html:true})
                        }
                    }

                }
            });
        }

    });

    $('#btnEdit').on('click',function(e){
        e.preventDefault();
        var data = editValidate();
        var valid=$("#editForm").validate().form();
        $("label.error").text('');
        if(valid) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/serviceapi/pre/house/rack/update',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (result) {
                    if (result.resultCode == 0) {
                        var houseIds=[];
                        houseIds.push($('#editForm').find("input[name='houseId']").val());
                        swal({
                            title: "修改成功，请确认是否数据上报",
                            type: "success",
                            showCancelButton: true,
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            closeOnConfirm: true,
                            closeOnCancel: true
                        }, function(isConfirm) {
                            if(isConfirm) {
                                $.ajax({
                                    url:'/houseinfo/preJudHouse',
                                    type:"post",
                                    dataType: 'json',
                                    data: {'houseIds' : houseIds},
                                    success:function(result){
                                        window.location.href = '/houseinfo/houseRack';
                                    }
                                });
                            }else{
                                window.location.href = '/houseinfo/houseRack';
                            }
                        })

                        /*swal({
                            title: "修改成功，请进行机房主体数据上报",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonText: "确定",
                            closeOnConfirm: true
                        }, function (isConfirm) {
                            if (isConfirm) {
                                window.location.href = '/houseinfo/houseRack';
                            }
                        })*/
                    } else {
                    	if(result.ajaxValidationResultMap==null||JSON.stringify(result.ajaxValidationResultMap)=='{}'){
                            swal({title: "修改失败",type: "error"})
                        }else{
                             var errorMsg = "";
                        	 var error_id = '_error';
                        	 var map = result.ajaxValidationResultMap[0].errorsArgsMap;
                        	 for (var attr in map) {
                        		 if(attr=='startIp:endIp'){
                        			error_id = 'endIP_error';
                        		 }else{
                        			error_id = attr +error_id;
                        		 }
                                 $('#editForm').find("label[id="+error_id+"]").text(map[attr]);

                                 if(errorMsg==""){
                                     errorMsg = map[attr];
                                 }else{
                                     errorMsg = errorMsg +"<br/>"+ map[attr];
                                 }

                            }
                            swal({title: "校验失败",text: errorMsg,type: "error",html:true})
                            /*var map=result.ajaxValidationResult.errorsArgsMap;
                            for (var attr in map) {
                                var error_id = attr+'_error';
                                $('#addForm').find("label[id="+error_id+"]").text(map[attr]);
                            }*/
                        }
                    }

                }
            });
        }
    });

    //新增取消
    $('#btnCancel').on('click',function(e){
        $("#houseId_add").chosen("destroy");
        $("#areaCodeAdd").chosen("destroy");
        $("#framChildForm input,select").each(function(){
            $(this).val('');
        });
        var num = $("#idPlus").val();
        if(num>1){
            for (var i=1;i<num;i++){
                $("#framChildForm"+i).parent().parent().parent().remove();
            }
        }
    });

    $('#btnCancelEdit').on('click',function(e){
        $("#areaCodeEdit").chosen("destroy");
        $("#editForm input,select").each(function(){
            $(this).val('');
        });
    });

    //h5标题的新增
    $(".addTitle").click(function () {
        var addTitleHTML=$(this).parent().parent().parent().clone();
        var num = $("#idPlus").val();
        var insertNum = parseInt(num)+1;
        $("#idPlus").val( parseInt(num)+1);
        var formId = addTitleHTML.find("form").attr('id');
        formId = formId + num;
        addTitleHTML.find("form").attr('id',formId);

        //单位名称联想输入框初始化
        var unitNameId = "";
        var num2 = $("#userNameIds").val();
        $("#userNameIds").val( parseInt(num2)+1);
        unitNameId = "useNameAdd_frame"+num2;
        addTitleHTML.find("#useNameAdd_frame").attr("id",unitNameId);

        //var id="areaCodeAdd"+insertNum;
        //隶属单位
        var id = addTitleHTML.find(".selectpicker").attr('id');
        id = id+insertNum;
        // addTitleHTML.find(".selectpicker").attr('id',id);
        // addTitleHTML.find(".selectpicker").next('div').remove();

        addTitleHTML.find("h5>a").removeClass("addTitle").addClass("removeTitleContent").html("<i class=\'fa fa-minus\'></i> 删除");
        addTitleHTML.find("select[name='houseId']").next().remove(); //清除机房控件div
        $(this).parent().parent().parent().after(addTitleHTML);
        if(unitNameId!=""){
            inputInit(unitNameId);
        }
        addTitleHTML.find("#areaCodeAdd_chosen").remove();
        /*//隶属单位
        addTitleHTML.find("select[name='areaCode']").next('div').remove();
        addTitleHTML.find("select[name='areaCode']").attr('id',id).empty();*/
        addTitleHTML.find("select[name='houseId']").attr("id","houseIdAdd"+insertNum);
        addTitleHTML.find("select[name='areaCode']").attr("id","areaCodeAdd"+insertNum);
        sel.loadIDCHouseSel("houseIdAdd"+insertNum);
        sel.loadAreaCodeSelNew("areaCodeAdd"+insertNum,null);
        /*$("#houseIdAdd"+insertNum).on("change",function(){
    		sel.loadAreaCodeSel("areaCodeAdd"+insertNum,$(this).val());
    	});*/
        //删除添加的组
        $(".removeTitleContent").click(function () {
            $(this).parent().parent().parent().remove();
        });
        //cselect.initSelectCommon(id,'/common/getSubOrdArea');
        //清空原来值
        $("#"+id).parent().parent().parent().find(".removeGroup").parent().parent().parent().remove();
        $('#'+formId+' input').val("");

        //表单里面的新增--机架
        $("#"+id).parent().parent().parent().find(".addGroup").click(function  () {
            var num = $("#userNameIds").val();
            $("#userNameIds").val( parseInt(num)+1);
            var addGroupHtmlFram=$(this).parent().parent().parent().clone();
            addGroupHtmlFram.find("a").removeClass("addGroup").addClass("removeGroup").html("<i class=\'fa fa-minus-circle\'></i> 删除");
            addGroupHtmlFram.find("input").val("");
            addGroupHtmlFram.find("input[name='userName']").attr("id","useNameAdd_frame"+num);
            $(this).parent().parent().parent().after(addGroupHtmlFram);
            inputInit("useNameAdd_frame"+num);
            //删除添加的组
            $(".removeGroup").click(function () {
                $(this).parent().parent().parent().remove();
            })
        });
    });

    //表单里面的新增
    $(".addGroup").click(function  () {
        var num = $("#userNameIds").val();
        $("#userNameIds").val( parseInt(num)+1);
        var addGroupHTML=$(this).parent().parent().parent().clone();
        addGroupHTML.find("a").removeClass("addGroup").addClass("removeGroup").html("<i class=\'fa fa-minus-circle\'></i> 删除");
        addGroupHTML.find("#useNameAdd_frame").attr("id","useNameAdd_frame"+num);
        $(this).parent().parent().parent().after(addGroupHTML);
        inputInit("useNameAdd_frame"+num);
        //删除添加的组
        $(".removeGroup").click(function () {
            $(this).parent().parent().parent().remove();
        })
    });

    $(".addGroup_edit").click(function  () {
        var num = $("#userNameIds_edit").val();
        $("#userNameIds_edit").val( parseInt(num)+1);
        var addGroupHTML=$(this).parent().parent().parent().clone();
        addGroupHTML.find("a").removeClass("addGroup_edit").addClass("removeGroup").html("<i class=\'fa fa-minus-circle\'></i> 删除");
        addGroupHTML.find("input").val("");
        addGroupHTML.find("input[name='userName']").attr("id","userName_edit"+num);
        $(this).parent().parent().parent().after(addGroupHTML);
        inputInit("userName_edit"+num);
        //删除添加的组
        $(".removeGroup").click(function () {
            $(this).parent().parent().parent().remove();
        })
    });

});

function inputInit(id){
    $("#"+id).bsSuggest({
        url: "/common/getUserNames?keyword=",
        getDataMethod: "url",
        effectiveFields: ["unitName"],
        searchFields: [ "unitName"],
        autoSelect: false,
        showBtn: false,
        inputWarnColor: 'rgba(255,255,255,.1)',
        keyField: "unitName"
    }).on('onDataRequestSuccess', function (e, result) {

    }).on('onSetSelectValue', function (e, keyword, data) {

    }).on('onUnsetSelectValue', function () {

    });
}

function userNameFormatter(value, row, index){
	if(value!=null&&value.length>0){
		value = value.replace(/,/g, "][");
		value = "["+value+"]";
	}
	return value;
}

function operateFormatter(value, row, index){
    var op="";
    var updateRole=$("#updateRole").val();
    var delRole=$("#delRole").val();
    var status=row.dealFlag;
    var czlx=row.czlx;
    //处理标记（0-未预审、1-预审不通过、2-上报审核中、3-上报审核不通过、4-提交上报、5-上报成功、6-上报失败）
    if(!(status==0 && czlx==3)){
    	if(updateRole==1){
    		op+="<a  data-toggle='modal' data-target='#myModaledit' onclick=\"beforeUpdate('"+row.frameId+"');\" title='修改' class='m-r'><i class='fa fa-edit fa-lg'></i></a>";
    	}
    	if(delRole==1){
    		op+="<a class='m-r demo4' onclick=\"deleteFun('"+row.frameId+"','"+row.houseId+"');\"  title='删除'><i class='fa fa-close fa-lg'></i></a>" ;
    	}
    }
    return op;
}

function addFun(){
    cleanErrorText("myModaladd");
    $("#myModaladd").find(".removeGroup").parent().parent().parent().remove();
    $("#myModaladd").find("#areaCode_error").text('');
    $("#myModaladd").find("#houseId_error").text('');
    //cselect.initSelectSingle("houseId_add","/getHouseSelectInfo");
    sel.loadIDCHouseSel("houseId_add");
    sel.loadAreaCodeSelNew("areaCodeAdd");
    //cselect.initSelectCommon("framInfoArea","/common/getSubOrdArea","");
    cselect.initSelectJcdm('zjlx','framTypeAdd',null);

    inputInit("useNameAdd_frame");
    $('#myModaladd').modal('show');
}

function addValidate(){
    $("#myModaladd").find("label .error").text('');
    $("#myModaladd").find("#areaCode_error").text('');
    $("#myModaladd").find("#houseId_error").text('');
    var validate = true;
    var realEntity = [];
    var idArr = [];
    realEntity.push($('#framChildForm').serializeObject());
    idArr.push('framChildForm');
    var idend = $("#idPlus").val();
    for(var i=1;i<idend;i++){
        var ipenty =  $("#framChildForm"+i).serializeObject();
        if(!jQuery.isEmptyObject(ipenty)){
            idArr.push('framChildForm'+i);
            realEntity.push(ipenty);
        }
    }

    var userInfo = icom.auth.getUserInfo();

    var outIndex = 0;
    for(var obj in realEntity){
        realEntity[obj].outIndex = outIndex;
        if(realEntity[obj].houseId == undefined || realEntity[obj].houseId==""){
            $("label[id='houseId_error']").eq(outIndex).text("请选择机房");
            validate = false;
        }
        if(realEntity[obj].areaCode == undefined || realEntity[obj].areaCode==""){
            $("label[id='areaCode_error']").eq(outIndex).text("请选择隶属单位");
            validate = false;
        }
        var objArr = [];
        var userName = $("#"+idArr[obj]).find('input[name="userName"]');
        var userNumber = $("#"+idArr[obj]).find('input[name="idNumber"]');
        var idType = $("#"+idArr[obj]).find('select[name="idType"]');
        for(var i=0;i< userName.length;i++){
            var obj1 = {};
            obj1.userName = userName[i].value;
            obj1.idType = idType[i].value;
            obj1.idNumber = userNumber[i].value;
            if(obj1.userName!=''||obj1.idType!=''||obj1.idNumber!=""){
                objArr.push(obj1);
            }
        }
        realEntity[obj].userFrameList = objArr;
        realEntity[obj].createUserId = userInfo.userId;
        realEntity[obj].updateUserId = userInfo.userId;
        if(userInfo.userAreaCode!=null){
            realEntity[obj].cityCodeList = userInfo.userAreaCode.split(",");
        }
        //清空外层的3个属性--是数组提交到后台接收报错
        realEntity[obj].userName=null;
        realEntity[obj].idType=null;
        realEntity[obj].idNumber=null;
        outIndex++;
    }

    for(var n in idArr){
        if(!$('#'+idArr[n]).valid()){
            validate = false;
        }
    }
    if(!validate){
        return validate;
    }
    frameList = realEntity;
    return validate;
}

function editValidate(){
    var realEntity = [];
    var idArr = [];
    realEntity.push($('#editForm').serializeObject());
    idArr.push('editForm');

    var outIndex = 0;
    for(var obj in realEntity){
        realEntity[obj].outIndex = outIndex;
        var objArr = [];
        if(Array.isArray(realEntity[obj].areaCode)){
            realEntity[obj].areaCode = realEntity[obj].areaCode.join(",");
        }
        if(Array.isArray(realEntity[obj].userName)){
            for(var i=0;i< realEntity[obj].userName.length;i++){
                var obj1 = {};
                obj1.userName = realEntity[obj].userName[i] ;
                obj1.idType = realEntity[obj].idType[i];
                obj1.idNumber = realEntity[obj].idNumber[i];
                if(obj1.userName!=''||obj1.idType!=''||obj1.idNumber!=""){
                	objArr.push(obj1);
                }
            }
        }else{
            var obj1 = {};
            obj1.userName = realEntity[obj].userName;
            obj1.idType = realEntity[obj].idType;
            obj1.idNumber = realEntity[obj].idNumber;
            if(obj1.userName!=''||obj1.idType!=''||obj1.idNumber!=""){
            	objArr.push(obj1);
            }
        }
        realEntity[obj].userFrameList = objArr;
        //清空外层的3个属性--是数组提交到后台接收报错
        realEntity[obj].userName=null;
        realEntity[obj].idType=null;
        realEntity[obj].idNumber=null;
        outIndex++;
    }
    return realEntity[0];
}

function beforeUpdate(id){
    var data = $('#infotable').bootstrapTable('getRowByUniqueId', id);
    var inputs = $('#editForm').find('input[class="form-control"],input[class="form-control valid"]');
    var textIDArray = new Array();
    for(var i=0;i<inputs.size();i++){
        textIDArray[i] = inputs[i].name;
    }
    setFormdata(textIDArray, data, $('#editForm'));
    $('#editForm').find("input[name=frameId]").val(data.frameId);
    //$('#editForm').find("select[name=houseId]").val(data.houseId);
    $('#editForm').find("select[name=distribution]").val(data.distribution);
    $('#editForm').find("select[name=occupancy]").val(data.occupancy);
    $('#editForm').find("select[name=useType]").val(data.useType);
    $('#editForm').find("input[name=houseId]").val(data.houseId);
    cselect.initSelectJcdm('zjlx','idTypeEdit',data.idType);
    //console.log(data.areaCode);
    //cselect.initSelectCommon("framInfoAreaEdit",'/common/getSubOrdArea',data.areaCode.split(","));
    edit++;
    //$("#areaCodeEdit").chosen("destroy");
    //sel.loadAreaCodeSel("areaCodeEdit",data.houseId,data.areaCode);
    sel.loadAreaCodeSelNew("areaCodeEdit",data.areaCode);
    //cselect.initSelectCommon("areaCodeEdit",'/common/getAreaByHouseId?houseId='+data.houseId,data.areaCode.split(","));

    var hht=$("div[id*='editUserDiv0']");
    //console.log(hht.length);
    if(hht.length>1){
        hht.each(function (i) {
            if(i!=0){
                $(this).remove();
            }
        });
    }
    $("#userNameIds_edit").val(1);
    initUserFrameListArea(data.frameId);
    inputInit("userName_edit");
    var userInfo = icom.auth.getUserInfo();
    $('#editForm').find("input[name=updateUserId]").val(userInfo.userId);
}

/**
 * 加载用户信息块
 * @param frameId
 */
function initUserFrameListArea(frameId){
	$.ajax({
		url:'/serviceapi/pre/house/rack/getUserFrame',
        type:"post",
        dataType: 'json',
        data: {'frameId' : frameId},
        success:function(result){
        	if(result!=null){
        		var addTitleHTML ="";
        		for(var index in result){
        			if(index>0){
                        var num = $("#userNameIds_edit").val();
                        $("#userNameIds_edit").val( parseInt(num)+1);
                        $("#editUserDiv"+index).remove();
        				addTitleHTML=$("#editUserDiv0").clone();
        				//console.log(addTitleHTML.find("#editUserDiv0")).attr("id");
        				//addTitleHTML.find("#editUserDiv0").attr("id","editUserDiv"+index);
                        addTitleHTML.find("input[name='userName']").attr("id","userName_edit"+num);
        				addTitleHTML.find("a.addGroup_edit").removeClass("addGroup_edit").addClass("removeGroup").html("<i class=\'fa fa-minus-circle\' ></i> 删除").on("click",function(){
        					$(this).parent().parent().parent().remove();
        				});
        				addTitleHTML.find("select[name=idType]").val(result[index].idType);
            			addTitleHTML.find("input[name=idNumber]").val(result[index].idNumber);
            			addTitleHTML.find("input[name=userName]").val(result[index].userName);
                        $("#bottomInput").before(addTitleHTML);
                        inputInit("userName_edit"+num);

        			}else{
        				$('#editUserDiv0').find("select[name=idType]").val(result[index].idType);
            			$('#editUserDiv0').find("input[name=idNumber]").val(result[index].idNumber);
            			$('#editUserDiv0').find("input[name=userName]").val(result[index].userName);

        			}
            	}
        	}
        }
	});
}


function deleteFun(id,houseId){
    var ids = [];
    var houseIds = [];
    if (typeof(id) == "undefined") {
        var rows= $("#infotable").bootstrapTable('getSelections');
        if (rows.length > 0) {
            for ( var i = 0; i < rows.length; i++) {
                ids.push(rows[i].frameId);
                houseIds.push(rows[i].houseId);
            }
        }else{
            swal({title: "请选择要删除的记录",type: "error"});
            return;
        }
    }else{
        ids.push(id);
        houseIds.push(houseId);
    }
    var idstr=ids.join(',');

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
        if (isConfirm) {
            $.ajax({
                url:'/serviceapi/pre/house/rack/delete',
                type:"post",
                dataType: 'json',
                data: {'ids' : idstr},
                success:function(result){
                    if(result.resultCode == 0 || result.resultCode == 2){
                        swal({
                            title: "删除成功，请确认是否数据上报",
                            type: "success",
                            showCancelButton: true,
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            closeOnConfirm: true,
                            closeOnCancel: true
                        }, function(isConfirm) {
                            if(isConfirm) {
                                $.ajax({
                                    url:'/houseinfo/preJudHouse',
                                    type:"post",
                                    dataType: 'json',
                                    data: {'houseIds' : houseIds},
                                    success:function(result){
                                        $("#infotable").bootstrapTable('refresh');
                                    }
                                });
                            }else{
                                $("#infotable").bootstrapTable('refresh');
                            }
                        })

                        /*swal({
                            title: "删除成功",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonText: "确定",
                            closeOnConfirm: true
                        }, function(isConfirm) {
                            if(isConfirm) {
                                $("#infotable").bootstrapTable('refresh');
                            }
                        })*/
                    }else{
                        swal({title: "删除失败",type: "error"})
                    }
                    /*if(result.resultCode == 0 || result.resultCode == 2){
                        $("#infotable").bootstrapTable('refresh');
                    }else{
                        swal({title: "删除失败",type: "error"})
                    }*/
                }
            });
        }
    });

}


function loadSelectHouse(id){
    let sel_house = icom.rsel.createRichSelect(id,{
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
                //console.log(data,params);
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
    sel_house.render();
}

