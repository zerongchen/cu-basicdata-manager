/**
 * 机房主体信息页面
 *
 *
 **/
function getQueryParam(params){
    var query = "";
    query = $('#indexSearch').serializeObject();
    if (params!=undefined){
        query.pageIndex = params.offset/params.limit+1;
        query.pageSize = params.limit;
    }
    query.houseOfficerName = $('#houseOfficerName').val();
    if ($('#houseAddress').val()!=undefined && $('#houseAddress').val()!=""){
        query.houseAddress = $('#houseAddress').val();
    }
    if ($('#houseType').val()!=undefined && $('#houseType').val()!=""){
        query.houseType = $('#houseType').val();
    }
    query.identity = $('#identity').val();
    query.startDate = $('#start').val();
    query.endDate = $('#end').val();
    if($('#searchOne').val()!=undefined || $('#searchOne').val()!=""){
        query.houseProvince = $('#searchOne').val();
    }
    if($('#searchTwo').val()!=undefined || $('#searchTwo').val()!=""){
        query.houseCity = $('#searchTwo').val();
    }
    if($('#searchThree').val()!=undefined || $('#searchThree').val()!=""){
        query.houseCounty =$('#searchThree').val();
    }
    return query;
}

function getIpQueryParam(params){
    var query = "";
    query = $('#detailIpForm').serializeObject();
    query.houseId = $("#detailHouseId").val();
    query.pageIndex = params.offset/params.limit+1;
    query.pageSize = params.limit;
    return query;
}

function getFrameQueryParam(params){
    var query = "";
    query = $('#frameDetailForm').serializeObject();
    query.houseId = $("#detailHouseId").val();
    query.pageIndex = params.offset/params.limit+1;
    query.pageSize = params.limit;
    return query;
}

function getLinkQueryParam(params){
    var query = "";
    query = $('#linkDetailForm').serializeObject();
    query.houseId = $("#detailHouseId").val();
    query.pageIndex = params.offset/params.limit+1;
    query.pageSize = params.limit;
    return query;
}
var houseInfo = {
    getTableColumns:function(type){
        var columns = [];
        if(type==1){
            columns = [{
                field: 'houseId',
                title: '机房ID',
                visible:false
            }, {
                field: 'houseIdStr',
                title: '机房编号'
            }, {
                field: 'identity',
                title: '专线标识',
                formatter:function (value,row,index) {
                    if(value==1){
                        return "IDC";
                    }else{
                        return "专线";
                    }
                }
            }, {
                field: 'houseName',
                title: '机房名称'
            }, {
                field: 'houseType',
                title: '机房性质',
                formatter:function(value,row,inedx){
                    if(value==1){
                        return "租用";
                    }else if(value==2){
                        return "自建";
                    }else{
                        return "其他";
                    }
                }
            }, {
                field: 'houseAddress',
                title:'<span title="机房所在地">机房所在地</span>',
                formatter:function(value,row,index){
                    var add = "";
                    if(row.provinceName == row.cityName){//直辖市省份和地级市相同，取一个即可
                        add = row.provinceName;
                    }else {
                    	 if(row.cityName!=null){
                    		 add = row.provinceName + row.cityName;
                         }else{
                        	 add = row.provinceName;
                         }
                    }
                    if(row.countyName!=null){
                        add+=row.countyName;
                    }
                    return "<span title='"+add+"'>"+add+"</span>";
                }
            }, {
                field: 'houseOfficerName',
                title: '机房负责人'
            },{
                field: 'updateTime',
                title: '更新时间',
                formatter:dateFormatter
            }, {
                field: '',
                title: '操作',
                formatter:function(value,row,index){
                    var r_houseDetail=$("#r_houseDetail").val();
                    if(r_houseDetail==1){
                        var ophtml = '<a title="详情" href="#" class="m-r" onclick="detail('+index+')"><i class="fa fa-file-text-o fa-lg"></i></a>';
                        return ophtml;
                    }
                    return '';
                }
            }];
        }else if(type==2){
            columns = [ {
                field: 'startIP',
                title: '起始IP'
            }, {
                field: 'endIP',
                title: '结束IP'
            },{
                field:'ipType',
                title:'IP地址使用方式',
                formatter:function(value,row,index){
                    if(value==0){
                        return "静态";
                    }else if(value==1){
                        return "动态";
                    }else if(value==2){
                        return "保留";
                    }else if(value==3){
                        return "专线";
                    }else if(value==999){
                        return "云虚拟";
                    }
                }
            },{
                field: 'userName',
                title: '使用人的单位名称'
            },{
                field: 'useTime',
                title: '分配使用日期'
            }]
        }else if(type==3){
            columns = [ {
                field: 'frameName',
                title: '机架名称'
            }, {
                field: 'unitName',
                title: '单位名称'
                //formatter:unitNameFormatter
            }, {
                field: 'useType',
                title: '使用类型',
                formatter:function (value,row,index) {
                    var type = "";
                    if(value==1){
                        type="自用";
                    }else{
                        type="租用";
                    }
                    return type;
                }
            },{
                field:'occupancy',
                title:'占用状态',
                formatter:function(value,row,index){
                    if(value==1){
                        return "未占用";
                    }else if(value==2){
                        return "已占用";
                    }
                }
            },{
                field:'distribution',
                title:'分配状态',
                formatter:function(value,row,index){
                    if(value==1){
                        return "未分配";
                    }else if(value==2){
                        return "已分配";
                    }
                }
            }]
        }else if(type==4){
            columns = [ {
                field: 'linkNo',
                title: '链路编号'
            }, {
                field: 'gatewayIP',
                title: '机房出入口IP'
            }, {
                field: 'bandWidth',
                title: '机房出入口带宽（Mbps）'
            }]
        }
        return columns;
    },

    initTable:function(){
        initTable.initBoostrapTable("indexTable","/rpt/house/query",houseInfo.getTableColumns(1),getQueryParam,'commonButton2');
    },
    searchBtn:function(){
        $('#houseIndexSearch').click(function(){
            initTable.refreshTable("indexTable","/rpt/house/query");
        });
        $('#detail_IP').click(function(){
            initTable.refreshTable("ipTableDetial","/rpt/houseip/list");
        });
        $('#detail_frame').click(function(){
            initTable.refreshTable("frameTableDetail","/rpt/houseframe/list");
        });
        $('#detail_link').click(function(){
            initTable.refreshTable("linkTableDetail","/rpt/houselink/list");
        });
    },

    initBtn:function(){
        //机房性质下拉框
        cselect.initSelectJcdm('jfxz','houseType',null);
         //首页时间查询条件
        icom.tpick.createTimePick().initDoubleDate("start","end",4);
        icom.asel.createAreaSelect("searchOne","searchTwo","searchThree",2,null,null,null);
    },

    cleanData:function(){
    },

    detailTableInit:function(){
        initTable.initBoostrapTable("ipTableDetial","/rpt/houseip/list",houseInfo.getTableColumns(2),getIpQueryParam);
        initTable.initBoostrapTable("frameTableDetail","/rpt/houseframe/list",houseInfo.getTableColumns(3),getFrameQueryParam);
        initTable.initBoostrapTable("linkTableDetail","/rpt/houselink/list",houseInfo.getTableColumns(4),getLinkQueryParam);
    },
    //详情展示
    showDetail:function(index){
        var houseList = $("#indexTable").bootstrapTable('getData');
        var houseId = houseList[index].houseId;
        $.ajax({
            url:"/rpt/house/detail",
            type:"POST",
            data:{"houseId":houseId},
            async:false,
            dataType: 'json',
            success:function (data) {
                if(data!=null){
                    $("#detailHouseId").val(houseId);
                    $("#houseNo_dt").text(data.houseIdStr);
                    $("#houseName_dt").text(data.houseName);
                    $("#houseType_dt").text(getJCDM_STR("jfxz",data.houseType));
                    $("#houseAddress_dt").text(data.houseAddress);
                    $("#houseOfficerName_dt").text(data.houseOfficerName);
                    $("#houseOfficerIdType_dt").text(zjlxFormatter(data.houseOfficerIdType));
                    $("#houseOfficerId_dt").text(data.houseOfficerId);
                    $("#houseOfficerTelephone_dt").text(data.houseOfficerTelephone);
                    $("#houseOfficerMobile_dt").text(data.houseOfficerMobile);
                    $("#houseOfficerEmail_dt").text(data.houseOfficerEmail);
                    if(data.identity==1){
                        $("#identity_dt").text("IDC");
                    }else{
                        $("#identity_dt").text("专线");
                    }
                    houseInfo.detailTableInit();
                    $("#details").modal('show');
                }
            }
        })
    },
    //主页刷新
    refreshIndex:function(){
        initTable.refreshTable("indexTable","/rpt/house/query");
    },
    exportData:function () {
        var param = getQueryParam();
        $('#exportHouseDataForm').remove();
        var form = '<form class="hide" id="exportHouseDataForm">';
        $.each(param, function(i) {
            form +='<input name="'+i+'" type="hidden" value="'+param[i]+'">'
        });
        form += '</form>';
        $('body').append(form);
        $('#exportHouseDataForm').attr('action', '/export/exportRptHouseData').attr('method', 'post').submit() ;return false;
    },
    init:function(){
        houseInfo.initTable();
        houseInfo.initBtn();
        houseInfo.searchBtn();
        $("#exportBtn").click(function () {
            houseInfo.exportData();
        });
    }
};

houseInfo.init();

function detail(index){
    houseInfo.showDetail(index);
}

function exportExcel(){
    var query = "";
    query = $('#indexSearch').serializeObject();
    query.houseOfficerName = $('#houseOfficerName').val();
    query.houseAddress = $('#houseAddress').val();
    query.houseType = $('#houseType').val();
    query.identity = $('#identity').val();
    query.startDate = $('#start').val();
    query.endDate = $('#end').val();
    if($('#searchOne').val()!=undefined || $('#searchOne').val()!=""){
        query.houseProvince = $('#searchOne').val();
    }
    if($('#searchTwo').val()!=undefined || $('#searchTwo').val()!=""){
        query.houseCity = $('#searchTwo').val();
    }
    if($('#searchThree').val()!=undefined || $('#searchThree').val()!=""){
        query.houseCounty =$('#searchThree').val();
    }
    console.log(query);

    //location.href="/rpt/house/exportExcel?houseOfficerName="+encodeURIComponent(houseOfficerName)+"&province_short="+province_short;
    location.href="/rpt/house/exportExcel?queryParam="+encodeURIComponent(JSON.stringify(query));
}