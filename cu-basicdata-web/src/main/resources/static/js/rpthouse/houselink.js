/**
 * 机房主体信息上报页面（IP信息）
 *
 *
 **/
function getQueryParam(params){
    var query = "";
    query = $('#indexSearch').serializeObject();
    query.pageIndex = params.offset/params.limit+1;
    query.pageSize = params.limit;
    query.startDate = $('#start').val();
    query.endDate = $('#end').val();
    if($("#houseId").val()!=null){
        query.houseIDs = $("#houseId").val().join(",");
    }
    query.houseId = "";
    return query;
}

var rptHouseLink = {
    getTableColumns:function(type){
        var columns = [];

        columns = [ {
            field: 'houseName',
            title: '机房名称'
        }, {
            field: 'linkNo',
            title: '链路编号'
        }, {
            field: 'gatewayIP',
            title: '机房出入口网关IP地址'
        }, {
            field: 'bandWidth',
            title: '机房互联网出入口带宽(Mbps)'
        },  {
                field: 'updateTime',
                title: '更新时间',
            formatter: dateFormatter
            }];
        return columns;
    },
    initTable:function(){
        initTable.initBoostrapTable("indexTable","list",rptHouseLink.getTableColumns(),getQueryParam);
    },
    searchBtn:function(){
        $('#serviceIndexSearch').click(function(){
            initTable.refreshTable("indexTable","list");
        });

        icom.tpick.createTimePick().initDoubleDate("start","end",4);

        //机房下拉框
        var house_sel = icom.rsel.createRichSelect("houseId",{
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
        house_sel.render();
    },
    init:function(){
        rptHouseLink.initTable();
        rptHouseLink.searchBtn();
    }
};

rptHouseLink.init();

