edit = 0;
var ipSegList = [];
$(function(){
    icom.tpick.createTimePick().initDoubleDate("start","end",4);

    loadSelectHouse('sel_house');

    $("#infotable").bootstrapTable('destroy').bootstrapTable({
        method: 'post',
        url: '/serviceapi/pre/house/ipSegment/query',
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
        uniqueId:'ipSegId',
        columns: [{field: '' ,checkbox:true},
            {field: 'ipSegId',title: 'ID',visible:false},
            {field: 'houseId',title: '机房ID',visible:false},
            {field: 'houseName',title: '机房名称'},
            {field: 'startIP',title: '起始IP',width:'120px'},
            {field: 'endIP',title: '结束IP',width:'120px'},
            {field: 'ipType',title: 'IP使用方式',width:'82px',formatter: ipTypeFormatter},
            {field: 'userName',title: '单位名称',width:'120px'},
            {field: 'useTime',title: '分配日期',width:'100px',formatter: dateFormatter2},
            {field: 'czlx',title: '操作类型',width:'75px',formatter: czlxFormatter},
            {field: 'dealFlag',title: '处理状态',width:'75px',formatter: dealFlagFormatter2},
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
        query.ipType = $('#ipType').val();
        query.startDate = $('#start').val();
        query.endDate = $('#end').val();
        //console.log(query);
        return query;
    }

    $('#searchBtn').click(function(){
        $("#infotable").bootstrapTable('refresh')
    });

    //新增
    $('#btnAdd').on('click',function(e){
        e.preventDefault();
        $("label[name='ip_error']").text("");
        $("label[name='areaCode_error']").text("");
        $("label[name='houseId_error']").text("");
        var valid=addValidate();
        //console.log(valid);
        if(valid){
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/serviceapi/pre/house/ipSegment/insert',
                contentType: 'application/json',
                data: JSON.stringify(ipSegList),
                success : function(result){
                    $("label.error").text('');//先清空lable下error信息
                    if(result.resultCode==0 || result.resultCode==2){
                        var houseIds=[];
                        $.each(ipSegList,function(index,value){
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
                                        window.location.href = '/houseinfo/houseIp';
                                    }
                                });
                            }else{
                                window.location.href = '/houseinfo/houseIp';
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
                                window.location.href = '/houseinfo/houseIp';
                            }
                        })*/
                    }else if(result.resultCode==3){
                        swal({
                            title: "录入数据错误！",
                            text: "存在重复IP地址段："+result.resultMsg,
                            type: "warning",
                        });
                    }else{
                        if(result == null||JSON.stringify(result)=='{}'){
                            swal({title: "保存失败",type: "error"})
                        }else{
                            var errorMsg = "";
                            var text = "";
                            var confickFlag = false;
                            for (var idx in result.ajaxValidationResultMap) {
                                var formindex= ipSegList[parseInt(idx)].outIndex ;
                                var map=result.ajaxValidationResultMap[idx].errorsArgsMap;
                                var error_id = "_error";
                                for (var attr in map) {
                                    if(attr=="startIp:endIp" || attr=="startIP" || attr=="endIP"){
                                        error_id = "endIP_error";
                                        if(errorMsg==""){
                                            errorMsg = map[attr];
                                        }else{
                                            errorMsg = errorMsg +"<br/>"+ map[attr];
                                        }
                                    }else if(attr =="confickIp"){
                                    	confickFlag = true;
                                    	var ipMsgArr = map[attr][0].split(";");
                                    	for(var j=0;j<ipMsgArr.length;j++){
                                    		if((j==0||j==3)&&ipMsgArr[j]!=""){
                                    			text += "<div class='text-danger swal-show' onmouseover='swalMouseover(this)' onmouseout='swalMouseout(this)'>"+ipMsgArr[j]+" <i class='m-l-xs fa fa-angle-up'></i></div><div class='swal-content'><p><strong class='text-danger'>"+ipMsgArr[j+1]+"</strong></p>";
                                    		}else if((j==2||j==5)&&ipMsgArr[j]!=""){
                                    			var ipArr = ipMsgArr[j].split(",");
                                    			for(var i=0;i<ipArr.length;++i){
                                    				if(i==ipArr.length-1){
                                    					text += "<p>"+ipArr[i]+"</p></div>";
                                    				}else{
                                    					text += "<p>"+ipArr[i]+"</p>";
                                    				}
                                    			}
                                    		}
                                    	}
                                    }else{
                                        error_id = attr+'_error';
                                        if(formindex==0){
                                            $('#ipChildForm').find("label[id="+error_id+"]").text(map[attr]);
                                        }else{
                                            $('#ipChildForm'+formindex).find("label[id="+error_id+"]").text(map[attr]);
                                        }
                                    }

                                }
                            }
                            if(!confickFlag&&errorMsg!=""){
                            	text = errorMsg;
                            }
                            if(text!=""){
                                swal({title: "校验失败",text: text,type: "error",html:true})
                            }

                        }
                    }

                }
            });
        }

    });

    
    $('#btnEdit').on('click',function(e){
        e.preventDefault();
        var valid=$("#editForm").validate().form();
        var startip=$('#editForm').find("input[name='startIP']").val();
        var endip=$('#editForm').find("input[name='endIP']").val();
        if(startip==""  || endip==""){
            $('#editForm').find("label[id='endIP_error']").text("请输入正确IP地址段");
            valid = false;
        }else{
            $('#editForm').find("label[id='endIP_error']").text("");
        }
        if(valid) {
            var data = $('#editForm').serialize();
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/serviceapi/pre/house/ipSegment/update',
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                data: data,
                success: function (result) {
                    $("#editForm").find("label.error").text('');
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
                                        window.location.href = '/houseinfo/houseIp';
                                    }
                                });
                            }else{
                                window.location.href = '/houseinfo/houseIp';
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
                                window.location.href = '/houseinfo/houseIp';
                            }
                        })*/
                    } else {
                        if(result.ajaxValidationResultMap==null||JSON.stringify(result.ajaxValidationResultMap)=='{}'){
                            swal({title: "修改失败",type: "error"})
                        }else{
                            var error_id = '_error';
                            var map = result.ajaxValidationResultMap[0].errorsArgsMap;
                            for (var attr in map) {
                            	var text = "";
                            	if(attr=='confickIp'){
                            		var ipMsgArr = map[attr][0].split(";");
                                	for(var j=0;j<ipMsgArr.length;j++){
                                		if((j==0||j==3)&&ipMsgArr[j]!=""){
                                			text += "<div class='text-danger swal-show' onmouseover='swalMouseover(this)' onmouseout='swalMouseout(this)'>"+ipMsgArr[j]+" <i class='m-l-xs fa fa-angle-up'></i></div><div class='swal-content'><p><strong class='text-danger'>"+ipMsgArr[j+1]+"</strong></p>";
                                		}else if((j==2||j==5)&&ipMsgArr[j]!=""){
                                			var ipArr = ipMsgArr[j].split(",");
                                			for(var i=0;i<ipArr.length;++i){
                                				if(i==ipArr.length-1){
                                					text += "<p>"+ipArr[i]+"</p></div>";
                                				}else{
                                					text += "<p>"+ipArr[i]+"</p>";
                                				}
                                			}
                                		}
                                	}
                                	swal({title: "校验失败",text: text,type: "error",html:true})
                            	}else if(attr=='startIp:endIp' || attr=="startIP" || attr=="endIP"){
                                    error_id = 'endIP_error';
                                }else{
                                    error_id = attr +error_id;
                                }
                                $('#editForm').find("label[id="+error_id+"]").text(map[attr]);
                                
                            }
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
        $("#ipChildForm input,select").each(function(){
            $(this).val('');
        });
        var num = $("#idPlus").val();
        if(num>1){
            for (var i=1;i<num;i++){
                $("#ipChildForm"+i).parent().parent().parent().remove();
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
        $("#idPlus").val(insertNum);
        var formId = addTitleHTML.find("form").attr('id');
        formId = formId + num;
        addTitleHTML.find("form").attr('id',formId);

        //隶属单位
        var id = addTitleHTML.find(".selectpicker").attr('id');
        id = id+insertNum;
        //addTitleHTML.find(".selectpicker").attr('id',id);
        //addTitleHTML.find(".selectpicker").next('div').remove();

        addTitleHTML.find("h5>a").removeClass("addTitle").addClass("removeTitleContent").html("<i class=\'fa fa-minus\' name='delBtn' id='"+insertNum+"'></i> 删除");
        addTitleHTML.find(".removeGroup-ip").parent().parent().remove();
        addTitleHTML.find("select[name='houseId']").next().remove(); //清除机房控件div
        $(this).parent().parent().parent().after(addTitleHTML);
        addTitleHTML.find("select[name='houseId']").attr("id","houseIdAdd"+insertNum);
        addTitleHTML.find("select[name='ipType']").attr("id","ipUseType"+insertNum);
        addTitleHTML.find("select[name='areaCode']").attr("id","areaCodeAdd"+insertNum);
        addTitleHTML.find("input[name='userName']").attr("id","useNameAdd"+insertNum);
        sel.loadHouseSel("houseIdAdd"+insertNum);
        sel.loadAreaCodeSelNew("areaCodeAdd"+insertNum,null);
        inputInit("useNameAdd"+insertNum);
        /*$("#houseIdAdd"+insertNum).on("change",function(){
            sel.loadAreaCodeSel("areaCodeAdd"+insertNum,$(this).val());
        });*/
        $("#houseIdAdd"+insertNum).on("change",function(){
            getHouseInfo($(this).val(),"ipUseType"+insertNum);
        });
        addTitleHTML.find("i[name='delBtn']").parent().css("cursor","pointer").on('click',function(){
            //将后面迭代值比当前打的的addForm的全部减一，idPlus也减1
            var idplusVal = $("#idPlus").val();
            var downNum = addTitleHTML.find("i[name='delBtn']").attr("id");
            var formId = "#ipChildForm";
            for(var i=parseInt(downNum);i<parseInt(idplusVal);++i){
                $(formId+i).attr("id",formId+parseInt(i-1));
                $("#idPlus").val(parseInt(idplusVal)-1);
            }
        });
        addTitleHTML.find("#ipUseType"+insertNum).on("change",function(){
            if($(this).val()!=2){
                $(this).parent().parent().parent().parent().find('.blflg').show();
            }else{
                $(this).parent().parent().parent().parent().find('.blflg').hide();
                //ip地址使用方式为保留时,用户单位、证件类型和证件号码应清空
                $(this).parent().parent().parent().parent().find('input[name="userName"]').val('');
                $(this).parent().parent().parent().parent().find('input[name="idNumber"]').val('');
            }
        });
        addTitleHTML.find("#areaCodeAdd_chosen").remove();
        addTitleHTML.find("label.error").text('');
        //删除添加的组
        $(".removeTitleContent").click(function () {
            $(this).parent().parent().parent().remove();
        });
        //cselect.initSelectCommon(id,'/common/getSubOrdArea');

        var nowId = addTitleHTML.find('[name=useTime]').attr('id')+num;
        addTitleHTML.find('[name=useTime]').attr('id',nowId);
        icom.tpick.createTimePick().initSingleDate(nowId,4);
        //清空原来值
        $("#"+id).parent().parent().parent().find(".removeGroup").parent().parent().parent().remove();
        $('#'+formId+' input').val("");

        //表单里面的新增
        $("#"+id).parent().parent().parent().find(".addGroup-ip").click(function  () {
            var addGroupHtmlFram=$(this).parent().parent().clone();
            addGroupHtmlFram.find("a").removeClass("addGroup-ip").addClass("removeGroup-ip").html("<i class=\'fa fa-minus-circle\'></i> 删除");
            addGroupHtmlFram.find("input").val("");
            $(this).parent().parent().after(addGroupHtmlFram);
            //删除添加的组
            $(".removeGroup-ip").click(function () {
                $(this).parent().parent().remove();
            })
        });
    });

    //表单里面的新增
    $(".addGroup-ip").click(function  () {
        var addGroupHTML=$(this).parent().parent().clone();
        addGroupHTML.find("a").removeClass("addGroup-ip").addClass("removeGroup-ip").html("<i class=\'fa fa-minus-circle\'></i> 删除");
        addGroupHTML.find("input").val("");
        addGroupHTML.find("#endIP_error").text('');
        $(this).parent().parent().after(addGroupHTML);
        //删除添加的组
        $(".removeGroup-ip").click(function () {
            $(this).parent().parent().remove();
        })
    });

    $('#ipUseType,#editIpUseType').change(function(){
        if($(this).val()!=2){
            $(this).parent().parent().parent().parent().find('.blflg').show();
        }else{
            $(this).parent().parent().parent().parent().find('.blflg').hide();
            //ip地址使用方式为保留时,用户单位、证件类型和证件号码应清空
            $(this).parent().parent().parent().parent().find('input[name="userName"]').val('');
            $(this).parent().parent().parent().parent().find('input[name="idNumber"]').val('');
        }
    });

    $('#houseId_add').change(function(){
        getHouseInfo($(this).val(),"ipUseType");
    });

});


function operateFormatter(value, row, index){
    var op="";
    var updateRole=$("#updateRole").val();
    var delRole=$("#delRole").val();
    var status=row.dealFlag;
    var czlx=row.czlx;
    //处理标记（0-未预审、1-预审不通过、2-上报审核中、3-上报审核不通过、4-提交上报、5-上报成功、6-上报失败）
    if(!(status==0 && czlx==3)){
        if(updateRole==1){
            op+="<a  data-toggle='modal' data-target='#myModaledit' onclick=\"beforeUpdate('"+row.ipSegId+"');\" title='修改' class='m-r'><i class='fa fa-edit fa-lg'></i></a>";
        }
        if(delRole==1){
            op+="<a  class='m-r demo4' onclick=\"deleteFun('"+row.ipSegId+"','"+row.houseId+"');\"  title='删除'><i class='fa fa-close fa-lg'></i></a>" ;
        }
    }
    return op;
}

function getHouseInfo(houseId,tid,value){
    $.ajax({
        url:'/houseinfo/getHouseDetail',
        type:"get",
        dataType: 'json',
        data: {'houseId' : houseId},
        success:function(result){
            var opt="<option value=\"\">请选择</option>";
            if(result.identity==5){
                opt+="<option value=\"2\">保留</option>";
                opt+="<option value=\"3\">专线</option>";
            }else{
                opt+="<option value=\"0\">静态</option>";
                opt+="<option value=\"1\">动态</option>";
                opt+="<option value=\"2\">保留</option>";
                opt+="<option value=\"999\">云虚拟</option>";
            }
            $("#"+tid).children().remove();
            $("#"+tid).append(opt);
            if(value!=undefined && value!=null){
                $("#"+tid).find("option[value = '"+value+"']").attr("selected","selected");
            }
        }
    });
}

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

function addFun(){
    cleanErrorText("myModaladd");
    $("#myModaladd").find(".removeGroup-ip").parent().parent().remove();
    $("#myModaladd").find("#endIP_error").text('');
    $("#myModaladd").find("#areaCode_error").text('');
    $("#myModaladd").find("#houseId_error").text('');
    //cselect.initSelectSingle("houseId_add","/getHouseSelectInfo");
    sel.loadHouseSel("houseId_add");
    sel.loadAreaCodeSelNew("areaCodeAdd");
    //cselect.initSelectCommon("ipInfoArea","/common/getSubOrdArea","");
    cselect.initSelectJcdm('zjlx','ipTypeAdd',null);
    icom.tpick.createTimePick().initSingleDate('startUseAdd',4);
    inputInit("useNameAdd");
    $('#myModaladd').modal('show');
}

function addValidate(){
    $("#myModaladd").find("label .error").text('');
    $("#myModaladd").find("#endIP_error").text('');
    $("#myModaladd label[id^='areaCode_error']").text('');
    $("#myModaladd").find("#houseId_error").text('');
    var validate = true;
    var idArr = [];
    var realEntity = [];
    realEntity.push($('#ipChildForm').serializeObject());
    idArr.push('ipChildForm');
    var idend = $("#idPlus").val();
    for(var i=1;i<idend;i++){
        var ipenty =  $("#ipChildForm"+i).serializeObject();
        if(!jQuery.isEmptyObject(ipenty)){
            idArr.push('ipChildForm'+i);
            realEntity.push(ipenty);
        }
    }

    var userInfo = icom.auth.getUserInfo();
    //组装数据
    var objArr = [];
    var outIndex = 0;
    var innerIndex = 0;
    for(var obj in realEntity){
        if(Array.isArray(realEntity[obj].areaCode)){
            realEntity[obj].areaCode = realEntity[obj].areaCode.join(",");
        }
        if(Array.isArray(realEntity[obj].startIpAdd)){
            for(var i=0;i< realEntity[obj].startIpAdd.length;i++){
                var obj1 = {};
                obj1.startIP = realEntity[obj].startIpAdd[i] ;
                obj1.endIP = realEntity[obj].endIpAdd[i];
                obj1.ipType = realEntity[obj].ipType;
                obj1.useTime =realEntity[obj].useTime;
                obj1.areaCode = realEntity[obj].areaCode;
                obj1.houseId = realEntity[obj].houseId;
                if(realEntity[obj].ipType==2){
                    obj1.userName = "";
                    obj1.idType = "";
                    obj1.idNumber ="" ;
                }else{
                    obj1.userName = realEntity[obj].userName;
                    obj1.idType = realEntity[obj].idType;
                    obj1.idNumber = realEntity[obj].idNumber ;
                }
                obj1.innerIndex = innerIndex;
                obj1.outIndex = outIndex;
                objArr.push(obj1);
                innerIndex++;
            }
        }else{
            if(realEntity[obj].ipType==2){
                realEntity[obj].userName = "";
                realEntity[obj].idType = "";
                realEntity[obj].idNumber ="" ;
            }
            realEntity[obj].startIP =realEntity[obj].startIpAdd;
            realEntity[obj].endIP = realEntity[obj].endIpAdd;
            realEntity[obj].innerIndex = innerIndex;
            realEntity[obj].outIndex = outIndex;
            objArr.push(realEntity[obj]);
            innerIndex++;
        }
        outIndex++;
    }

    if(objArr.length<=0){
        return validate;
    }
    //校验数据
    for(var n in idArr){
        if(!$('#'+idArr[n]).valid()){
            validate = false;
        }
    }
    var startIpAdds = document.getElementsByName('startIpAdd');
    var endIpAdds = document.getElementsByName('endIpAdd');
    for(var m=0;m<startIpAdds.length;m++){
        if(startIpAdds[m].value==""  || endIpAdds[m].value==""){
            $("label[id='endIP_error']").eq(m).text("请输入正确IP地址段");
            validate = false;
        }
    }
    for(var ob3 in objArr){
        if(objArr[ob3].houseId == undefined || objArr[ob3].houseId==""){
            $("label[id='houseId_error']").eq(objArr[ob3].outIndex).text("请选择机房");
            validate = false;
        }
        if(objArr[ob3].areaCode == undefined || objArr[ob3].areaCode==""){
            $("label[id='areaCode_error']").eq(objArr[ob3].outIndex).text("请选择隶属单位");
            validate = false;
        }else{
            objArr[ob3].createUserId = userInfo.userId;
            objArr[ob3].updateUserId = userInfo.userId;
            if(userInfo.userAreaCode!=null){
                objArr[ob3].cityCodeList = userInfo.userAreaCode.split(",");
            }
        }
    }
    if(!validate){
        return validate;
    }
    ipSegList = objArr;
    return validate;
}

function beforeUpdate(id){
    //loadSelectHouse('houseId_edit');
    $("#editForm").find("label.error").text('');
    $("#editForm").find("#endIP_error").text('');
    $("#editForm").find("#areaCode_error").text('');
    $("#editForm").find("#houseId_error").text('');
    var data = $('#infotable').bootstrapTable('getRowByUniqueId', id);
    var inputs = $('#editForm').find('input[class="form-control"],input[class="form-control valid"]');
    var textIDArray = new Array();
    for(var i=0;i<inputs.size();i++){
        textIDArray[i] = inputs[i].name;
    }
    setFormdata(textIDArray, data, $('#editForm'));
    $('#editForm').find("input[name=ipSegId]").val(data.ipSegId);
    $('#editForm').find("select[name=distribution]").val(data.distribution);
    $('#editForm').find("select[name=occupancy]").val(data.occupancy);
    $('#editForm').find("select[name=useType]").val(data.useType);
    //$('#editForm').find("select[name=ipType]").val(data.ipType);
    $('#editForm').find("input[name=houseId]").val(data.houseId);
    edit++;
    //$("#areaCodeEdit").chosen("destroy");
    //sel.loadAreaCodeSel("areaCodeEdit",data.houseId,data.areaCode);
    sel.loadAreaCodeSelNew("areaCodeEdit",data.areaCode);
    //cselect.initSelectCommon("areaCodeEdit",'/common/getAreaByHouseId?houseId='+data.houseId,data.areaCode.split(","));

    //cselect.initSelectCommon("areaCodeEdit",'/common/getSubOrdArea',data.areaCode.split(","));
    cselect.initSelectJcdm('zjlx','ipTypeEdit',data.idType);
    icom.tpick.createTimePick().initSingleDate('useTimeAdd',4);
    var userInfo = icom.auth.getUserInfo();
    $('#editForm').find("input[name=updateUserId]").val(userInfo.userId);
    inputInit("useNamEdit");
    if(data.ipType==2){
        $("#editForm").find('.blflg').hide();
    }else{
        $("#editForm").find('.blflg').show();
    }
    getHouseInfo(data.houseId,"editIpUseType",data.ipType);
}

function deleteFun(id,houseId){
    var ids = [];
    var houseIds = [];
    if (typeof(id) == "undefined") {
        var rows= $("#infotable").bootstrapTable('getSelections');
        if (rows.length > 0) {
            for ( var i = 0; i < rows.length; i++) {
                ids.push(rows[i].ipSegId);
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
                url:'/serviceapi/pre/house/ipSegment/delete',
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
                }
            });
        }
    });

}


function loadSelectHouse(id){
    var sel_house = icom.rsel.createRichSelect(id,{
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

//鼠标移入
function swalMouseover (obj) {
    $(obj).find("i").addClass("fa-angle-down").removeClass("fa-angle-up")
  console.log($(obj).text())
	$(obj).next().show();
};
//鼠标移出
function swalMouseout (obj) {
    $(obj).find("i").addClass("fa-angle-up").removeClass("fa-angle-down")
    $(obj).next().hide();
}
