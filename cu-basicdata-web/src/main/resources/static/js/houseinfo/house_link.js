$(function(){
	edit = 0;
	var opts = {
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
	    };
	let sel_house = icom.rsel.createRichSelect("ser_house",opts);
    sel_house.render();
    
    icom.tpick.createTimePick().initDoubleDate("start","end",1);
    $("#houseLinktable").bootstrapTable('destroy').bootstrapTable({
        method: 'post',
        url: '/houseLink/listHouseLink',
        queryParams : function (params) {
        	 var query = "";
        	 var houseIDS ="";
             query = $('#searchForm').serializeObject();
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
                linkNo:$('#sel_linkNo').val(),
                gatewayIP:$('#sel_gatewayIP').val(),
                //bandWidth:$('#sel_bandWidth').val(),
                czlx:$('#sel_czlx').val(),
                dealFlag:$('#sel_dealFlag').val(),
                updateTime:$('#sel_updateTime').val()
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
        uniqueId:'gatewayId',
        columns: [
            {field: 'check',title: 'title',checkbox:true},
            {field: 'gatewayId',title: 'ID',visible:false},
            {field: 'houseId',title: '机房Id',visible:false},
            {field: 'houseName',title: '机房名称'},
            {field: 'linkNo',title: '链路编号',width:'120px'},
            {field: 'gatewayIP',title: '机房出入口网关IP地址',width:'180px'},
            {field: 'bandWidth',title: '机房互联网出入口带宽(Mbps)',width:'100px'},
            {field: 'czlx',title: '操作类型',width:'80px',formatter: czlxFormatter},
            {field: 'dealFlag',title: '处理状态',width:'80px',formatter: dealFlagFormatter2},
            {field: 'updateTime',title: '更新时间',width:'100px',formatter: dateFormatter},
            {field: 'operating',title: '操作',width:'65px',formatter: operateFormatter}
        ]
    });
    $('#houseIndexSearch').click(function(){
    	var opt={
    			method: 'post',
    	        url: '/houseLink/listHouseLink',
    	        queryParams : function (params) {
    	            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
    	            var temp = {   
    	                rows: params.limit,                         //页面大小
    	                page: (params.offset / params.limit) + 1,   //页码
    	                sort: params.sort,      //排序列名  
    	                sortOrder: params.order, //排位命令（desc，asc） 
    	                houseId:$('#sel_house').val(),
    	                linkNo:$('#sel_linkNo').val(),
    	                gatewayIP:$('#sel_gatewayIP').val(),
    	                //bandWidth:$('#sel_bandWidth').val(),
    	                czlx:$('#sel_czlx').val(),
    	                dealFlag:$('#sel_dealFlag').val(),
    	                updateTime:$('#sel_updateTime').val()
    	            };
    	            return temp;
    	        }
    	};
    	$("#houseLinktable").bootstrapTable("refresh",{url: '/houseLink/listHouseLink' });
    });
    
    //新增
    $('#btnAdd').on('click',function(e){
        e.preventDefault();
        $("label.error").text('');
        var flag = true;
        var num= parseInt($("#addStep").val())+1;
        for (var i=0;i<num;i++){
            var bandVal = $("#addForm"+i).find("input[name='bandWidth']").val();
            if(!/^\d+$/.test(bandVal)){
            	$("#addForm"+i).find("label[id='bandWidth_error']").text("请输入非负整数");
            	flag = false;
            }else{
                $("#addForm"+i).find("label[id='bandWidth_error']").text("");
            }
            var houseIdVal = $("#addForm"+i).find("select[name='houseId']").val();
            if(houseIdVal == null || houseIdVal==""){
                $("#addForm"+i).find("label[id='idcName_error']").text("请选择机房");
                flag = false;
            }else{
                $("#addForm"+i).find("label[id='idcName_error']").text("");
            }
            var areaVal = $("#addForm"+i).find("select[name='areaCode']").val();
            if(areaVal == null || areaVal==""){
                $("#addForm"+i).find("label[id='areaCode_error']").text("请选择隶属单位");
                flag = false;
            }else{
                $("#addForm"+i).find("label[id='areaCode_error']").text("");
            }
        }
        if(!flag){
        	return ;
        }
        var houseIds=[];
        var stepValue= parseInt($("#addStep").val());
        var data;
        var jsonStr="";
        var flag = true;
        for(var i =0;i<=stepValue;++i){
        	if($("#addForm"+i).length>0){
        		data = decodeURIComponent($("#addForm"+i).serialize(),true);
        		if(i==stepValue){
        			jsonStr = jsonStr + data;
        		}else{
        			jsonStr = jsonStr + data+",";
        		}
        		var houseIdzz=$("#addForm"+i).find("select[name='houseId']").val();
                if($.inArray(houseIdzz,houseIds)==-1) {
                    houseIds.push(houseIdzz);
                }
        	}
        	var valid=$("#addForm"+i).validate().form();
        	if(valid==false){
        		flag = false;
        	}
        }
        if(flag){
        	 var data = $('#addForm').serialize();
             $.ajax({
                 type: 'POST',
                 dataType: 'json',
                 url: '/houseLink/insert',
                 contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                 data: {"params":jsonStr},
                 success : function(result){
                	 $("label.error").text('');//先清空lable下error信息
                     if(result.resultCode==1/*result != null&&JSON.stringify(result)!='{}'*/){
                    	 for (var idx in result.ajaxValidationResultMap) {
                       		 var map=result.ajaxValidationResultMap[idx].errorsArgsMap;
                                var error_id = "_error";
                                for (var attr in map) {
                                	error_id = attr+'_error';
                                	$('#addForm'+idx).find("label[id="+error_id+"]").text(map[attr]);
                                }
                       	}
                    	 /*
                         for (var idx in result.ajaxValidationResultMap) {
                             var error_id = idx+'_error';
                        	 var map = result.ajaxValidationResultMap[idx].errorsArgsMap
                        	 for (var attr in map) {
                                 var error_id = attr + '_error';
                                 $('#addForm' + idx).find("label[id="+error_id+"]").text(map[attr]);
                             }
                         }*/
                     } else if(result.resultCode==3){
                    	 swal({
                    	        title: "录入数据错误！",
                    	        text: "存在重复链路编号："+result.resultMsg,
                    	        type: "warning",
                    	    });
                     }else{

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
                                         window.location.href = '/houseLink/index';
                                     }
                                 });
                             }else{
                                 window.location.href = '/houseLink/index';
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
                                 window.location.href = '/houseLink/index';
                             }
                         })*/
                     }
                 }
             });
        }

    });
   //批量删除
    $("#allDelte").click(function(){
    	var rows =$("#houseLinktable").bootstrapTable('getSelections');
    	if(rows.length==0){
    		swal({title: "请勾选需要删除的数据",type: "warning"})
    		//alert("请勾选需要删除的数据");
    	}else{
    		swal({
                title: "确定批量删除这"+rows.length+"条信息吗?",
                text: "删除后将无法恢复，请谨慎操作！",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "是的，我要删除！",
                cancelButtonText: "取消",
                closeOnConfirm: true,
                closeOnCancel: false
            }, function(isConfirm) {
            	if(isConfirm){
            		var links="";
            		var houseId="";
            		for(var i=0;i<rows.length;i++){
            			if(i<rows.length-1){
            				links = links + rows[i].gatewayId + ",";
                            houseId += rows[i].houseId + ",";
            			}else{
            				links = links + rows[i].gatewayId;
                            houseId += rows[i].houseId;
            			}
            			
            		}
            		delFunction(links,houseId);
            	}else{
            		swal("已取消", "取消了批量删除操作！", "error")
            	}
            	
            });
    	}
    }
    );

    
    $('#btnEdit').on('click',function(e){
        e.preventDefault();
        var valid=$("#editForm").validate().form();
        if(valid) {
        	var bandVal = $("#editForm").find("input[name='bandWidth']").val();
            if(!/^\d+$/.test(bandVal)){
            	$("#editForm").find("label[id='bandWidth_error']").text("请输入非负整数");
            	return;
            }else{
                $("#editForm").find("label[id='bandWidth_error']").text("");
            }
        	var data = $('#editForm').serialize();
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/houseLink/update',
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
                                        window.location.href = '/houseLink/index';
                                    }
                                });
                            }else{
                                window.location.href = '/houseLink/index';
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
                                window.location.href = '/houseLink/index';
                            }
                        })*/
                    } else {
                    	var error_id = '_error';
                      	 var map = result.ajaxValidationResultMap[0].errorsArgsMap
                      	 for (var attr in map) {
                               var error_id = attr + '_error';
                               $('#editForm').find("label[id="+error_id+"]").text(map[attr]);
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
        $("#addForm0 input,select").each(function(){
            $(this).val('');
        });
        
        var num= parseInt($("#addStep").val())+1;
        if(num>1){
            for (var i=1;i<num;i++){
                $("#addForm"+i).parent().parent().parent().parent().parent().remove();
            }
        }
        $("#addStep").val(0);
    });
    

    $('#btnCancelEdit').on('click',function(e){
        $("#areaCodeEdit").chosen("destroy");
        $("#editForm input,select").each(function(){
            $(this).val('');
        });
    });
    $("#addFormTitle").click(function () {
    	var addTitleHTML=$(this).parent().parent().parent().clone();
    	var stepValue= parseInt($("#addStep").val())+1;
        var id = addTitleHTML.find(".selectpicker").attr('id');
    	addTitleHTML.find("a").removeClass("addTitle").addClass("removeTitleContent").html("<i class=\'fa fa-minus\' name='delBtn'></i> 删除");
    	addTitleHTML.find("form").attr("id","addForm"+stepValue);
    	addTitleHTML.find("input").val('');
    	addTitleHTML.find("select").val('');
    	/*addTitleHTML.find("input[name='bandWidth']").val('');
    	addTitleHTML.find("input[name='houseId']").val('');*/
        addTitleHTML.find("select[name='houseId']").next().remove(); //清除机房控件div
    	addTitleHTML.find("select[name='houseId']").attr("id","houseIdAdd"+stepValue);
    	addTitleHTML.find("select[name='areaCode']").attr("id","areaCodeAdd"+stepValue);
    	addTitleHTML.find("label.error").text('');
    	//cselect.initSelectCommon("linkInfoArea1","/common/getSubOrdArea","");
    	$("#bottomDIv").before(addTitleHTML);
        sel.loadHouseSel("houseIdAdd"+stepValue);
    	addTitleHTML.find("#areaCodeAdd_chosen").remove();
    	/*addTitleHTML.find("select[name='houseId']").on("change",function(){
        	var value = addTitleHTML.find("form").formToJSON().houseId;
        	var id = addTitleHTML.find("select[name='areaCode']").attr("id");
        	sel.loadAreaCodeSel(id,value,null,null);
        });*/
    	
    	
    	addTitleHTML.find("i[name='delBtn']").parent().css("cursor","pointer").on('click',function(){
    		$(this).parent().parent().parent().remove();
    	});
    	$("#addStep").val(stepValue);

        sel.loadAreaCodeSelNew("areaCodeAdd"+stepValue,null);
    	/*$("#houseIdAdd"+stepValue).on("change",function(){
    		sel.loadAreaCodeSel("areaCodeAdd"+stepValue,$(this).val());
    	});*/
    	
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
            op+="<a data-toggle='modal' data-target='#myModaledit' onclick=\"beforeUpdate('"+row.gatewayId+"');\" title='修改' class='m-r'><i class='fa fa-edit fa-lg'></i></a>";
        }
        if(delRole==1){
            op+="<a  class='m-r demo4' onclick=\"deleteFun('"+row.gatewayId+"','"+row.houseId+"');\"  title='删除'><i class='fa fa-close fa-lg'></i></a>" ;
        }
    }
    return op;
}

function beforeUpdate(gatewayId){
	$("#editForm").find("label.error").text('');
    var data = $('#houseLinktable').bootstrapTable('getRowByUniqueId', gatewayId);
    var inputs = $('#editForm').find('input[class="form-control"]');
    var textIDArray = new Array();
    for(var i=0;i<inputs.size();i++){
        textIDArray[i] = inputs[i].name;
    }
    
    setFormdata(textIDArray, data, $('#editForm'));
    $('#editForm').find("input[name=gatewayId]").val(data.gatewayId);
    $('#editForm').find("select[name=officerIdType]").val(data.officerIdType);
    $('#editForm').find("select[name=ecIdType]").val(data.ecIdType);
    edit++;
    //$("#areaCodeEdit").chosen("destroy");
    //sel.loadAreaCodeSel("areaCodeEdit",data.houseId,data.areaCode);
    sel.loadAreaCodeSelNew("areaCodeEdit",data.areaCode);
    //cselect.initSelectCommon("areaCodeEdit",'/common/getAreaByHouseId?houseId='+data.houseId,data.areaCode.split(","));
    cselect.initSelectSingle("houseId_edit","/getHouseSelectInfo");
    $('#editForm').find("select[name=ecIdType]").val(data.ecIdType);
    $('#editForm').find("select[name=houseId]").val(data.houseId);
    $('#editForm').find("input[name='houseId']").val(data.houseId);
}

function addFun(){
    cleanErrorText("myModaladd");
    //cselect.initSelectSingle("houseId_add","/getHouseSelectInfo");
    sel.loadHouseSel("houseId_add");
    sel.loadAreaCodeSelNew("areaCodeAdd");
	//机房
   /* var html1 ='<select  id="houseId_add" class="form-control selectpicker " multiple data-live-search="false" name="houseId" required>' +
        '                            </select>';
    $("#houseIds").html(html1);
    cselect.initSelectCommon("houseId_add","/getHouseSelectInfo","",1);*/
    $('#myModaladd').modal('show');
}

function revokeValid(gatewayId){
    swal({
        title: "请确认是否撤销预审？",
        type: "success",
        showCancelButton: true,
        confirmButtonText: "确定",
        closeOnConfirm: true
    }, function (isConfirm) {
        if (isConfirm) {
            $.ajax({
                url:'/serviceapi/pre/idcinfo/revokeValid',
                type:"post",
                dataType: 'json',
                data: {'gatewayId' : gatewayId},
                success:function(result){
                    if(result.resultCode == 0){
                        $("#houseLinktable").bootstrapTable('refresh');
                    }else{
                        swal({title: "撤销失败",type: "error"})
                    }
                }
            });
        }
    })
}

function preValid(gatewayId){
    $.ajax({
        url:'/serviceapi/pre/idcinfo/preValidate',
        type:"post",
        dataType: 'json',
        data: {'gatewayId' : gatewayId},
        success:function(result){
            if(result.resultCode == 0){
                swal({
                    title: "预审通过，IDC/ISP信息安全管理系统进行数据上报审核中！",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                })
            }else{
                swal({
                    title: "预审不通过，请查看校验结果，修订相关数据！",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                })
            }
            $("#houseLinktable").bootstrapTable('refresh');
        }
    });
}
function cascadeValid(gatewayId){
    $.ajax({
        url:'/serviceapi/pre/idcinfo/preValidate',
        type:"post",
        dataType: 'json',
        data: {'gatewayId' : gatewayId},
        success:function(result){
            if(result.resultCode == 0){
                swal({
                    title: "预审通过，IDC/ISP信息安全管理系统进行数据上报审核中！",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                })
            }else{
                swal({
                    title: "预审不通过，请查看校验结果，修订相关数据！",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                })
            }
            $("#houseLinktable").bootstrapTable('refresh');
        }
    });
}

function deleteFun(gatewayId,houseId){
	swal({
        title: "确定要删除这条信息吗",
        text: "删除后将无法恢复，请谨慎操作！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是的，我要删除！",
        cancelButtonText: "取消",
        closeOnConfirm: true,
        closeOnCancel: false
    }, function(isConfirm) {
    	if(isConfirm){
    		delFunction(gatewayId,houseId);
    	}else{
    		swal("已取消", "取消了删除操作！", "error")
    	}
    });
	
}
function delFunction(gatewayId,houseId){
	$.ajax({
        url:'/houseLink/delete',
        type:"post",
        dataType: 'json',
        data: {'linkIds' : gatewayId},
        success:function(result){
        	if(result.resultCode == 1){
                swal({
                    title: "删除失败！",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                })
            }else{
        	    var houseIds=houseId.split(",");
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
                                //$("#houseLinktable").bootstrapTable('refresh');
                            }
                        });
                    }
                })

                /*swal({
                    title: "删除成功！",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                })*/
            }
        	$("#houseLinktable").bootstrapTable('refresh');
        }
       
    });
}