
var steps;
var occupyHouseId;
var nature;
var baseData = new Object();
var rank=0;
var subId=0;



function getDetailQueryParam(params){
    var query ={
        userId:$("#detailUserId").val(),
        pageIndex:params.offset/params.limit+1,
        pageSize:params.limit
    };
    return query;
}

function getDetailIpQueryParam(params){
    var query ={
        unitName:$("#detailUserName").val(),
        idType:$("#detailIdType").val(),
        idNumber:$("#detailIdNumber").val(),
        pageIndex:params.offset/params.limit+1,
        pageSize:params.limit
    };
    return query;
}

function getDetailColumns(type) {
    var columns = new Array();
    if(type==1){
        columns = [{
            field: 'serviceType',
            title: '应用服务类型',
            formatter:appServerName,
            width:'100px',
        }, {
            field: 'serviceContent',
            title: '服务内容',
            formatter:fwnrFormatterModify,
            width:'240px'
        }, {
            field: 'registerId',
            title: '备案号',
            width:'140px'
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
            width:'200px'
        }, {
            field: 'setmode',
            title: '<span title="接入方式">接入方式</span>',
            formatter:function (value, row, index) {
                var nowValue =  getJCDM_STRModify('jrfs',value);
                /*var oldVlaue = "";
                if(row.rptSetmode!=null && value!=row.rptSetmode){
                    oldVlaue = getJCDM_STRModify('jrfs',row.rptSetmode);
                    return '<span>'+nowValue+'</span><span class="text-info">('+oldVlaue+')</span>';
                }else{*/
                   return nowValue;
                // }
            }
        }, {
            field: 'business',
            title: '<span title="业务类型">业务类型</span>',
            formatter:businessFormatter
        },{
            field: 'czlx',
            title: '操作类型',
            formatter:czlxFormatter
        }, {
            field: 'dealFlag',
            title: '<span title="处理状态">处理状态</span>',
            formatter:dealFlagFormatter2
        } , {
            field: 'updateTime',
            title:  '<span title="更新时间">更新时间</span>',
            width:'120px'
        }];
    }else if(type==2){
        columns = [ {
            field: 'houseName',
            title: '机房名称'
        }, {
            field: 'distributeTime',
            title: '资源分配日期'
        }, {
            field: 'bandWidth',
            title: '网络带宽(Mbps)'
        }, {
            field: 'czlx',
            title: '操作类型',
            formatter:czlxFormatter
        }, {
            field: 'dealFlag',
            title: '处理状态',
            formatter:dealFlagFormatter2
        } , {
            field: 'updateTime',
            title: '更新时间'
        }];
    }else if(type==3){
        columns = [ {
            field: 'houseName',
            title: '机房名称'
        }, {
            field: 'startIP',
            title: '起始IP地址'
        }, {
            field: 'endIP',
            title: '终止IP地址'
        }];
    }else if(type==4){
        columns = [{
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
        },{
            field: 'czlx',
            title: '操作类型',
            formatter:czlxFormatter
        }, {
            field: 'dealFlag',
            title: '处理状态',
            formatter:dealFlagFormatter2
        } , {
            field: 'updateTime',
            title: '更新时间'
        }];
    }
    return columns;
}


userMain={

    param:{
      seqH:0,
      seqVir:0,
      userInfo:new Object(),
    },

    loadOption:function () {

        icom.tpick.createTimePick().initSingleDate("serviceRegTimeId",4);
        icom.tpick.createTimePick().initSingleDate("registeTimeId",4);
        icom.tpick.createTimePick().initSingleDate("distributeTimeId",4);
        icom.asel.createAreaSelect("addProvince","addCity","addCounty",1,null,null,null);
        cselect.initSelectJcdm('dwsx','unitNatureId',null,1);
        cselect.initSelectJcdm('zjlx','idTypeId',null,2);
        cselect.initSelectJcdm('zjlx','officerIdTypeId',null,1);
        cselect.initSelectJcdm('jrfs','setmodeId',null);
        cselect.initSelectJcdm('balx','regTypeId',null);
        cselect.initFunrJcdm('funrId');
        var dest =$('#userMainArea').parent();
        $('#userMainArea').remove();
        dest.html("<select  id=\"userMainArea\" class=\"form-control selectpicker \" multiple data-live-search=\"false\" name=\"areaCode\" required></select>");
        cselect.initAreaCode("userMainArea");
        $("#userMianAddForm").find("label.error").text('');
       /* var houseId = $("#userHHChildForm").find('select[name="houseId"]').attr("id");
        var dest = $('#'+houseId).parent();
        var html="<select  id=\""+houseId+"\" class=\"form-control \" name=\"houseId\" required></select>";
        $('#'+houseId).remove();
        dest.html(html);
        cselect.initSelectCommon(houseId,"/getHouseSelectInfo",null,1,1);*/
        
        /*var areaId = $("#userHHChildForm").find('select[name="areaCode"]').attr("id");
        var dest = $('#'+areaId).parent();
        var html="<select  id=\""+areaId+"\" class=\"form-control \" name=\"areaCode\" required></select>";
        $('#'+areaId).remove();
        dest.html(html);
        cselect.initAreaCode(areaId,null,1,'','',userMain.param.userInfo.areaCode.split(","),1,1);*/
        $("#userHHChildForm").find("label.error").text("");
    	$("#userHHChildForm").find('input[name="bandWidth"]').val('');
    	$("#userHHChildForm").find('input[name="distributeTime"]').val('');
    	$("#userHHChildForm").parent().parent().parent().parent().siblings().remove();
    },
    initClick:function () {
    	$("#returnBtn").click(function(){
    		if(rank==1){
    			$("#reportFile").hide();
    			$("#vertical-timeline").show();
    			rank=0;
    			$("#refreshBtn").show();
    			$("#chkResult").show();
    		}else{
    			$(this).attr("data-dismiss",'modal')
    		}
    	});
        $('#natureId').click(function () {
            var choose= this.value;
            if (choose==2){
                $('.otherUser').show();
            }else {
                $('.otherUser').hide();
            }
        });
        $('#modify_natureId').change(function () {
            var choose= this.value;
            if (choose==2){
                $('#forOtherUser').show();
            }else {
                $('#forOtherUser').hide();
            }
        });
        $('#userAddBt').click(function(){
        	//判断是否存在经营者
            var eisxtIdc = 1;
            $.ajax({
                url:"/common/existIdc",
                type:"POST",
                async:false,
                dataType:"json",
                success:function(data){
                    if(data==null || data=="0"){
                        swal({
                            title: "经营者不存在，请先新增经营者",
                            type: "error",
                        })
                        eisxtIdc = 0;
                    }
                }
            })
            
            if(eisxtIdc==0){
            	return false;
            }else{
            	userMain.loadOption();
                userMain.initServiceAdd();
                reset();
                step.wizardModal();
            }
        	
        });
        

        $('#setmodeId').click(function () {
            var choose= this.value;
            if (choose==1){
                $("#wizardAdd .wizard-steps>div").eq(3).show();
                userMain.param.userInfo.virtualList=undefined;
            }else {
                $("#wizardAdd .wizard-steps>div").eq(3).hide();
            }
        });
        //详情中的预审
        $("#detail_approv").click(function () {
            var IDS = [];
            IDS.push($("#detailUserId").val());
            //调用预审方法
            userMain.doPreJud(IDS);
        });

        $(".addBand").click(function () {
            userMain.param.seqH++;
            var addTitleHTML=$(this).parent().parent().parent().clone();
            addTitleHTML.find('addCont');
            var oldId = addTitleHTML.find("form").attr('id');
            addTitleHTML.find("form").attr('id',oldId+userMain.param.seqH);

            let oldhouseId = addTitleHTML.find('select[name="houseId"]').attr('id');
            oldhouseId = oldhouseId+userMain.param.seqH;
            addTitleHTML.find('select[name="houseId"]').attr('id',oldhouseId);

            var areaoldId = addTitleHTML.find('select[name="areaCode"]').attr('id');
            areaoldId=areaoldId+userMain.param.seqH;
            addTitleHTML.find('select[name="areaCode"]').attr('id',areaoldId);

            var bandoldId = addTitleHTML.find('input[name="bandWidth"]').attr('id');
            bandoldId=bandoldId+userMain.param.seqH;
            addTitleHTML.find('input[name="bandWidth"]').attr('id',bandoldId);

            var disoldId = addTitleHTML.find('input[name="distributeTime"]').attr('id');
            disoldId=disoldId+userMain.param.seqH;
            addTitleHTML.find('input[name="distributeTime"]').attr('id',disoldId);



            //删除符号
            addTitleHTML.find("h5>a").removeClass("addBand").addClass("removeBand").html("<i class=\'fa fa-minus\'></i> 删除");
            $(this).parent().parent().parent().after(addTitleHTML);
            $('#'+areaoldId).next('div').remove();
            $("#"+disoldId).removeAttrs("lay-key");
            $("#"+disoldId).val("");
            $("#"+bandoldId).val("");

            var houseId = addTitleHTML.find('select[name="houseId"]').attr("id");
            var dest = $('#'+houseId).parent();
            var html="<select  id=\""+houseId+"\" class=\"form-control \" name=\"houseId\" required></select>";
            $('#'+houseId).remove();
            dest.html(html);
            cselect.initSelectCommon(houseId,"/getHouseSelectInfo",null,1,1);

            var areaId = addTitleHTML.find('select[name="areaCode"]').attr("id");
            var dest = $('#'+areaId).parent();
            var html="<select  id=\""+areaId+"\" class=\"form-control \" name=\"areaCode\" required></select>";
            $('#'+areaId).remove();
            dest.html(html);
            cselect.initAreaCode(areaId,null,1,'','',userMain.param.userInfo.areaCode.split(","),1,1);


            icom.tpick.createTimePick().initSingleDate(disoldId,4);
            //删除添加的组
            $(".removeBand").click(function () {
                $(this).parent().parent().parent().remove();
            });
        });

        $('.addUserVir').click(function () {
            userMain.param.seqVir++;
            var addTitleHTML=$(this).parent().parent().parent().clone();
            var oldId = addTitleHTML.find("form").attr('id');
            var newFormId = oldId+userMain.param.seqVir;
            addTitleHTML.find("form").attr('id',newFormId);

            var oldhouseId = addTitleHTML.find('select[name="houseId"]').attr('id');
            oldhouseId = oldhouseId+userMain.param.seqVir;
            addTitleHTML.find('select[name="houseId"]').attr('id',oldhouseId);

            var areaoldId = addTitleHTML.find('select[name="areaCode"]').attr('id');
            areaoldId=areaoldId+userMain.param.seqVir;
            addTitleHTML.find('select[name="areaCode"]').attr('id',areaoldId);

            //删除符号
            addTitleHTML.find("h5>a").removeClass("addUserVir").addClass("removeUserVir").html("<i class=\'fa fa-minus\'></i> 删除");
            $(this).parent().parent().parent().after(addTitleHTML);
            $('#'+areaoldId).next('div').remove();
            $('#'+newFormId).find('input[type="text"]').val('');

            var houseId = addTitleHTML.find('select[name="houseId"]').attr("id");
            var dest = $('#'+houseId).parent();
            var html="<select  id=\""+houseId+"\" class=\"form-control \" name=\"houseId\" required></select>";
            $('#'+houseId).remove();
            dest.html(html);
            cselect.initSelectCommon(houseId,"/getHouseSelectInfo",null,1,1,occupyHouseId);

            var areaId = addTitleHTML.find('select[name="areaCode"]').attr("id");
            var dest = $('#'+areaId).parent();
            var html="<select  id=\""+areaId+"\" class=\"form-control \" name=\"areaCode\" required></select>";
            $('#'+areaId).remove();
            dest.html(html);
            cselect.initAreaCode(areaId,null,1,'','',userMain.param.userInfo.areaCode.split(","),1,1);

            //删除添加的组
            $(".removeUserVir").click(function () {
                $(this).parent().parent().parent().remove();
            });
        });
        
        $("#setmodeId").change(function(){
        	var value = $(this).val();
        	$("#businessId").empty().append('<option value="">请选择</option');
        	if(value!=''&&value==0){//专线接入只能选择isp业务类型
        		$("#businessId").append('<option value="2">ISP</option>')
        	}else{
        		$("#businessId").append('<option value="1">IDC</option><option value="2">ISP</option>')
        	}
        });

        $('#modify_prevalidate').click(function () {

            $("#userMianModifyForm").find("label.error").text("");
            var query = $('#userMianModifyForm').formToJSON();
            query.unitAddressProvinceCode= $('#modify_addProvince').val();
            if($('#modify_addCity').val()!=undefined && $('#modify_addCity').val()!=""){
                query.unitAddressCityCode= $('#modify_addCity').val();
            }else{
                query.unitAddressCityCode= $('#modify_addProvince').val();
            }
            if($('#modify_addCounty').val()!=undefined && $('#modify_addCounty').val()!=""){
                query.unitAddressAreaCode= $('#modify_addCounty').val();
            }else{
                query.unitAddressAreaCode= $('#modify_addCity').val();
            }
            if(!$('#userMianModifyForm').valid()){
                if(query.areaCode == undefined || query.areaCode==""){
                    $("label[name='modify_areaCode_error']").text("请选择隶属单位地市码");
                }
                return false;
            }
            if(query.areaCode == undefined || query.areaCode==""){
                $("label[name='modify_areaCode_error']").text("请选择隶属单位地市码");
                return false;
            }
            if(Array.isArray(query.areaCode)){
                query.areaCode = query.areaCode.join(",");
            }
            var userInfo = icom.auth.getUserInfo();
            query.createUserId = userInfo.userId;
            query.updateUserId = userInfo.userId;
            query.cityCodeList = userInfo.userAreaCode.split(",");

            $.ajax({
                url: '/user/update',
                type: 'POST',
                contentType: 'application/json',
                data:JSON.stringify(query),
                async:false,
                dataType: 'json',
                success: function(data){
                    AjaxValidator.cleanAllFormError('userMianModifyForm');
                    if(data.ajaxValidationResult==null ){
                        swal({
                            title: "预审成功，IDC/ISP信息安全管理系统进行用户数据上报审核中！",
                            text: '',
                            type: "success",
                        }, function(isConfirm) {
                            if(isConfirm) {
                                $("#modify-modal").modal('hide');
                                $("#indexTable").bootstrapTable('refresh');
                            }
                        })
                    }else if(jQuery.isEmptyObject(data.ajaxValidationResult.errorsArgsMap)){

                        swal({
                            title: "预审成功，IDC/ISP信息安全管理系统进行用户数据上报审核中！",
                            text: '',
                            type: "success",
                        }, function(isConfirm) {
                            if(isConfirm) {
                                $("#modify-modal").modal('hide');
                                $("#indexTable").bootstrapTable('refresh');
                            }
                        })
                    }else{
                        var map=data.ajaxValidationResult.errorsArgsMap;
                        for (var attr in map) {
                            var error_id = "modify_"+attr+'_error';
                            $("#userMianModifyForm").find("label[id="+error_id+"]").text(map[attr]);
                        }
                    }
                },error:function () {
                }
            });
        });
    },
    initServiceAdd:function () {
        $('#funrId >li').click(function(){
            if($(this).hasClass("active")){
                $(this).removeClass("active")
            }else {
                $(this).addClass("active")
            }
        });
        //表单里面的新增--IP
        $("#userServiceForm").find(".addGroup-service").click(function  () {
            var addGroupHTML=$(this).parent().parent().clone();
            addGroupHTML.find("a").removeClass("addGroup-service").addClass("removeGroup-service").html("<i class=\'fa fa-minus-circle\'></i> 删除");
            addGroupHTML.find("input").val("");
            addGroupHTML.addClass("addCont");
            $(this).parent().parent().after(addGroupHTML);
            addGroupHTML.find("label.error").text('');
            //删除添加的组
            $(".removeGroup-service").click(function () {
                $(this).parent().parent().remove();
            });
        });
        
        $("#regTypeId").change(function(){
        	if($(this).val()!=null&&$(this).val()!=""){
        		$("#userServiceForm").find("input[name='domainName']").attr("required","required");
        	}else{
        		$("#userServiceForm").find("input[name='domainName']").removeAttr("required");
        	}
        });

        
    },

    mainInfoCheck:function () {
        $("#userMianAddForm").find("label.error").text("");
        var validate =true;
        var query = $('#userMianAddForm').formToJSON();
        // var query = $('#userMianAddForm').serializeObject();
        query.unitAddressProvinceCode= $('#addProvince').val();
        if($('#addCity').val()!=undefined && $('#addCity').val()!=""){
            query.unitAddressCityCode= $('#addCity').val();
        }else{
            query.unitAddressCityCode= $('#addProvince').val();
        }
        if($('#addCounty').val()!=undefined && $('#addCounty').val()!=""){
            query.unitAddressAreaCode= $('#addCounty').val();
        }else{
            query.unitAddressAreaCode= $('#addCity').val();
        }
        // query.houseOfficerIdType = $("#netSecTypeAdd").val();
        if(!$('#userMianAddForm').valid()){
            if(query.areaCode == undefined || query.areaCode==""){
                $("label[name='areaCode_main_error']").text("请选择隶属单位地市码");
            }
            return false;
        }
        if(query.areaCode == undefined || query.areaCode==""){
            $("label[name='areaCode_main_error']").text("请选择隶属单位地市码");
            return false;
        }
        if(Array.isArray(query.areaCode)){
            query.areaCode = query.areaCode.join(",");
        }
        var userInfo = icom.auth.getUserInfo();
        query.createUserId = userInfo.userId;
        query.updateUserId = userInfo.userId;
        query.cityCodeList = userInfo.userAreaCode.split(",");
        $.ajax({
            url: 'validate',
            type: 'POST',
            contentType: 'application/json',
            data:JSON.stringify(query),
            async:false,
            dataType: 'json',
            success: function(data){
                AjaxValidator.cleanAllFormError('userMianAddForm');
                var map=data.errorsArgsMap;

                var nature;
                if (Number(data.flag)==-2){
                    // if(map['nature']!=null && map['nature']!=""){
                    //     $("#userMianAddForm").find("label[id='nature_error']").text(map['nature']);
                    //     validate = false;
                    //     return false;
                    // }
                    if (!jQuery.isEmptyObject(map)) {
                        for (var attr in map) {
                            if (attr=='unitName'){
                                //do nothing
                            }else {
                                var error_id = attr + '_error';
                                $("#userMianAddForm").find("label[id=" + error_id + "]").text(map[attr]);
                                validate = false;
                            }
                        }
                        if (!validate){
                            return false;
                        }
                    }
                    var userid = data.msg.substr(0,data.msg.indexOf('-'));
                    var idy = data.msg.substr(data.msg.indexOf('-')+1,data.msg.length);
                    query.userId=userid;
                    var text='';
                    if (idy!=""){
                        text='用户主体为[';
                        var idys = idy.split(",");
                        for (var i=0;i<idys.length;i++){
                            if (Number(idys[i])==1){
                                text+='IDC用户  ';
                            }else if (Number(idys[i])==2){
                                text+='ISP用户  ';
                            }else if (Number(idys[i])==3){
                                text+='IDC/ISP用户  ';
                            }else if (Number(idys[i])==4){
                                text+='CDN用户  ';
                            }else if (Number(idys[i])==5){
                                text+='专线用户  ';
                            }
                        }
                        text+="]";
                    }
                    //机房用户存在
                    swal({
                        title: "请确认是否覆盖已录入的主体信息",
                        text: text,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "覆盖",
                        cancelButtonText: "不覆盖",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    }, function(isConfirm) {
                        if(isConfirm) {
                            query.coverUser=true;
                            query.overrideUser=true;
                            swal("确认覆盖！", "将会覆盖用户主体信息", "success")
                        } else {
                            query.coverUser=true;
                            query.overrideUser=false;
                            swal("确认不覆盖！", "但是将会更新用户标识信息", "success")
                        }
                    });
                    validate =  true;
                }else if(jQuery.isEmptyObject(map)){
                    query.coverUser=false;
                    validate =  true;
                }else{
                    query.coverUser=false;
                    for (var attr in map) {
                        var error_id = attr+'_error';
                        $("#userMianAddForm").find("label[id="+error_id+"]").text(map[attr]);
                    }
                    validate = false;
                }
            },error:function () {
                validate = false;
            }
        });
        userMain.param.userInfo=query;
        if (validate){
            var dest = $('#userServiceArea').parent();
            var html="<select  id=\"userServiceArea\" class=\"form-control selectpicker \" multiple data-live-search=\"false\" name=\"areaCode\" required></select>";
            $('#userServiceArea').remove();
            dest.html(html);
            cselect.initAreaCode("userServiceArea",null,2,'','',userMain.param.userInfo.areaCode.split(","));
            $("#userServiceForm").find("label.error").text("");
            
            if(query.nature==2){
            	var areaId = $("#userHHChildForm").find('select[name="areaCode"]').attr("id");
                var dest = $('#'+areaId).parent();
                var html="<select  id=\""+areaId+"\" class=\"form-control \" name=\"areaCode\" required></select>";
                $('#'+areaId).remove();
                dest.html(html);
                cselect.initAreaCode(areaId,null,1,'','',userMain.param.userInfo.areaCode.split(","),1,1);
            	
            }
        }
        return validate;
    },
    userServiceCheck:function () {

        var validate = true;
        if(isEmptyForm("userServiceForm")){
            validate = true;
        }else {
            var query = $('#userServiceForm').serializeObject();
            $("#userServiceForm").find("label.error").text("");
            if (!$('#userServiceForm').valid()) {
                if (query.areaCode == undefined || query.areaCode == "") {
                    $("label[name='areaCode_service_error']").text("请选择隶属单位地市码");
                }
                return false;
            }

            var array = $('#funrId').find('.active');
            var arrayValue = new Array();
            if (array.length > 0) {
                for (var i = 0; i < array.length; i++) {
                    arrayValue.push(array[i].value);
                }
            } else {
                $("label[name='serviceContent_service_error']").text("请选择服务内容");
                return;
            }
            query.serviceContent = arrayValue.join(",");
            if (query.areaCode == undefined || query.areaCode == "") {
                $("label[name='areaCode_service_error']").text("请选择隶属单位地市码");
                return false;
            }
            if (Array.isArray(query.areaCode)) {
                query.areaCode = query.areaCode.join(",");
            }
            
            var domininputs = $('#userServiceForm').find(".domainPlus");
            var domains = new Array();
            var domain;
            var domainAfter;
            for (var i = 0; i < domininputs.length; i++) {
                domain = domininputs.eq(i).find('input[name="domainName"]').val();
                if (domain == '') {
                    if (query.regType != 0) {
                        domininputs.eq(i).find("label[name='domainName_service_error']").text("请输入");
                        return;
                    }
                } else {
                	for(var j=i+1;j<domininputs.length;++j){
                		domainAfter = domininputs.eq(j).find('input[name="domainName"]').val();
                		if(domain==domainAfter){
                			domininputs.eq(j).find("label[name='domainName_service_error']").text("域名重复填写");
                			return false;
                		}
                	}
                    domains.push({domainName: domain});
                }
            }
            query.domainList = domains;
            query.domainName = undefined;
            query.identify = userMain.param.userInfo.identify;
            var userInfo = icom.auth.getUserInfo();
            query.createUserId = userInfo.userId;
            query.updateUserId = userInfo.userId;
            query.cityCodeList = userInfo.userAreaCode.split(",");
            $.ajax({
                url: 'service/validate',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(query),
                async: false,
                dataType: 'json',
                success: function (data) {
                    AjaxValidator.cleanAllFormError('userServiceForm');
                    var map = data.errorsArgsMap;
                    if (jQuery.isEmptyObject(map)) {
                        validate = true;
                    } else {
                        var domininputs = $('#userServiceForm').find(".domainPlus");
                        for (var attr in map) {
                            var error_id = attr + '_service_error';
                            if (attr == 'domainName') {
                                domininputs.eq(0).find("label[name=" + error_id + "]").text(map[attr])
                            } else {
                                $("#userServiceForm").find("label[name=" + error_id + "]").text(map[attr]);
                            }
                        }
                        validate = false;
                    }
                }, error: function () {
                    validate = false;
                }
            });
            var arrays = new Array();
            arrays.push(query);
            userMain.param.userInfo.serviceList = arrays;
        }
        if (validate){
            var allForm = $('#HHForm').find('form');
            var form;
            /*for (var i=0;i<allForm.length;i++) {
                form = allForm.eq(i);


                var houseId = form.find('select[name="houseId"]').attr("id");
                var dest = $('#'+houseId).parent();
                var html="<select  id=\""+houseId+"\" class=\"form-control \" name=\"houseId\" required></select>";
                $('#'+houseId).remove();
                dest.html(html);
                cselect.initSelectCommon(houseId,"/getHouseSelectInfo",null,1,1);

                var areaId = form.find('select[name="areaCode"]').attr("id");
                var dest = $('#'+areaId).parent();
                var html="<select  id=\""+areaId+"\" class=\"form-control \" name=\"areaCode\" required></select>";
                $('#'+areaId).remove();
                dest.html(html);
                cselect.initAreaCode(areaId,null,1,'','',userMain.param.userInfo.areaCode.split(","),1,1);
                
                $("#userHHChildForm").find("label.error").text("");
            	$("#userHHChildForm").find('input[name="bandWidth"]').val('');
            	$("#userHHChildForm").find('input[name="distributeTime"]').val('');
            	$("#userHHChildForm").parent().parent().parent().parent().siblings().remove();
            }*/
        }
        return validate;
    },
    userBandCheck:function () {

        $("#HHForm").find("label.error").text("");
        var allHHForm = $('#HHForm').find('form');
        var form;
        var allEmpty=true;
        for (var i=0;i<allHHForm.length;i++){
            form =  allHHForm.eq(i);
            if (!isEmptyForm(form.attr("id"))){
                allEmpty=false;
            }
        }
        var validate=true;
        if (allEmpty){
            validate = true;
        }else {
            var query = new Array();
            var map = new Map();
            var data;

            for (var i = 0; i < allHHForm.length; i++) {
                form = allHHForm.eq(i);
                data = form.formToJSON();
                if (!form.valid()) {
                    if (data.areaCode == undefined || data.areaCode == "") {
                        form.find("label[name='areaCode_hh_error']").text("请选择隶属单位地市码");
                    }
                    return false;
                }
                if (data.areaCode == undefined || data.areaCode == "") {
                    form.find("label[name='areaCode_hh_error']").text("请选择隶属单位地市码");
                    return false;
                }
                if (Array.isArray(data.areaCode)) {
                    data.areaCode = data.areaCode.join(",");
                }
                if (map.get(data.houseId) == 1) {
                    form.find("label[name='houseId_hh_error']").text("重复设置机房带宽");
                    return false;
                } else {
                    map.set((data.houseId), 1);
                }
                query.push(data);
            }

            $.ajax({
                url: 'bandwidth/validate',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(query),
                async: false,
                dataType: 'json',
                success: function (data) {
                    AjaxValidator.cleanAllFormError('HHForm');
                    var forms = $('#HHForm').find('.bandWidthForm');
                    for (var i = 0; i < data.length; i++) {
                        var map = data[i].errorsArgsMap;
                        if (jQuery.isEmptyObject(map)) {
                            validate = true;
                        } else {
                            // var domininputs = $('#userServiceForm').find(".domainPlus");
                            for (var attr in map) {
                                var error_id = attr + '_hh_error';
                                forms.eq(i).find("label[name=" + error_id + "]").text(map[attr]);
                            }
                            validate = false;
                        }
                    }
                }, error: function () {
                    validate = false;
                }
            });
            userMain.param.userInfo.bandwidthList = query;
        }
        var allForm = $('#userVirForms').find('form');
        for (var i=0;i<allForm.length;i++) {
            var childForm = allForm.eq(i);
            var areaId = childForm.find('select[name="areaCode"]').attr("id");

            var houseId = childForm.find('select[name="houseId"]').attr("id");
            var dest = $('#'+houseId).parent();
            var html="<select  id=\""+houseId+"\" class=\"form-control \" name=\"houseId\" required></select>";
            $('#'+houseId).remove();
            dest.html(html);

            var areaId = childForm.find('select[name="areaCode"]').attr("id");
            var dest = $('#'+areaId).parent();
            var html="<select  id=\""+areaId+"\" class=\"form-control \" name=\"areaCode\" required></select>";
            $('#'+areaId).remove();
            dest.html(html);
            //cselect.initAreaCode(areaId,null,1,'','',userMain.param.userInfo.areaCode.split(","),1,1);
            cselect.initSingleAreaCode(areaId,userMain.param.userInfo.areaCode.split(","));
            $("#userVirForms").find("label.error").text("");
        }
        return validate;
    },
    userVirCheck:function () {
        $("#userVirForms").find("label.error").text("");
        var allForms = $('#userVirForms').find('form');

        var allEmpty=true;
        for (var i=0;i<allForms.length;i++){
            var form =  allForms.eq(i);
            if (!isEmptyForm(form.attr("id"))){
                allEmpty=false;
            }
        }
        var validate = true;
        if (allEmpty){
            validate= true;
        }else {
            var virtualList = new Array();
            for (var i = 0; i < allForms.length; i++) {
                var form = allForms.eq(i);
                var forms = form.formToJSON();
                if (!form.valid()) {
                    if (forms.areaCode == undefined || forms.areaCode == "") {
                        form.find("label[name='areaCode_vir_error']").text("请选择隶属单位地市码");
                    }
                    return false;
                }
                if (forms.areaCode == undefined || forms.areaCode == "") {
                    form.find("label[name='areaCode_vir_error']").text("请选择隶属单位地市码");
                    return false;
                }
                if (Array.isArray(forms.areaCode)) {
                    forms.areaCode = forms.areaCode.join(",");
                }

                $.ajax({
                    url: 'virtual/validate',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(forms),
                    async: false,
                    dataType: 'json',
                    success: function (data) {
                        AjaxValidator.cleanAllFormError('userVirtualForm');
                        var map = data.errorsArgsMap;
                        if (jQuery.isEmptyObject(map)) {
                            virtualList.push(forms);
                        } else {
                            for (var attr in map) {
                                var error_id = attr + '_vir_error';
                                form.find("label[name=" + error_id + "]").text(map[attr]);
                            }
                            validate = false;
                        }
                    }, error: function () {
                        validate = false;
                    }
                });
            }
            userMain.param.userInfo.virtualList = virtualList;
        }
        return validate;
    },
    getDetail:function (userInfo) {
        if(userInfo.dealFlag !=2 && userInfo.dealFlag !=4){
            $("#detail_approv").show();
        }else{
            $("#detail_approv").hide();
        }
        $("#detailUserId").val(userInfo.userId);
        $("#detailUserName").val(userInfo.unitName);
        $("#detailIdType").val(userInfo.idType);
        $("#detailIdNumber").val(userInfo.idNumber);
        $("#tabHead").find("li").removeClass("active");
        $("#tab4").removeClass("active");
        $("#tab2").removeClass("active");
        $("#tab3").removeClass("active");
        $("#tabHead").find("li").eq(0).addClass("active");
        $("#tab1").addClass("active");
        initTable.refreshTable("serviceTableDetial","servicelist");
        initTable.refreshTable("bandWidthTableDetail","bandwidthlist");
        initTable.refreshTable("ipTableDetail","useriplist");
        initTable.refreshTable("virtualTableDetail","virtuallist");
        $("#nature_dt").text(natureFormatter(userInfo.nature,"",""));
        $("#unitName_dt").text(userInfo.unitName);
        $("#unitNature_dt").text(dwsxFormatter(userInfo.unitNature,"",""));
        $("#idType_dt").text(zjlxFormatter(userInfo.idType));
        $("#idNumber_dt").text(userInfo.idNumber);
        $("#registeTime_dt").text(userInfo.registeTime);
        /*if(userInfo.rptUnitZipCode!=null && userInfo.rptUnitZipCode!="" && userInfo.unitZipCode!=userInfo.rptUnitZipCode){
            var html = '<span>'+userInfo.unitZipCode+'</span><span class="text-info">('+userInfo.rptUnitZipCode+')</span>';
            $('#unitZipCode_dt').html(html);
        }else{*/
            var html = '<span>'+userInfo.unitZipCode+'</span>';
            $('#unitZipCode_dt').html(html);
        // }
        var completeAddress=userInfo.unitAddressProvinceName;
        if(userInfo.unitAddressProvinceName != userInfo.unitAddressCityName){//直辖市省份和地级市相同，取一个即可
            if(userInfo.unitAddressCityName!=null){
                completeAddress = completeAddress + userInfo.unitAddressCityName;
            }
        }
        if(userInfo.unitAddressAreaName!=null){
            completeAddress+=userInfo.unitAddressAreaName;
        }
        completeAddress+=userInfo.unitAddress;

        $("#unitAddress_dt").attr('title',completeAddress);
        $("#unitAddress_dt").text(completeAddress);
        $("#officerName_dt").text(userInfo.officerName);
        $("#officerIdType_dt").text(zjlxFormatter(userInfo.officerIdType));
        $("#officerTelphone_dt").text(userInfo.officerTelphone);
        $("#officerId_dt").text(userInfo.officerId);
        /*if(userInfo.rptOfficerMobile!=null && userInfo.rptOfficerMobile!="" && userInfo.officerMobile!=userInfo.rptOfficerMobile){
            var html = '<span>'+userInfo.officerMobile+'</span><span class="text-info">('+userInfo.rptOfficerMobile+')</span>';
            $('#officerMobile_dt').html(html);
        }else{*/
        var html = '<span>'+userInfo.officerMobile+'</span>';
        $('#officerMobile_dt').html(html);
        // }
        $("#officerEmail_dt").text(userInfo.officerEmail);
        $("#serviceRegTime_dt").text(userInfo.registeTime);
        $("#details").modal('show');
    },
    initDetailTable:function () {
        initTable.initBoostrapTable("serviceTableDetial","servicelist",getDetailColumns(1),getDetailQueryParam);
        initTable.initBoostrapTable("bandWidthTableDetail","bandwidthlist",getDetailColumns(2),getDetailQueryParam);
        initTable.initBoostrapTable("ipTableDetail","useriplist",getDetailColumns(3),getDetailIpQueryParam);
        initTable.initBoostrapTable("virtualTableDetail","virtuallist",getDetailColumns(4),getDetailQueryParam);
    },

    doPreJud:function(ids){
        $.ajax({
            url:"/user/batchApprove",
            type:"POST",
            data:{"userIds":ids},
            async:false,
            dataType: 'json',
            success:function (data) {
                if(data.resultCode==0){
                    swal({
                        title: "预审成功，IDC/ISP信息安全管理系统进行用户数据上报审核中！！",
                        text: "",
                        type: "success",
                    }, function(isConfirm) {
                        if(isConfirm) {
                        	$("#details").modal('hide');
                        	$("#indexTable").bootstrapTable('refresh');
                        }
                    })
                }else{
                    swal({
                        title: "预审不通过，请查看列表的核验结果！",
                        text: data.resultMsg,
                        type: "error",
                    }, function(isConfirm) {
                        if(isConfirm) {
                        	$("#details").modal('hide');
                        	$("#indexTable").bootstrapTable('refresh');
                        }
                    })
                }
            }
        });
    },
    delete:function(ids){
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
                    url:"/user/delete",
                    type:"POST",
                    data:{"ids":ids},
                    async:false,
                    dataType: 'json',
                    success:function (data) {
                        if(data.resultCode==0){
                            swal({
                                title: "删除成功",
                                text: "",
                                type: "success",
                            }, function(isConfirm) {
                                if(isConfirm) {
                                    $("#indexTable").bootstrapTable('refresh');
                                }
                            })
                        }else{
                            swal({
                                title: "删除失败",
                                text: data.resultMsg,
                                type: "error",
                            }, function(isConfirm) {
                                if(isConfirm) {
                                    $("#indexTable").bootstrapTable('refresh');
                                }
                            })
                        }
                    }});
            } else {
                // swal("已取消", "取消了删除操作！", "error")
            }
        });

    },
    cancelJud:function(id){
        $.ajax({
            url:"/user/revokeApprove",
            type:"POST",
            data:{"userId":id},
            async:false,
            dataType: 'json',
            success:function (data) {
                if(data.resultCode==0){
                    swal({
                        title: "撤销预审成功",
                        text: "",
                        type: "success",
                    }, function(isConfirm) {
                        if(isConfirm) {
                        	$("#modify-modal").modal('hide');
                            $("#indexTable").bootstrapTable('refresh');
                        }
                    })
                }else{
                    swal({
                        title: "撤销预审失败",
                        text: data.resultMsg,
                        type: "error",
                    }, function(isConfirm) {
                        if(isConfirm) {
                        	$("#modify-modal").modal('hide');
                            $("#indexTable").bootstrapTable('refresh');
                        }
                    })
                }
            }});
    }
};

userExport={

    exportData:function () {
          $('#exportData').click(function () {
              var param = $('#indexSearch').formToJSON();
              var data = $('#moreSearchForm').formToJSON();
              $.extend(param,data);
                  $('#exportUserDataForm').remove();
                  var form = '<form class="hide" id="exportUserDataForm">';
                  $.each(param, function(i) {
                      form +='<input name="'+i+'" type="hidden" value="'+param[i]+'">'
                  });
                  form += '</form>';
                  $('body').append(form);
                  $('#exportUserDataForm').attr('action', '/export/exportUserData').attr('method', 'post').submit() ;return false;
          })
    },

    ready:function () {
        userExport.exportData();
        handleFile.exportTemplate('/export/userTemplate');
    }
};
userImport={

    initClick:function () {
        $('#uploadUser').click(function () {
        	//判断是否存在经营者
            var eisxtIdc = 1;
            $.ajax({
                url:"/common/existIdc",
                type:"POST",
                async:false,
                dataType:"json",
                success:function(data){
                    if(data==null || data=="0"){
                        swal({
                            title: "经营者不存在，请先新增经营者",
                            type: "error",
                        })
                        eisxtIdc = 0;
                    }
                }
            });
            if(eisxtIdc==0){
                return false;
            }else{
                handleFile.initClick();
                $("#upload").modal("show");
            }
        })
    },
    subImport:function () {
      $('#subImport').click(function () {
          handleFile.importFile('/import/userInfo',"indexTable");

      });
    },
    syncTime:function () {
        handleFile.getProcess('/import/getStatus',3);
    },
    ready:function () {
        userImport.subImport();
        userImport.syncTime();
        userImport.initClick();
        handleFile.exportErrorFile('/export/userErrorFile')
    }
};

$(document).ready(function() {
    //获取table对应字段中文名
    baseData = jcdmCode.getData();

    userMain.initClick();
    userExport.ready();
    userImport.ready();
    userMain.initDetailTable();

    loadHouseSelect();
    icom.tpick.createTimePick().initDoubleDate("start","end",4);
	
    initTable1();
    
    $('#houseIndexSearch').click(function(){
    	$("#indexTable").bootstrapTable("refresh",{url: '/user/userList' });
    	// hoverTableContent("indexTable");
    });

    //批量预审
    $("#index_approv").click(function () {
        var houseList =  $("#indexTable").bootstrapTable('getSelections');
        if(houseList.length<=0){
            swal({
                title: "",
                text: "请至少选择一条数据操作",
                type: "success",
            }, function(isConfirm) {
            })
        }else{
            var ids = [];
            for(var n in houseList){
                ids.push(houseList[n].userId);
            }
            userMain.doPreJud(ids);
        }
    });

    //批量删除
    $("#index_delete").click( function () {
        var houseList =  $("#indexTable").bootstrapTable('getSelections');
        if(houseList.length<=0){
            swal({
                title: "请至少选择一条数据操作",
            }, function(isConfirm) {
            })
        }else{
            var ids = [];
            for(var n in houseList){
                ids.push(houseList[n].userId);
            }
            console.log(ids.join(','));
            userMain.delete(ids.join(','));
        }
    });

    $("#resultExport").click(function () {
        $.ajax({
            url:"/user/userValidateMsg",
            type:"POST",
            data:{"userId":$("#resultId").val()},
            async:false,
            dataType: 'json',
            success:function (data) {
                var reslutMsg = "";
                if(data.msg!=null){
                    reslutMsg = data.msg;
                }
                js_export(reslutMsg,'createInvote');
            }});

    });


});
function reset() {
    var objs = $('#add-modal').find('form');
    for (var i=0;i<objs.length;i++){
        objs.eq(i).find("input[type='text']").val('');
        objs.eq(i).find("input[type='email']").val('');
        objs.eq(i).find("input[type='isMobile']").val('');
        objs.eq(i).find("input[type='isPhone']").val('');
        objs.eq(i).find("input[type='number']").val('');
        objs.eq(i).find("select").val('');
        objs.eq(i).find("input:checkbox").removeAttr("checked");
        objs.eq(i).find("label .error").text('');
    }
    $('#add-modal').find('addCont').remove();
    userMain.param.seqH=0;
    $("#add-modal").find(".actions a[href$='#finish']").css('display', 'none');
    $('#wizard .steps >ul >li').eq(3).show();
}

function cancelJud(index){
    var userList = $("#indexTable").bootstrapTable('getData');
    var userId = userList[index].userId;
    userMain.cancelJud(userId);
}

function loadHouseSelect(){
	var opts = {
	        language: "zh-CN", //提示语言
	        width:'180px',
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
	              console.log(data,params);
	               var results = new Array();
	                $.each(data, function(i, n){
	                    results.push({id:n.value,text:n.title})
	                });
	                return {
	                    results: results  //必须赋值给results并且必须返回一个obj
	                };
	            }
	        }
	    };
	var sel_house = icom.rsel.createRichSelect("ser_house",opts);
    sel_house.render();
}
function operateFormatter(value, row, index){
	var updateRole=$("#updateRole").val();
    var delRole=$("#delRole").val();
    var approveRole=$("#approveRole").val();
    var revokeRole=$("#revokeRole").val();
    var detailRole=$("#detailRole").val();
    var natureRole=$("#natureRole").val();
    var ophtml = '';
	if(detailRole==1){
		ophtml+='<a title="详情" href="#" class="m-r" onclick="detail('+index+')"><i class="fa fa-file-text-o fa-lg"></i></a>';
	}
	
    if(row.dealFlag !=2 && row.dealFlag !=4){
    	if(updateRole==1){
    		ophtml+='<a title="修改" href="#" onclick="editUser('+index+')" class="m-r"><i class="fa fa-edit fa-lg"></i></a>';
    	}
    	if(row.czlx!=3 && delRole==1){
    		ophtml+='<a title="删除" href="#" onclick="deleteRow('+index+')" class="m-r"><i class="fa fa-close fa-lg"></i></a>';
    	}
    	if(natureRole==1){
    		ophtml+='<a title="变更属性" onclick="changeUserProp('+index+')" href="#" class="m-r"><i class="fa fa-adjust fa-lg"></i></a>';
    	}
    	if(approveRole){
    		ophtml+='<a title="上报预审" href="#" class="m-r" onclick="preJud('+index+')"><i class="fa fa-legal fa-lg"></i></a>';
    	}
    }
    if(row.dealFlag ==2){
    	if(revokeRole==1){
    		ophtml = ophtml + '<a title="撤销预审" onclick="cancelJud('+index+')" href="#" class="m-r"><i class="fa fa-backward fa-lg"></i></a>';
    	}
    }
    return ophtml;
}
function natureFormatter(value, row, index){
	if(value==1){
		return "提供互联网用户";
	}else{
		return "其他用户";
	}
}
function dwsxFormatter(value, row, index){
	if(value==1){
		return "军队";
	}else if(value==2){
		return "政府机关";
	}else if(value==3){
		return "事业单位";
	}else if(value==4){
		return "企业";
	}else if(value==5){
		return "个人";
	}else if(value==6){
		return "社会团体";
	}else if(value==999){
		return "其他";
	}
}
function identifyFormatter(value, row, index){
    var idens = value.split(",");
    var res = "";
    for(var n in idens){
        if(idens[n]==1){
            res += "[IDC用户]";
        }else if(idens[n]==2){
            res +=  "[ISP用户]";
        }else if (idens[n]==3){
            res +=  "[IDC/ISP用户]";
        }else if(idens[n]==4){
            res +=  "[CDN用户]";
        }else if (idens[n]==5){
            res +=  "[专线用户]";
        }
    }
	return res;
}

function initTable1(){
	$("#indexTable").bootstrapTable('destroy').bootstrapTable({
        method: 'post',
        url: '/user/userList',
        queryParams : function (params) {
        	 var query = "";
        	 var houseIDS ="";
             query = $('#moreSearchForm').serializeObject();
             if(query.houseId!=null && query.houseId!=''){
            	 if(!$.isArray(query.houseId)){
            		 houseIDS=query.houseId;
            	 }else{
            		 houseIDS=query.houseId.join(',');
            	 }
             }

            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {   
            	pageSize: params.limit,                         //页面大小
            	pageIndex: (params.offset / params.limit) + 1,   //页码
                sort: params.sort,      //排序列名  
                sortOrder: params.order, //排位命令（desc，asc） 
                houseIDs:houseIDS,
                unitName:$('#sel_unitName').val(),
                nature:$('#sel_nature').val(),
                unitAddress:$('#sel_unitAddress').val(),
                officerName:$('#sel_officerName').val(),
                identify:$('#sel_identify').val(),
                czlx:$('#sel_czlx').val(),
                dealFlag:$('#sel_dealFlag').val(),
                startDate:$('#start').val(),
                endDate:$('#end').val()
            };
            return temp;
        },
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
        clickToSelect:false,
        showPaginationSwitch:false,
        pageSize: 10,
        pageList: [10, 25, 50, 100, 200],
        uniqueId:'userId',
        columns: [
            {field: 'check',title: 'title',checkbox:true},
            {field: 'jyzId',title: '经营者Id',visible:false},
            {field: 'userId',title: 'ID',visible:false},
            {field: 'unitName',title: '单位名称'},
            {field: 'nature',title: '用户属性',width:'75px',formatter:natureFormatter},
            {field: 'identify',title: '用户标识',width:'75px',formatter:identifyFormatter},
            {field: 'unitNature',title: '单位属性',width:'75px',formatter:dwsxFormatter},
            {field: 'unitAddress',title: '单位地址',formatter:function(value, row, index){
            	var completeAddress=row.unitAddressProvinceName;
                    if(row.unitAddressProvinceName != row.unitAddressCityName){//直辖市省份和地级市相同，取一个即可
                        if(row.unitAddressCityName!=null){
                            completeAddress = completeAddress + row.unitAddressCityName;
                        }
                    }
                    if(row.unitAddressAreaName!=null){
                        completeAddress+=row.unitAddressAreaName;
                    }
                    completeAddress+=row.unitAddress;
                return completeAddress;
            }},
            {field: 'officerName',title: '网络负责人',visible:false},
            {field: 'czlx',title: '操作类型',width:'75px',formatter: czlxFormatter},
            /*{field: 'verificationResult',title: '核验结果',width:'75px',formatter: verificationResultFormatter},*/
            {field: 'dealFlag',title: '<span class="pull-left" >处理状态</span> <span class="text-center center-block" title="点击“预审”操作后系统自动进行完整性、关联性校验，请点击“查询”刷新后查看处理状态！"><i class="fa fa-question-circle" aria-hidden="true"></i></span>',width:'85px',formatter: dealFlagFormatterDeal},
            {field: 'updateTime',title: '更新时间',width:'100px',formatter: dateFormatter},
            {field: 'operating',title: '操作',width:'180px',formatter: operateFormatter}
        ]
    });
}

function getResaultHtml(data){
    var html="";
    for(var n in data){
        if(data[n].dealFlag==1 || data[n].dealFlag==3 || data[n].dealFlag==6){
            html = html + '<div class="vertical-timeline-block"><div class="vertical-timeline-icon red-bg"> <i class="fa fa-close"></i> </div><div class="vertical-timeline-content">' +
                '<p>处理时间： <span>'+data[n].dealTime+ '</span></p><p>处理环节： <span class="text-danger"> '+dealFlagFormatter(data[n].dealFlag)+' </span></p><p>处理结果： <span class="text-muted" > '+ (data[n].warnData).replace(/\r\n/g,'<br/>')+
                '</div></div>'
        }else if(data[n].dealFlag==5){
            html = html+'<div class="vertical-timeline-block"><div class="vertical-timeline-icon navy-bg"> <i class="fa fa-check"></i> </div>' +
                '<div class="vertical-timeline-content"><p>处理时间： <span>'+data[n].dealTime+ '</span></p><p>处理环节： <span class="text-navy">'+dealFlagFormatter(data[n].dealFlag)+'</span></p>' +
                '</div></div>';
        }else if(data[n].dealFlag==2){
            html = html + '<div class="vertical-timeline-block"><div class="vertical-timeline-icon yellow-bg"> <i class="fa fa-spinner fa-pulse"></i> </div><div class="vertical-timeline-content">' +
                '<p>处理时间： <span>'+data[n].dealTime+ '</span></p><p>处理环节： <span class="text-warning"> '+dealFlagFormatter(data[n].dealFlag)+' </span></p><p>处理结果： <span class="text-muted"> '+ (data[n].warnData).replace(/\r\n/g,'<br/>')+
                '</div></div>'
        }else if(data[n].dealFlag==4){
            var total = 0;
            var excCount = 0;
            if(data[n].total!=null){
                total = data[n].total;
            }
            if(data[n].excCount!=null){
                excCount = data[n].excCount;
            }
            html = html + '<div class="vertical-timeline-block"><div class="vertical-timeline-icon yellow-bg"> <i class="fa fa-spinner fa-pulse"></i> </div><div class="vertical-timeline-content">' +
                '<p>处理时间： <span>'+data[n].dealTime+ '</span></p><p>处理环节： <span class="text-warning"> '+dealFlagFormatter(data[n].dealFlag)+' </span></p><p>处理结果：<a> <span class="text-muted" onclick="getFileInfo('+data[n].submitId+')">文件总数（'+total+'）&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;异常文件总数（'+excCount+'）'+
                '</a></div></div>'
        }
    }
    return html;
}

function getResult(id){
	$("#reportFile").hide();
	$("#vertical-timeline").show();
    $.ajax({
        url:"/user/userValidateMsg",
        type:"POST",
        data:{"userId":id},
        async:false,
        dataType: 'json',
        success:function (data) {
            var html="";
            if(data!=null && data.length>0){
                html = getResaultHtml(data);
            }
            $("#vertical-timeline").html(html);
        }});
    $("#resultUserId").val(id);
    $('#audit_results').modal('show');
}

function refreshResult(){
	$.ajax({
        url:"/user/userValidateMsg",
        data: {'userId' : $("#resultUserId").val()},
        type:"POST",
        async:false,
        dataType: 'json',
        success:function (data) {
            var html="";
            if(data!=null && data.length>0){
                html = getResaultHtml(data);
            }
            $("#vertical-timeline").html(html);
        }});
}

/**
 * 获取文件处理信息
 * @param subId
 */
function getFileInfo(submitId){
	subId = submitId;
	$("#refreshBtn").hide();
	$("#reportFile").show();
	$("#vertical-timeline").hide();
	$("#returnBtn").attr("data-dismiss",'');
	$("#chkResult").hide();
	rank=1;
	$("#reportFileTable").bootstrapTable('destroy').bootstrapTable({
        method: 'post',
        url: '/houseinfo/getReportFileInfo',
        queryParams : function (params) {
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {   
            	pageSize: params.limit,                         //页面大小
            	pageIndex: (params.offset / params.limit) + 1,   //页码
                sort: params.sort,      //排序列名  
                sortOrder:  params.order, //排位命令（desc，asc） 
                submitId:submitId,
            };
            return temp;
        },
        contentType: 'application/x-www-form-urlencoded',
        striped: true,
        undefinedText: '',
        /*showColumns: !0,*/
        pagination: true,
        sidePagination: 'server',
        iconSize: "outline",
        icons: {
            columns: "glyphicon-list",
        },
        clickToSelect:false,
        showPaginationSwitch:false,
        pageSize: 10,
        pageList: [10, 25, 50, 100, 200],
        uniqueId:'gatewayId',
        columns: [
            /*{field: 'check',title: 'title',checkbox:true},*/
            {field: 'submitId',title: 'ID',visible:false},
            {field: 'fileResultInfo',title: '文件处理内容',visible:false},
            {field: 'serverIp',title: '文件所在服务器'},
            {field: 'reportFileName',title: '文件名',width:'200px'},
            {field: 'recordNum',title: '文件记录数'},
            {field: 'dealFlag',title: '文件状态',formatter: function(value, row, index){
            	if(value ==0){
            		return "生成文件";
            	}else if(value==1){
            		return "生成失败";
            	}else if(value==2){
            		return "上报成功";
            	}else{
            		return "";
            	}
            }},
            {field: 'timeOutFlag',title: '是否超时处理',formatter: function(value, row, index){
            	if(value==0){
            		return "未超时";
            	}else if(value==1){
            		return "超时";
            	}else{
            		return "";
            	}
            }},
            {field: 'createTime',title: '创建时间'},
            {field: 'dealResult',title: '处理结果代码描述',formatter: function(value, row, index){
            	if(value==0){
            		return "处理完成";
            	}else if(value==1){
            		return "文件解密失败";
            	}else if(value==2){
            		return "文件校验失败";
            	}else if(value==3){
            		return "文件解压缩失败";
            	}else if(value==4){
            		return "文件格式异常";
            	}else if(value==5){
            		return "文件内容异常(版本错误)";
            	}else if(value==51){
            		return "文件内容异常--上报类型错误";
            	}else if(value==52){
            		return "文件内容异常--节点/子节点长度错误";
            	}else if(value==53){
            		return "文件内容异常--节点/子节点类型错误";
            	}else if(value==54){
            		return "文件内容异常--节点/子节点内容错误";
            	}else if(value==55){
            		return "文件内容异常--节点/子节点缺漏";
            	}else if(value==900){
            		return "其他异常(存在其他错误，需重新上报)";
            	}else if(value==999){
            		return "其他异常(处理中)";
            	}else{
            		return "";
            	}
            }},
            {field: 'operating',title: '操作',width:'65px',formatter: function(value, row, index){
            	return "<a   data-target='#myModaledit' onclick='retryReport("+row.fileResultInfo+");' title='重试' class='m-r'>重试</a>";
            }}
        ]
    });
}

function retryReport(fileResult){
	$.ajax({
        url:"/houseinfo/fileRedeal",
        type:"POST",
        data:fileResult,
        async:false,
        dataType: 'json',
        success:function (data) {
            if(data){
            	swal({
                    title: "操作成功",
                    type: "success"})
            }else{
            	swal({title: "操作失败",type: "error"})
            }
        }});
}

//操作类型
function dealFlagFormatterDeal(value, row, index){
    var result = "未知";
    for(var i = 0; i < dealFlagArr.length; i++) {
        if(value == dealFlagArr[i][0]){
            result = dealFlagArr[i][1];
            break;
        }
    }
    return "<a onclick=\"getResult('"+row.userId+"')\">"+result+"</a>";
}



function detail(index){
    var userList = $("#indexTable").bootstrapTable('getData');
    userMain.getDetail( userList[index]);
}

function resetImportProcess() {
    var process = $('#importProcess >div');
    process.attr("style","width: 0%;");
    process.text("0%");
    $('#errorFile').html("");
    $('#lastImportStatus').val(1);
    userImport.syncTime();
}

function preJud(index){
    var list = $("#indexTable").bootstrapTable('getData');
    var userId = list[index].userId;
    var idarr = [];
    idarr.push(userId);
    userMain.doPreJud(idarr);

}

function deleteRow(index){
    var list = $("#indexTable").bootstrapTable('getData');
    var userId = list[index].userId;
    userMain.delete(userId);
}

/*
//审核结果
function verificationResultFormatter(value, row, index){
	if(row.dealFlag ==1 || row.dealFlag ==2 || row.dealFlag ==3 || row.dealFlag == 6){
		return "<a onclick=\"setAuditResult('"+row.userId+"')\">审核结果</a>";
    }else{ return "";}
}
*/

function setAuditResult(id) {
    $("#auditResultMsg tbody").empty();
    $.ajax({
        url:'/user/userValidateMsg',
        type:"post",
        dataType: 'json',
        data: {'userId' : id},
        success:function(result){
            if(result.msg!=null){
                var str=(result.msg).replace(/\r\n/g,'<br/>');
                var html="<tr><td>"+str+"</td></tr>";
                $("#auditResultMsg tbody").append(html);
            }
        }
    });
    $("#resultId").val(id);
    $('#audit-results').modal('show');
}

function changeUserProp(index) {
    var list = $("#indexTable").bootstrapTable('getData');
    var userId = list[index].userId;
    var nature = list[index].nature;
    var czlx=list[index].czlx;
    var dealFlag=list[index].dealFlag;
    var jyzId = list[index].jyzId;
    var title='';
    if(nature==1){
        title='请确认是否将用户属性变更为其他用户？用户主体下服务信息将会一并变更！';
    }else{
        title='请确认是否将用户属性变更为提供互联网应用服务的用户？';
    }
    swal({
        title: title,
        type: "success",
        showCancelButton: true,
        confirmButtonText: "确定",
        closeOnConfirm: true
    }, function (isConfirm) {
        if (isConfirm) {
            $.ajax({
                url:'/user/changeUserNature',
                type:"post",
                dataType: 'json',
                data: {'userId' : userId,'nature':nature,'dealFlag':dealFlag,'operateType':czlx,"jyzId":jyzId},
                success:function(result){
                    if(result.resultCode == 0){
                        $("#indexTable").bootstrapTable('refresh');
                    }else{
                        swal({title: "变更失败",type: "error"})
                    }
                }
            });
        }
    })

}

function editUser(index){
    var userList = $("#indexTable").bootstrapTable('getData');
    var userInfo = userList[index];

    $("#userMianModifyForm").find("label.error").text("");
    icom.tpick.createTimePick().initSingleDate("modify_serviceRegTimeId",4);
    icom.tpick.createTimePick().initSingleDate("modify_registeTimeId",4);
    cselect.initSelectJcdm('dwsx','modify_unitNatureId',null,1);
    cselect.initSelectJcdm('zjlx','modify_idTypeId',null,2);
    cselect.initSelectJcdm('zjlx','modify_officerIdTypeId',null,1);

    $('#modify-modal').modal('show');

    var modifyForm = $('#userMianModifyForm');
    $('#modify_natureId').val(userInfo.nature);
    if (userInfo.nature==2){
        $('#forOtherUser').show();
    }else{
        $('#forOtherUser').hide();
    }
    modifyForm.find('input[name="serviceRegTime"]').val(userInfo.serviceRegTime);
    if(userInfo.identify!=null){
        var identifys =userInfo.identify.split(',');
        identifys.forEach(function (v) {
            modifyForm.find('input[value="'+v+'"]').attr('checked',true);
        });
    }
    modifyForm.find('input[name="unitName"]').val(userInfo.unitName);
    $('#modify_unitNatureId').val(userInfo.unitNature);
    $('#modify_idTypeId').val(userInfo.idType);
    modifyForm.find('input[name="idNumber"]').val(userInfo.idNumber);
    icom.asel.createAreaSelect("modify_addProvince","modify_addCity","modify_addCounty",1,userInfo.unitAddressProvinceCode,userInfo.unitAddressCityCode,userInfo.unitAddressAreaCode);
    modifyForm.find('input[name="unitAddress"]').val(userInfo.unitAddress);
    // if(userInfo.areaCode!=null ){
    //     $('#modify_userMainArea').selectpicker('val', userInfo.areaCode.split(','));
    // }
    var authUser = icom.auth.getUserInfo();
    var authAreaArr = authUser.userAreaCode.split(",");
   //userMain.param.userInfo.areaCode.split(",")
    var dbAreaArr = userInfo.areaCode.split(',');
    var userAreaArr = new Array();
    var temp = 0;
    for(var i=0;i<dbAreaArr.length;++i){
    	for(var j=0;j<authAreaArr.length;++j){
    		if(dbAreaArr[i]==authAreaArr[j]){
    			userAreaArr[temp++]=dbAreaArr[i];
    			break;
    		}
    	}
    }
    var html = '<select  id="modify_userMainArea" class="form-control selectpicker " v-model="areaCode" multiple data-live-search="false" name="areaCode" required></select>';
    $("#areaDiv").html(html);
    cselect.initSelectCommon("modify_userMainArea",'/getUserSubAreaCode',userAreaArr);
    modifyForm.find('input[name="registeTime"]').val(userInfo.registeTime);
    modifyForm.find('input[name="officerName"]').val(userInfo.officerName);
    $('#modify_officerIdTypeId').val(userInfo.officerIdType);
    modifyForm.find('input[name="officerId"]').val(userInfo.officerId);
    modifyForm.find('input[name="officerTelphone"]').val(userInfo.officerTelphone);
    modifyForm.find('input[name="officerMobile"]').val(userInfo.officerMobile);
    modifyForm.find('input[name="officerEmail"]').val(userInfo.officerEmail);
    modifyForm.find('input[name="userId"]').val(userInfo.userId);
}


step={
    index:0,
      wizardModal:function () {
          // $("#add-modal").modal("show");
          //初始化 start
          //默认显示第一步
          $("#wizardAdd  .wizard-steps>div").eq(0).addClass("completed-step active-step").siblings().removeClass("completed-step active-step");
          $("#wizardAdd .wizard-content>.step-content").eq(0).show().siblings().hide();
          // $("#wizardAdd .wizard-content input").val("");
          //初始化时候，上一步btn、完成btn、预审btn隐藏，下一步btn显示
          $("#wizardAdd .prev").parent().css("display", "none");
          $("#wizardAdd .finish").parent().css("display", "none");
          $("#wizardAdd .prequalification").parent().css("display", "none");
          $("#wizardAdd .next").parent().css("display", "inline-block");
          step.index = 0; //index重置为0
          //初始化 end
          $("#wizardAdd .prev").parent().css("display", "none");
          $("#wizardAdd .finish").parent().css("display", "none");
          $("#wizardAdd .prequalification").parent().css("display", "none");
          step.readyNext();
      },

        readyNext:function () {
            //下一步
            $("#wizardAdd .next").off('click').click(function() {
                var res;
                if(step.index==0){
                    res = userMain.mainInfoCheck();
                }else if(step.index==1){
                     res = userMain.userServiceCheck();
                }else if(step.index==2){
                     res = userMain.userBandCheck();
                }
                if (!res){
                    return;
                }
                $("#wizardAdd .prev").parent().css("display", "inline-block");
                step.index++;
                $("#wizardAdd .wizard-steps>div").eq(step.index % 4).addClass("completed-step active-step").siblings().removeClass("active-step");
                $("#wizardAdd .wizard-content>.step-content").eq(step.index % 4).show().siblings().hide();
                // if(step.index== 3) {
                //     $("#wizardAdd .finish").parent().show();
                //     $("#wizardAdd .prequalification").parent().show();
                //     $("#wizardAdd .next").parent().hide();
                // }
                if(step.index == 1){
                	if(userMain.param.userInfo.nature!=undefined  && userMain.param.userInfo.nature==1){
                		$("#wizardAdd .wizard-steps>div").eq(1).show();
                        $("#wizardAdd .finish").parent().show();
                        $("#wizardAdd .prequalification").parent().hide();
                        $("#wizardAdd .next").parent().show();
                        $("#wizardAdd .wizard-steps>div").eq(1).find('titleTab3').text(3);
                        $("#wizardAdd .wizard-steps>div").eq(3).show();
                	}else{
                		step.index++;
                        $("#wizardAdd .wizard-steps>div").eq(step.index % 4).addClass("completed-step active-step").siblings().removeClass("active-step");
                        $("#wizardAdd .wizard-content>.step-content").eq(step.index % 4).show().siblings().hide();
                		$("#wizardAdd .wizard-steps>div").eq(1).hide();
                		$('#titleTab3').text(2);
                        $("#wizardAdd .wizard-steps>div").eq(3).hide();
                        $("#wizardAdd .finish").parent().show();
                        $("#wizardAdd .prequalification").parent().show();
                        $("#wizardAdd .next").parent().hide();
                	}
                	nature = userMain.param.userInfo.nature ;
                	var dest = $('#houseIdSel').parent();
                    var html="<select  id='houseIdSel' class=\"form-control \" name=\"houseId\" required></select>";
                    $('#houseIdSel').remove();
                    dest.html(html);
                	cselect.initSelectCommon("houseIdSel","/getHouseSelectInfo",null,1,1);
                	cselect.initSingleAreaCode("userhhArea",userMain.param.userInfo.areaCode.split(","));
                }else if (step.index == 2){
                    if(userMain.param.userInfo.serviceList!=undefined
                        && userMain.param.userInfo.serviceList[0].setmode==1){
                        // $('#wizard .actions >ul >li').eq(1).show();
                        $("#wizardAdd .wizard-steps>div").eq(3).show();
                        $("#wizardAdd .finish").parent().show();
                        $("#wizardAdd .prequalification").parent().hide();
                        $("#wizardAdd .next").parent().show();
                    }else {
                        $("#wizardAdd .wizard-steps>div").eq(3).hide();
                        $("#wizardAdd .finish").parent().show();
                        $("#wizardAdd .prequalification").parent().show();
                        $("#wizardAdd .next").parent().hide();
                    }
                }else if(step.index == 3){
                    $("#wizardAdd .finish").parent().show();
                    $("#wizardAdd .prequalification").parent().show();
                    $("#wizardAdd .next").parent().hide();
                    var occupyObj = $("form.bandWidthForm").find("select[name='houseId']");
                    occupyHouseId = new Array();
                    for(var i=0;i<occupyObj.length;i++){
                    	occupyHouseId[i]=$(occupyObj[i]).val();
                    }
                    cselect.initSelectCommon("houseIdVir","/getHouseSelectInfo",null,1,1,occupyHouseId);
                }
            });
            //上一步
            $("#wizardAdd .prev").off('click').click(function() {
                $("#wizardAdd .finish").parent().css("display", "none");
                $("#wizardAdd .prequalification").parent().css("display", "none");
                $("#wizardAdd .next").parent().css("display", "inline-block");
                $("#wizardAdd .prev").parent().css("display", "inline-block");
                step.index--;
                $("#wizardAdd .wizard-steps>div").eq(step.index % 3).addClass("active-step").siblings().removeClass("active-step");
                $("#wizardAdd .wizard-content>.step-content").eq(step.index % 3).show().siblings().hide();
                if(step.index % 3 == 0) {
                    $("#wizardAdd .prev").parent().hide();
                    $("#wizardAdd .next").parent().show();
                }else if(step.index==1 && nature==2){
                	step.index--;
                    $("#wizardAdd .wizard-steps>div").eq(step.index % 2).addClass("active-step").siblings().removeClass("active-step");
                    $("#wizardAdd .wizard-content>.step-content").eq(step.index % 2).show().siblings().hide();
                }
            });
            
            $("#registeTimeId").click(function(){
            	$("#layui-laydate4").click(function(){
            		var value = $("#registeTimeId").val();
            		if(value!=null&&value!=''){
            			$("#registeTime_error").text('');
            		}
                });
            });

            //预审
            $("#wizardAdd .prequalification").off('click').click(function () {
                var ret;
                if (step.index==2){
                    ret=userMain.userBandCheck();
                }else if (step.index==3){
                    ret=userMain.userVirCheck();
                }
                if (ret){
                    var info =userMain.param.userInfo;
                    var msg="";
                    $.ajax({
                        url: 'insert',
                        type: 'POST',
                        contentType: 'application/json',
                        data:JSON.stringify(info),
                        async:false,
                        dataType: 'json',
                        success: function(data){
                            if(data!=null && data.resultCode==1 ){
                                if( data.ajaxValidationResultMap[0]!=null && !jQuery.isEmptyObject(data.ajaxValidationResultMap[0].errorsArgsMap)) {
                                    for (var res in data.ajaxValidationResultMap[0].errorsArgsMap) {
                                        msg = msg + data.ajaxValidationResultMap[0].errorsArgsMap[res] + "<br/>";

                                    }
                                }else {
                                    msg=data.resultMsg;
                                }
                                swal({
                                    title: "保存失败",
                                    text: msg,
                                    html:true,
                                    type: "error",
                                }, function(isConfirm) {
                                    // $('#add-modal').modal('hide');
                                    // $("#indexTable").bootstrapTable('refresh');
                                })
                            }else{
                                var title;
                                var type;

                                if (data!=null && data.statusCode==500){
                                    type='error';
                                    if( data.ajaxValidationResultMap[0]!=null &&  !jQuery.isEmptyObject(data.ajaxValidationResultMap[0].errorsArgsMap)) {
                                        for (var res in data.ajaxValidationResultMap[0].errorsArgsMap) {
                                            msg = msg + data.ajaxValidationResultMap[0].errorsArgsMap[res] + "<br/>";

                                        }
                                        title = data.resultMsg;

                                    }else {
                                        title = data.resultMsg;
                                        msg='';
                                    }
                                }else {
                                    type='success';
                                    title = "预审成功，IDC/ISP信息安全管理系统进行用户数据上报审核中！";
                                    msg='已经保存信息';
                                }

                                swal({
                                    title: title,
                                    text: msg,
                                    html:true,
                                    type: type,
                                }, function(isConfirm) {
                                    $('#add-modal').modal('hide');
                                    $("#indexTable").bootstrapTable('refresh');
                                });
                            }
                        }
                    });
                }else {
                    return ret;
                }
            })
        },

};

//服务内容table渲染
function fwnrFormatterModify(value, row, index){
    var result = "";
    var resultList = new Array();
    if (baseData==undefined||baseData==''){
        // 初始化服务内容list
        resultList = jcdmCode.getData().fwnrArr;
    } else {
        resultList = baseData.fwnrArr;
    }
    if(value!=null){
        var fwnrs = value.split(",");
        for(var n in fwnrs){
            for(var i = 0; i <  resultList.length; i++) {
                if(fwnrs[n] ==  resultList[i].id){
                    result += "["+resultList[i].mc+"]";
                    break;
                }
            }
        }

    }
    return result;
}

function getJCDM_STRModify(type,value){
    if (baseData==undefined||baseData==''){
        // 初始化服务内容list
        dataList = jcdmCode.getData().fwnrArr;
    } else {
        dataList = baseData;
    }
    // var dataList = jcdmCode.getData();
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