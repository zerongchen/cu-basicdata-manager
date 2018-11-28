var rank =0;
var subId=0;
function getResaultHtml(data){
    var html="";
    for(var n in data){
        if(data[n].dealFlag==1 || data[n].dealFlag==3 || data[n].dealFlag==6){
            html = html + '<div class="vertical-timeline-block"><div class="vertical-timeline-icon red-bg"> <i class="fa fa-close"></i> </div><div class="vertical-timeline-content">' +
                '<p>处理时间： <span>'+data[n].dealTime+ '</span></p><p>处理环节： <span class="text-danger"> '+dealFlagFormatter(data[n].dealFlag)+' </span></p><p>处理结果： <span class="text-muted" >'+ (data[n].warnData).replace(/\r\n/g,'<br/>')+
                '</div></div>'
        }else if(data[n].dealFlag==5){
            html = html+'<div class="vertical-timeline-block"><div class="vertical-timeline-icon navy-bg"> <i class="fa fa-check"></i> </div>' +
                '<div class="vertical-timeline-content"><p>处理时间： <span>'+data[n].dealTime+ '</span></p><p>处理环节： <span class="text-navy">'+dealFlagFormatter(data[n].dealFlag)+'</span></p>' +
                '</div></div>';
        }else if(data[n].dealFlag==2){
            html = html + '<div class="vertical-timeline-block"><div class="vertical-timeline-icon yellow-bg"> <i class="fa fa-spinner fa-pulse"></i> </div><div class="vertical-timeline-content">' +
                '<p>处理时间： <span>'+data[n].dealTime+ '</span></p><p>处理环节： <span class="text-warning"> '+dealFlagFormatter(data[n].dealFlag)+' </span></p><p>处理结果： <span class="text-muted" > '+ (data[n].warnData).replace(/\r\n/g,'<br/>')+
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
                '<p>处理时间： <span>'+data[n].dealTime+ '</span></p><p>处理环节： <span class="text-warning"> '+dealFlagFormatter(data[n].dealFlag)+' </span></p><p>处理结果： <a><span class="text-muted" onclick="getFileInfo('+data[n].submitId+')">文件总数（'+total+'）&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;异常文件总数（'+excCount+'）'+
                '</a></div></div>'
        }
    }
    return html;
}

function getResult(id){
	$("#reportFile").hide();
	$("#vertical-timeline").show();
    $.ajax({
        url:"/serviceapi/pre/idcinfo/idcValidateMsg",
        type:"POST",
        data:{"jyzId":id},
        async:false,
        dataType: 'json',
        success:function (data) {
            var html="";
            if(data!=null && data.length>0){
                html = getResaultHtml(data);
            }
            $("#vertical-timeline").html(html);
        }});
    $("#resultJyzId").val(id);
    $('#audit_results').modal('show');
}

function refreshResult(){
	$.ajax({
        url:"/serviceapi/pre/idcinfo/idcValidateMsg",
        data: {'jyzId' : $("#resultJyzId").val()},
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



$(function(){

    $("#idcinfotable").bootstrapTable('destroy').bootstrapTable({
        method: 'post',
        //url: '/static/js/demo/testidc.json',
        url: '/serviceapi/pre/idcinfo/listIdcInfo',
        queryParams: '',
        contentType: 'application/x-www-form-urlencoded',
        striped: true,
        undefinedText: '',
        showColumns: !0,
        toolbar: "#commonButton",
        pagination: false,
        sidePagination: 'server',
        iconSize: "outline",
        icons: {
            columns: "glyphicon-list",
        },
        clickToSelect:false,
        pageSize: 10,
        pageList: [10, 25, 50, 100, 200],
        uniqueId:'jyzId',
        columns: [
            {field: 'jyzId',title: 'ID',visible:false},
            {field: 'idcId',title: 'IDC/ISP许可证号',width:'120px'},
            {field: 'idcName',title: '经营者名称',width:'100px'},
            //{field: 'houseNum',title: '机房数'},
            {field: 'idcAddress',title: '经营者通讯地址',width:'120px'},
            {field: 'corporater',title: '企业法人'},
            {field: 'officerName',title: '网络安全责任人'},
            {field: 'ecName',title: '应急联系人'},
            {field: 'czlx',title: '操作类型',formatter: czlxFormatter},
            {field: 'dealFlag',title: '处理状态',formatter: dealFlagFormatterDeal},
           /* {field: 'verificationResult',title: '审核结果',formatter: verificationResultFormatter},*/
            {field: 'updateTime',title: '更新时间',width:'100px',formatter: dateFormatter},
            {field: 'operating',title: '操作',width:'150px',formatter: operateFormatter}
        ]
    });
    
    $("#returnBtn").click(function(){
		if(rank==1){
			$("#reportFile").hide();
			$("#vertical-timeline").show();
			rank=0;
			$("#refreshBtn").show();
			$("#chkResult").hide();
		}else{
			$(this).attr("data-dismiss",'modal')
		}
	});

    //新增
    $('#btnAdd').on('click',function(e){
        e.preventDefault();
        var valid=$("#addForm").validate().form();
        if(valid){
            //var validateFlag = AjaxValidator.isValid("addForm", '/serviceapi/pre/idcinfo/validate');
            //if(validateFlag){
                var data = $('#addForm').serialize();
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/serviceapi/pre/idcinfo/insert',
                    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                    data: data,
                    success : function(result){
                        if(result.resultCode==0){
                            swal({
                                title: "预审通过，IDC/ISP信息安全管理系统进行数据上报审核中！",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonText: "确定",
                                closeOnConfirm: true
                            }, function(isConfirm) {
                                if(isConfirm) {
                                    window.location.href = '/idc/index';
                                }
                            })
                        }else{
                            if(result.ajaxValidationResult==null){
                                swal({title: "保存失败，经营者已存在或异常",type: "error"})
                            }else{
                                var map=result.ajaxValidationResult.errorsArgsMap;
                                for (var attr in map) {
                                    var error_id = attr+'_error';
                                    $('#addForm').find("label[id="+error_id+"]").text(map[attr]);
                                }
                            }

                        }

                    }
                });
            //}
        }

    });

    $('#btnEdit').on('click',function(e){
        e.preventDefault();
        var valid=$("#editForm").validate().form();
        if(valid) {
            //var validateFlag = AjaxValidator.isValid("editForm", '/serviceapi/pre/idcinfo/validate');
            //if (validateFlag) {
                var data = $('#editForm').serialize();
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/serviceapi/pre/idcinfo/update',
                    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                    data: data,
                    success: function (result) {
                        if (result.resultCode == 0) {
                            swal({
                                title: "预审通过，IDC/ISP信息安全管理系统进行数据上报审核中！",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonText: "确定",
                                closeOnConfirm: true
                            }, function (isConfirm) {
                                if (isConfirm) {
                                    window.location.href = '/idc/index';
                                }
                            })
                        } else {
                            if(result.ajaxValidationResult==null){
                                swal({title: "保存失败，经营者已存在或异常",type: "error"})
                            }else{
                                var map=result.ajaxValidationResult.errorsArgsMap;
                                for (var attr in map) {
                                    var error_id = attr+'_error';
                                    $('#editForm').find("label[id="+error_id+"]").text(map[attr]);
                                }
                            }
                        }

                    }
                });
            //}
        }
    });

    //新增取消
    $('#btnCancel').on('click',function(e){
        $("#addForm input,select").each(function(){
            $(this).val('');
        });
    });

    $('#btnCancelEdit').on('click',function(e){
        $("#editForm input,select").each(function(){
            $(this).val('');
        });
    });

    $("#resultExport").click(function () {
        $.ajax({
            url:"/serviceapi/pre/idcinfo/idcValidateMsg",
            type:"POST",
            data:{"jyzId":$("#jyzIdreport").val()},
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

    exportFun.ready();
    importFun.ready();
});


exportFun={
    ready:function () {
        handleFile.exportTemplate('/export/idcTemplate');
    }
};
importFun={
    subImport:function () {
        $('#subImport').click(function () {
            handleFile.importFile('/import/idcInfo','idcinfotable');
        });
    },
    syncTime:function () {
        // setInterval("handleFile.getProcess('/import/getStatus')",2000);
    },
    ready:function () {
        importFun.subImport();
        importFun.syncTime();
        handleFile.exportErrorFile('/export/idcErrorFile')
    }
};

function resetImportProcess() {
    var process = $('#importProcess >div');
    process.attr("style","width: 0%;");
    process.text("0%");
    $('#errorFile').html("");
    $('#lastImportStatus').val(1);
}

function operateFormatter(value, row, index){
    var r1=$("#r1").val();
    var r2=$("#r2").val();
    var r3=$("#r3").val();
    var r4=$("#r4").val();
    var r5=$("#r5").val();
    var op="";
    //console.log(row.dealFlag);
    //处理标记（0-未预审、1-预审不通过、2-上报审核中、3-上报审核不通过、4-提交上报、5-上报成功、6-上报失败）
    if(row.czlx!=3 && (row.dealFlag==0 || row.dealFlag==1 || row.dealFlag==3 || row.dealFlag==5 || row.dealFlag==6)){
        if(r1==1){
            op+="<a data-toggle='modal' data-target='#myModaledit' onclick=\"beforeUpdate('"+row.jyzId+"');\" title='修改' class='m-r'><i class='fa fa-edit fa-lg'></i></a>";
        }
        if(r2==1){
            op+="<a class='m-r demo4' onclick=\"deleteFun('"+row.jyzId+"');\"  title='删除'><i class='fa fa-close fa-lg'></i></a>" ;
        }
    }
    if(row.dealFlag==0 || row.dealFlag==1 || row.dealFlag==3 || row.dealFlag==6){
        if(r3==1){
            op+="<a class='m-r demo2 ' onclick=\"preValid('"+row.jyzId+"');\"  title='上报预审' class='m-r'><i class='fa fa-legal fa-lg'></i></a>" ;
        }
        if(r4==1){
            op+="<a class='m-r demo2 ' onclick=\"cascadeValid('"+row.jyzId+"');\" title='级联预审' ><i class='fa fa-eye fa-lg'></i></a>" ;
        }
    }
    if(row.dealFlag==2){
        if(r5==1){
            op+="<a class='m-r demo2 ' onclick=\"revokeValid('"+row.jyzId+"');\" title='撤销预审' class='m-r'><i class='fa fa-backward fa-lg'></i></a>" ;
        }
    }
    op+="<a class='m-r demo2 ' onclick=\"refreshFun('"+row.jyzId+"');\"  title='刷新' class='m-r'><i class='fa fa-refresh fa-lg'></i></a>" ;
    return op;
    /*return  "<a data-toggle='modal' data-target='#myModaledit' onclick=\"beforeUpdate('"+row.jyzId+"');\" title='修改' class='m-r'><i class='fa fa-edit fa-lg'></i></a>" +
        "<a  class='m-r demo4' title='删除'><i class='fa fa-close fa-lg'></i></a>" +
        "<a class='m-r demo2 'title='预审' class='m-r'><i class='fa fa-legal fa-lg'></i></a>" +
        "<a href='#' title='级联预审' class='m-r'><i class='fa fa-file-text-o fa-lg'></i></a>" ;*/
}

function beforeUpdate(jyzId){
    var data = $('#idcinfotable').bootstrapTable('getRowByUniqueId', jyzId);
    var inputs = $('#editForm').find('input[class="form-control"],input[class="form-control valid"]');
    var textIDArray = new Array();
    for(var i=0;i<inputs.size();i++){
        textIDArray[i] = inputs[i].name;
    }
    setFormdata(textIDArray, data, $('#editForm'));
    $('#editForm').find("input[name=jyzId]").val(data.jyzId);
    $('#editForm').find("select[name=officerIdType]").val(data.officerIdType);
    $('#editForm').find("select[name=ecIdType]").val(data.ecIdType);

}

function revokeValid(jyzId){
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
                data: {'jyzId' : jyzId},
                success:function(result){
                    if(result.resultCode == 0){
                        $("#idcinfotable").bootstrapTable('refresh');
                    }else{
                        swal({title: "撤销失败",type: "error"})
                    }
                }
            });
        }
    })
}

function preValid(jyzId){
    $.ajax({
        url:'/serviceapi/pre/idcinfo/preValidate',
        type:"post",
        dataType: 'json',
        data: {'jyzId' : jyzId},
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
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                })
            }
            $("#idcinfotable").bootstrapTable('refresh');
        }
    });
}
function cascadeValid(jyzId){
    $.ajax({
        url:'/serviceapi/pre/idcinfo/preValidateCascade',
        type:"post",
        dataType: 'json',
        data: {'jyzId' : jyzId},
        success:function(result){
            if(result.resultCode == 0){
                swal({
                    title: "预审成功",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                })
            }else{
                swal({
                    title: "预审失败",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                })
            }
            $("#idcinfotable").bootstrapTable('refresh');
        }
    });
}

function deleteFun(jyzId){
    swal({
        title: "确定要删除这条信息吗",
        text: "删除后将无法恢复，请谨慎操作！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是的，我要删除！",
        cancelButtonText: "取消",
        closeOnConfirm: true,
        closeOnCancel: true
    }, function(isConfirm) {
        if (isConfirm) {
            $.ajax({
                url:'/serviceapi/pre/idcinfo/delete',
                type:"post",
                dataType: 'json',
                data: {'jyzId' : jyzId},
                success:function(result){
                    if(result.resultCode == 0){
                        $("#idcinfotable").bootstrapTable('refresh');
                    }else{
                        swal({title: "删除失败",type: "error"})
                    }
                }
            });
        }
    });

}

function impFun(){

    $.ajax({
        url:'/serviceapi/pre/idcinfo/checkIdcExsist',
        type:"post",
        success:function(result){
            if(result){
                swal({title: "经营者已存在，不能导入！",type: "error"})
            }else{
                //$("#upLoad120").empty().append(" <input type=\"file\" id =\"importFile\" name=\"importFile\" accept=\".xls,.xlsm,.xlsx\" class=\"form-control\" required/>");
                //$('input[type="file"]').prettyFile();
                $('#upload').modal('show');
            }
        }
    });
}

function addFun(){

    $.ajax({
        url:'/serviceapi/pre/idcinfo/checkIdcExsist',
        type:"post",
        success:function(result){
            if(result){
                swal({title: "经营者已存在，不能新增！",type: "error"})
            }else{
                $('#myModaladd').modal('show');
            }
        }
    });
}

function refreshFun(){
    $("#idcinfotable").bootstrapTable('refresh');
}
//审核结果
function verificationResultFormatter(value, row, index){
    if(row.dealFlag==0 || row.dealFlag==4 || row.dealFlag==5){
        return "";
    }else{
        return "<a onclick=\"getResult('"+row.jyzId+"')\">审核结果</a>";
    }
}

/*function setAuditResult(jyzId) {
    $("#auditResultMsg tbody").empty();
    $.ajax({
        url:'/serviceapi/pre/idcinfo/idcValidateMsg',
        type:"post",
        dataType: 'json',
        data: {'jyzId' : jyzId},
        success:function(result){
            if(result.msg!=null){
                var str=(result.msg).replace(/\r\n/g,'<br/>');
                var html="<tr><td>"+str+"</td></tr>";
                $("#auditResultMsg tbody").append(html);
            }
        }
    });
    $("#jyzIdreport").val(jyzId);
    $('#audit-results').modal('show');
}*/


function exportExcel(){
    location.href="/idc/exportExcel";
}