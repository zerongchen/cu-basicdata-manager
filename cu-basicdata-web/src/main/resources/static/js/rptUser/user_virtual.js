/************
 * 用户虚拟机信息页面js
 *
 * *********/
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
            field: 'updateTime',
            title: '更新时间'
        }/*, {
            field: '',
            title: '操作',
            formatter:function(value,row,index){
                ophtml =  '<a title="修改" href="#" onclick="editService('+index+')" class="m-r"><i class="fa fa-edit fa-lg"></i></a><a title="删除" href="#" onclick="deleteRow('+index+')" class="m-r"><i class="fa fa-close fa-lg"></i></a>';
                return ophtml;
            }
        }*/];
        return columns;
    },

    initTable:function(){
        initTable.initBoostrapTable("indexTable","/rptUser/userVirtual/list",userVirtual.getTableColumns(),getQueryParam);
    },
    searchBtn:function(){
        $('#serviceIndexSearch').click(function(){
            initTable.refreshTable("indexTable","/rptUser/userVirtual/list");
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

    init:function(){
        userVirtual.initSelect();
        userVirtual.initTable();
        userVirtual.searchBtn();
        userVirtual.initClick();
    }
};

userVirtual.init();


function editService(index){
    var serviceList = $("#indexTable").bootstrapTable('getData');
    userService.editHouse(serviceList[index]);
}

/**
 * 删除单条记录
 * @param index
 */
function deleteRow(index){
    // 批量删除或者删除单条记录
    var serviceList = $("#indexTable").bootstrapTable('getData');
    var idArr = [];
    var virtualId = serviceList[index].virtualId;
    idArr.push(virtualId);
    batchDelete(idArr);

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
        for(var n in idList){
            idArr.push(idList[n].virtualId);
        }
        batchDelete(idArr);
    }
}

function batchDelete(idArr) {
    swal({
        title: "确定要删除这条信息吗",
        text: "删除后将无法恢复，请谨慎操作！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是的，我要删除！",
        cancelButtonText: "让我再考虑一下…",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function(isConfirm) {
        if(isConfirm) {
            $.ajax({
                url:"batchDelete",
                type:"POST",
                data:{"ids":idArr},
                async:false,
                dataType: 'json',
                success:function (data) {
                    if(data.resultCode==0){
                        swal({
                            title: "",
                            text: "删除成功",
                            type: "success",
                        }, function(isConfirm) {
                            if(isConfirm) {
                                userVirtual.refreshIndex();
                            }
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