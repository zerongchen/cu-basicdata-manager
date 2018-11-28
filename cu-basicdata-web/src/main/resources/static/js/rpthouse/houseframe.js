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
    query.unitName = $('#userNameQuery').val();
    query.startDate = $('#start').val();
    query.endDate = $('#end').val();
    if($("#houseId").val()!=null){
        query.houseIDs = $("#houseId").val().join(",");
    }
    query.houseId = "";
    return query;
}

var rptHouseFrame = {
    getTableColumns:function(type){
        var columns = [];

        columns = [ {
            field: 'houseName',
            title: '机房名称'
        }, {
            field: 'frameName',
            title: '机架/机位名称'
        }, {
            field: 'unitName',
            title: '单位名称'
            // formatter:unitNameFormatter
        },{
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
            field:'distribution',
            title:'分配状态',
            formatter:function(value,row,index){
                if(value==1){
                    return "未分配";
                }else if(value==2){
                    return "已分配";
                }
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
        }, {
                field: 'updateTime',
                title: '更新时间',
            formatter: dateFormatter
            }];
        return columns;
    },
    initTable:function(){
        initTable.initBoostrapTable("indexTable","list",rptHouseFrame.getTableColumns(),getQueryParam);
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
            // //maximumSelectionLength: 3, //最多选择个数
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
        rptHouseFrame.initTable();
        rptHouseFrame.searchBtn();
    }
};

rptHouseFrame.init();

