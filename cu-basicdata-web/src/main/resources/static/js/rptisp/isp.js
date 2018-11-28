isp={

    initClick:function () {
        $('#banthActive').click(function () {
            isp.updateIsps("请确认是否要过滤单位信息上报？","/isp/updateActive");
        });
        $('#IspSearch').click(function () {
            isp.refreshTable();
        });
        $('#banthInActive').click(function () {
            isp.updateIsps("请确认是否要恢复单位信息上报？","/isp/updateInActive");
        });
        $('#banthDelete').click(function () {
            isp.updateIsps("请确认是否要删除选中记录？","/isp/bantchDelete");
        });
        $('#importIsp').click(function () {
            isp.importFile("/isp/import")
        });
        $('#exportTemplate').click(function () {
            $('#exportTem').remove();
            var form = '<form class="hide" id="exportTem">';
            form += '</form>';
            $('body').append(form);
            $('#exportTem').attr('action', '/export/ispTemplate').attr('method', 'get').submit() ;return false;
        });
        $('#errorFile').click(function () {
            let fileName = $(this).find("a").text();
            if (fileName==null || fileName=="" || fileName==undefined){
                return;
            }
            $('#exportErrorForm').remove();
            var form = '<form class="hide" id="exportErrorForm">';
            form += '<input type="hidden" name="errorFileName" value='+encodeURI(fileName)+'>';
            form += '</form>';
            $('body').append(form);
            $('#exportErrorForm').attr('action', "/export/ispErrorFile").attr('method', 'get').submit() ;return false;
        })
    },

    importFile:function () {

        var fileName=$('#ispImportForm').find('input[name="importFile"]').val();
        if(fileName=='' ||fileName==undefined){
            swal("请选择文件");
            return false;
        }
        $.ajaxFileUpload({
            url: "/isp/import",
            secureuri: false,
            sync:false,
            contentType:'application/json',
            fileElementId: 'importFile',
            dataType: "json",
            success: function (result) {
                if (result.resultCode==0){
                    swal("导入成功");
                    if (result.resultMsg=='success'){
                        $('#errorFile').html("导入成功");
                    }else {
                        $('#errorFile').html("<a>"+result.resultMsg+"</a>");
                    }
                }else {
                    swal("导入失败");
                    $('#errorFile').html("导入失败");
                }
            },
            error:function(data, status, e){
                swal("导入失败");
            }

        })
    },
    updateIsps:function(alertTxt,url) {
        let values = $('#ispTable').bootstrapTable("getSelections");
        if (values.length<1){
            swal({title: "请选择要的处理记录！",type: "warning"});
            return false;
        }else {
            swal({
                title: alertTxt,
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "是",
                cancelButtonText: "否",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm) {
                if(isConfirm){
                    let ids = new Array();
                    for (let i =0;i<values.length;i++){
                        ids.push(values[i].id)
                    }
                    $.ajax({
                        url: url,
                        type: 'POST',
                        contentType: 'application/json',
                        data:JSON.stringify(ids),
                        async:false,
                        dataType: 'json',
                        success: function(data){
                            swal({
                                title: data.resultMsg,
                                type: "success",
                                showCancelButton: false,
                                confirmButtonText: "确定",
                                closeOnConfirm: true
                            },function (isCo) {
                                if(isCo) {
                                    if (data.resultCode == 0) {
                                        isp.refreshTable();
                                    }
                                }
                            });

                        }
                    })
                }else{
                    swal("已取消", "取消了批量操作！", "error")
                }
            });
        }
    },
    refreshTable:function () {
        $("#ispTable").bootstrapTable('refresh');
    },
    initTable:function () {
        $("#ispTable").bootstrapTable('destroy').bootstrapTable({
            method: 'post',
            url: "/isp/query",
            queryParams: queryParams,
            contentType: 'application/x-www-form-urlencoded',
            dataType: "json",
            striped: true,
            undefinedText: '',
            toolbar: "#commonButton",
            pagination: true,
            sidePagination: 'server',
            iconSize: "outline",
            clickToSelect:false,
            pageSize: 10,
            pageList: [10, 25, 50, 100, 200],
            columns: getColumnFunction(),
            onLoadSuccess:function () {
                $('#ispTable .switch input').bootstrapSwitch({
                    onSwitchChange:function(event,state){
                        if(state==true){
                            let value = event.currentTarget.value;
                            let ids = new Array();
                            ids.push(value);
                            $.ajax({
                                url: '/isp/updateActive',
                                type: 'POST',
                                contentType: 'application/json',
                                data:JSON.stringify(ids),
                                async:false,
                                dataType: 'json',
                                success: function(data){
                                    if (data.resultCode==0){
                                        // swal("激活成功");
                                    }else {
                                        //swal(data.resultMsg);
                                    }
                                }
                            })
                        }else{
                            let value = event.currentTarget.value;
                            let ids = new Array();
                            ids.push(value);
                            $.ajax({
                                url: '/isp/updateInActive',
                                type: 'POST',
                                contentType: 'application/json',
                                data:JSON.stringify(ids),
                                async:false,
                                dataType: 'json',
                                success: function(data){
                                    if (data.resultCode==0){
                                        // swal("激活成功");
                                    }else {
                                        // swal(data.resultMsg);
                                    }
                                }
                            })
                        }
                    }
                });
            }
        });
    },
    init:function () {
        isp.initTable();
        isp.initClick();
    }

};
$(document).ready(function() {
    isp.init();
});

function getColumnFunction() {
    let columns = [{
        checkbox: true
    }, {
        field: 'unitName',
        title: '单位名称',
    }, {
        field: 'filterMode',
        title: '<span class="pull-left" >是否过滤上报</span> <span class="text-center center-block" title="on:表示开，用户数据不进行上报&#10;off:表示关，用户数据进行上报"><i class="fa fa-question-circle" aria-hidden="true"></i></span>',
        formatter:operateFormatter,
    }];
    return columns;
}
function operateFormatter(value, row, index) {

    let id = row.id;
    let html = "<div class=\"switch \" data-on-label=\"on\" data-off-label=\"off\" data-on=\"success\" data-off=\"warning\">\n" +
                "<input id =\"toggle-"+id+"\" value="+id+" type=\"checkbox\" ";
    if (row.filterMode=='1'){
        html+=" checked=\"checked\" ";
    }
    if ($('#updateActive').val()!=1 || $('#updateInActive').val()!=1){
        html+= " disabled ";
    }
    html+=" data-size=\"mini\" class=\"toggle\" /></div>";
    return html;
}
function queryParams(params) {
    let query;
    query = $('#indexSearch').serializeObject();
    if (query.unitName=='') query.unitName=undefined;
    query.pageIndex = params.offset/params.limit+1;
    query.pageSize = params.limit;
    return query;
}

