var stepValue = 0;
$(function(){
    $("#subCityTable").bootstrapTable('destroy').bootstrapTable({
        method: 'post',
        url: '/subCity/listSubCity',
        queryParams : function (params) {
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {   
            	pageSize: params.limit,                         //页面大小
            	pageIndex: (params.offset / params.limit) + 1,   //页码
                sort: params.sort,      //排序列名  
                sortOrder: params.order, //排位命令（desc，asc） 
                areaName:$('#sel_areaName').val(),
                areaCode:$('#sel_areaCode').val()
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
        pageList: [10, 15, 50, 100, 200],
        uniqueId:'areaCode',
        columns: [
            {field: 'check',title: 'title',checkbox:true},
            {field: 'areaName',title: '隶属单位名称',width:'120px'},
            {field: 'areaCode',title: '单位编码',width:'120px'},
            {field: 'operating',title: '操作',width:'130px',formatter: operateFormatter}
        ]
    });
    $('#houseIndexSearch').click(function(){
    	var opt={
    			method: 'post',
    	        url: '/subCity/listSubCity',
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
    	                bandWidth:$('#sel_bandWidth').val(),
    	                czlx:$('#sel_czlx').val(),
    	                dealFlag:$('#sel_dealFlag').val(),
    	                updateTime:$('#sel_updateTime').val()
    	            };
    	            return temp;
    	        }
    	};
    	$("#subCityTable").bootstrapTable("refresh",{url: '/subCity/listSubCity' });
    });
    
    $("#addButton").on('click',function(){
    	$("input").val("");
        $("label.error").text("");
    });
    
    //新增
    $('#btnAdd').on('click',function(e){
        e.preventDefault();
        var data;
        var jsonStr="";
        var flag = true;
        var areaNameMap =[];
        for(var i =0;i<=stepValue;++i){
        	if($("#addForm"+i).length>0){
        		data = decodeURIComponent($("#addForm"+i).serialize(),true);
        		if(i==stepValue){
        			jsonStr = jsonStr + data;
        		}else{
        			jsonStr = jsonStr + data+",";
        		}
            	var valid=$("#addForm"+i).validate().form();
            	var validateFlag = AjaxValidator.isValid("addForm"+i, '/subCity/validate');
            	if(valid==false||validateFlag==null||validateFlag==false){
            		flag = false;
            	}
        	}
        }
        if(flag){
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/subCity/insert',
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
               // contentType: 'application/json',
                data: {"params":jsonStr},
                //data:JSON.stringify(areaNameMap),
                success : function(result){
                	if(result.resultCode==3){
               		 swal({
                	        title: "录入数据错误！",
                	        text: result.resultMsg,
                	        type: "error",
                	    });
                	}else if(result.resultCode==1){
                    	swal({title: "新增失败",type: "error"})
                    }else{
                    	swal({
                            title: "新增成功",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonText: "确定",
                            closeOnConfirm: true
                        }, function(isConfirm) {
                            if(isConfirm) {
                                window.location.href = '/subCity/index';
                            }
                        })
                    }
                }
            });
        }

    });
   //批量删除
    $("#allDelte").click(function(){
    	var rows =$("#subCityTable").bootstrapTable('getSelections');
    	if(rows.length==0){
    		swal({title: "请勾选需要删除的数据",type: "warning"})
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
            		for(var i=0;i<rows.length;i++){
            			if(i<rows.length-1){
            				links = links + rows[i].areaCode + ",";
            			}else{
            				links = links + rows[i].areaCode;
            			}
            			
            		}
            		delFunction(links);
            	}else{
            		swal("已取消", "取消了批量删除操作！", "error")
            	}
            	
            });
    	}
    	
    }
    );

    $('#btnEdit').on('click',function(e){
        e.preventDefault();
        $("#editForm").find("label.error").text('');
        var valid=$("#editForm").validate().form();
        if(valid) {
            var validateFlag = AjaxValidator.isValid("editForm", '/subCity/validate');
            if (validateFlag) {
                var data = $('#editForm').serialize();
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/subCity/update',
                    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                    data: data,
                    success: function (result) {
                        if (result.resultCode == 0) {
                            swal({
                                title: "修改成功",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonText: "确定",
                                closeOnConfirm: true
                            }, function (isConfirm) {
                                if (isConfirm) {
                                    window.location.href = '/subCity/index';
                                }
                            })
                        } else {
                            swal({title: "保存失败",type: "error"})
                        }

                    }
                });
            }
        }
    });

    //新增取消
    $('#btnCancel').on('click',function(e){
    	$("form").find("input").val('');
    	//$("form").not("#addForm0").parent().parent().parent().parent().parent().remove();
        $("#addForm input,select").each(function(){
            $(this).val('');
        });
    });

    $('#btnCancelEdit').on('click',function(e){
        $("#editForm input,select").each(function(){
            $(this).val('');
        });
    });
    $("#addFormTitle").click(function () {
    	var addTitleHTML=$(this).parent().parent().parent().clone();
    	stepValue= stepValue+1;
        var id = addTitleHTML.find(".selectpicker").attr('id');
        addTitleHTML.find("a").removeClass("addTitle").addClass("removeTitleContent").html("<i class=\'fa fa-minus\' name='delBtn'></i> 删除");
    	addTitleHTML.find("form").attr("id","addForm"+stepValue);
    	addTitleHTML.find("input").val('');
    	addTitleHTML.find("label.error").text('');
    	$("#bottomDIv").before(addTitleHTML);
    	addTitleHTML.find("i[name='delBtn']").parent().css("cursor","pointer").on('click',function(){
    		$(this).parent().parent().parent().remove();
    		//stepValue = stepValue-1;
    	});
    });	

    
});

function operateFormatter(value, row, index){
    var op="";
    var updateRole=$("#updateRole").val();
    var delRole=$("#delRole").val();
    if(updateRole==1){
    	//处理标记（0-未预审、1-预审不通过、2-上报审核中、3-上报审核不通过、4-提交上报、5-上报成功、6-上报失败）
        op+="<a data-toggle='modal' data-target='#myModaledit' onclick=\"beforeUpdate('"+row.areaCode+"');\" title='修改' class='m-r'><i class='fa fa-edit fa-lg'></i></a>";
    }
    if(delRole==1){
    	op+="<a  class='m-r demo4' onclick=\"deleteFun('"+row.areaCode+"');\"  title='删除'><i class='fa fa-close fa-lg'></i></a>" ;
    }
    console.log(row.dealFlag);
    return op;
}

function beforeUpdate(areaCode){
	$("#editForm").find("label.error").text('');
    var data = $('#subCityTable').bootstrapTable('getRowByUniqueId', areaCode);
    var inputs = $('#editForm').find('input[class="form-control"]');
    var textIDArray = new Array();
    for(var i=0;i<inputs.size();i++){
        textIDArray[i] = inputs[i].name;
    }
    setFormdata(textIDArray, data, $('#editForm'));
    $('#editForm').find("input[name=areaName]").val(data.areaName);
    $('#editForm').find("input[name=areaCode]").val(data.areaCode);
    $('#editForm').find("input[name=preCode]").val(data.areaCode);
}

function revokeValid(areaCode){
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
                data: {'areaCode' : areaCode},
                success:function(result){
                    if(result.resultCode == 0){
                        $("#subCityTable").bootstrapTable('refresh');
                    }else{
                        swal({title: "撤销失败",type: "error"})
                    }
                }
            });
        }
    })
}

function preValid(areaCode){
    $.ajax({
        url:'/serviceapi/pre/idcinfo/preValidate',
        type:"post",
        dataType: 'json',
        data: {'areaCode' : areaCode},
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
            $("#subCityTable").bootstrapTable('refresh');
        }
    });
}
function cascadeValid(areaCode){
    $.ajax({
        url:'/serviceapi/pre/idcinfo/preValidate',
        type:"post",
        dataType: 'json',
        data: {'areaCode' : areaCode},
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
            $("#subCityTable").bootstrapTable('refresh');
        }
    });
}

function deleteFun(areaCode){
	swal({
        title: "确定要删除这条信息吗",
        text: "删除后将无法恢复，请谨慎操作！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是的，我要删除！",
        cancelButtonText: "让我再考虑一下…",
        closeOnConfirm: true,
        closeOnCancel: false
    }, function(isConfirm) {
    	if(isConfirm){
    		delFunction(areaCode);
    	}else{
    		swal("已取消", "取消了删除操作！", "error")
    	}
    });
	
}
function delFunction(areaCode){
	$.ajax({
        url:'/subCity/delete',
        type:"post",
        dataType: 'json',
        data: {'ids' : areaCode},
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
                swal({
                    title: "删除成功！",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                })
            }
        	$("#subCityTable").bootstrapTable('refresh');
        }
       
    });
}