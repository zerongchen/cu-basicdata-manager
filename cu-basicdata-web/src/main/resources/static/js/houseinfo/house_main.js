/**
 * 机房主体信息页面
 *
 *
 **/
var houseObj = {};
/** 机房性质array ****/
var dataList = new Array();
var rank =0;
var subId=0;

function getQueryParam(params){
    var query = "";
    query = $('#indexSearch').serializeObject();
    if (params!=undefined){
        query.pageIndex = params.offset/params.limit+1;
        query.pageSize = params.limit;
    }
    /*query.houseOfficerName = $('#houseOfficerName').val();*/
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

var add_index = 0;
$("#add-modal .prev").parent().css("display", "none");
$("#add-modal .prequalification").parent().css("display", "none");

function inputInit(id){
    $("#"+id).bsSuggest({
        getDataMethod: "url",
        url: "/common/getUserNames?keyword=",
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
//操作类型
function dealFlagFormatterDeal(value, row, index){
    var result = "未知";
    for(var i = 0; i < dealFlagArr.length; i++) {
        if(value == dealFlagArr[i][0]){
            result = dealFlagArr[i][1];
            break;
        }
    }
    return "<a onclick=\"getResult('"+row.houseId+"')\">"+result+"</a>";
}

function getResaultHtml(data){
    var html="";
    for(var n in data){
        if(data[n].dealFlag==1 || data[n].dealFlag==3 || data[n].dealFlag==6){
            html = html + '<div class="vertical-timeline-block"><div class="vertical-timeline-icon red-bg"> <i class="fa fa-close"></i> </div><div class="vertical-timeline-content">' +
                '<p>处理时间： <span>'+data[n].dealTime+ '</span></p><p>处理环节： <span class="text-danger"> '+dealFlagFormatter(data[n].dealFlag)+' </span></p><p>处理结果： <span class="text-muted"> '+ (data[n].warnData).replace(/\r\n/g,'<br/>')+
                '</div></div>'
        }else if(data[n].dealFlag==5){
            html = html+'<div class="vertical-timeline-block"><div class="vertical-timeline-icon navy-bg"> <i class="fa fa-check"></i> </div>' +
                '<div class="vertical-timeline-content"><p>处理时间： <span>'+data[n].dealTime+ '</span></p><p>处理环节： <span class="text-navy">'+dealFlagFormatter(data[n].dealFlag)+'</span></p>' +
                '</div></div>';
        }else if(data[n].dealFlag==2 ){
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
        url:"getChkResult",
        type:"POST",
        data:{"houseIds":id},
        async:false,
        dataType: 'json',
        success:function (data) {
            var html="";
            if(data!=null && data.length>0){
                html = getResaultHtml(data);
            }
            $("#vertical-timeline").html(html);
        }});
    $("#resultHouseId").val(id);
    $('#audit_results').modal('show');
}

function refreshResult(){
	$.ajax({
        url:"getChkResult",
        type:"POST",
        data:{"houseIds":$("#resultHouseId").val()},
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
        url: 'getReportFileInfo',
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


var houseInfo = {
    exportData:function () {
        var param = getQueryParam();
        $('#exportHouseDataForm').remove();
        var form = '<form class="hide" id="exportHouseDataForm">';
        $.each(param, function(i) {
            form +='<input name="'+i+'" type="hidden" value="'+param[i]+'">'
        });
        form += '</form>';
        $('body').append(form);
        $('#exportHouseDataForm').attr('action', '/export/exportHouseData').attr('method', 'post').submit() ;return false;
    },
    getTableColumns:function(type){
        var columns = [];
        if(type==1){
            columns = [{
                checkbox: true
            }, {
                field: 'houseId',
                title: '机房ID',
                visible:false,
                width:'75px'
            }, {
                field: 'houseIdStr',
                title: '机房编号',
                width:'150px'
            }, {
                field: 'identity',
                title:  '<span title="专线标识">专线标识</span>',
                width:'75px',
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
                field: 'houseTypeStr',
                title: '机房性质'
                // formatter:jfxzFormatterModify
                /*function(value,row,inedx){
                    if(value==1){
                        return "租用";
                    }else if(value==2){
                        return "自建";
                    }else{
                        return "其他";
                    }
                }*/,
                width:'75px'
            }, {
                field: 'houseAddress',
                title:'机房所在地',
                formatter:function(value,row,index){
                    var add = "";
                    if((row.provinceName == row.cityName)||row.cityName==null){//直辖市省份和地级市相同，取一个即可
                        add = row.provinceName;
                    }else {
                        add = row.provinceName + row.cityName;
                    }
                    if(row.countyName!=null){
                        add+=row.countyName;
                    }
                    return add;
                }
            }, {
                field: 'houseOfficerName',
                title: '机房负责人',visible:false
            }, {
                field: 'czlx',
                title: '操作类型',
                formatter:czlxFormatter,
                width:'75px'
            }, {
                field: 'dealFlag',
                title: '<span class="pull-left" >处理状态</span> <span class="text-center center-block" title="点击“预审”操作后系统自动进行完整性、关联性校验，请点击“查询”刷新后查看处理状态！"><i class="fa fa-question-circle" aria-hidden="true"></i></span>',
                formatter:dealFlagFormatterDeal,
                width:'85px'
            }/*, {
                field: 'resultStr',
                title: '<span title="核验结果">核验结果</span>',
                formatter:function(value,row,index){
                    if(row.dealFlag ==1 || row.dealFlag ==2 || row.dealFlag ==3 || row.dealFlag == 6){
                        return '<a title="核验结果" onclick="getResult('+index+')">核验结果</a>';
                    }else{ return "";}
                },
                width:'75px'
            }*/
                , {
                    field: 'updateTime',
                    title: '更新时间'
                    ,formatter: dateFormatter,
                    width:'100px'
                }, {
                    field: 'updateTime2',
                    title: '<span title="操作">操作</span>',
                    width:'150px',
                    formatter:function(value,row,index){
                        var updateRole=$("#updateRole").val();
                        var delRole=$("#delRole").val();
                        var approveRole=$("#approveRole").val();
                        var revokeRole=$("#revokeRole").val();
                        var detailRole=$("#detailRole").val();

                        var ophtml = '';
                        if(detailRole==1){
                            ophtml +='<a  title="详情" href="#" class="m-r" onclick="detail('+index+')"><i class="fa fa-file-text-o fa-lg"></i></a>';
                        }
                        if(row.dealFlag !=2 && row.dealFlag !=4){
                            if(updateRole==1){
                                ophtml+='<a title="修改" href="#" onclick="editHouse('+index+')" class="m-r"><i class="fa fa-edit fa-lg"></i></a>';
                            }

                            if(delRole ==1 && row.czlx!=3){
                                ophtml+='<a title="删除" href="#" onclick="deleteRow('+index+')" class="m-r"><i class="fa fa-close fa-lg"></i></a>';
                            }
                            if(approveRole==1){
                                ophtml+='<a title="上报预审" href="#" class="m-r" onclick="preJud('+index+')"><i class="fa fa-legal fa-lg"></i></a>';
                            }
                        }
                        if(row.dealFlag ==2){
                            if(revokeRole==1){
                                ophtml = ophtml + '<a  title="撤销预审" onclick="cancelJud('+index+')" href="#" class="m-r"><i class="fa fa-backward fa-lg"></i></a>';
                            }
                        }
                        return ophtml;
                    }
                }];
        }else if(type==2){
            columns = [ {
                field: 'startIP',
                title: '起始IP'
            }, {
                field: 'endIP',
                title: '结束IP',
                formatter:function (value,row,index) {
                    /*if(row.preEndIP!=null && row.preEndIP!="" && row.preEndIP!=row.preEndIP){
                        return '<span>'+value+'</span><span class="text-info">('+row.preEndIP+')</span>';
                    }else{*/
                    return value;
                    // }
                }
            },{
                field:'ipType',
                title:'IP地址使用方式',
                formatter:ipTypeFormatter
                /*function(value,row,index){
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
                }*/
            }, {
                field: 'czlx',
                title: '操作类型',
                formatter:czlxFormatter
            }, {
                field: 'dealFlag',
                title: '处理状态',
                formatter:dealFlagFormatter2
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
                field: 'unitNameList',
                title: '单位名称',
                formatter:unitNameFormatter
            }, {
                field: 'useType',
                title: '使用类型',
                formatter:useTypeFormatter
                /*  function (value,row,index) {
                  var type = "";
                  if(value==1){
                      type="自用";
                  }else{
                      type="租用";
                  }
                  if(row.preEndIP!=null && row.preEndIP!="" && row.preEndIP!=row.preEndIP){
                      return '<span>'+type+'</span><span class="text-info">('+row.preUseType+')</span>';
                  }else{
                      return type;
                  }
              }*/
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
            }, {
                field: 'czlx',
                title: '操作类型',
                formatter:czlxFormatter
            }, {
                field: 'dealFlag',
                title: '处理状态',
                formatter:dealFlagFormatter2
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
                title: '机房出入口带宽（Mbps）',
                formatter:function (value,row,index) {
                    if(row.preEndIP!=null && row.preEndIP!="" &&  row.preEndIP!=row.preEndIP){
                        return '<span>'+value+'</span><span class="text-info">('+row.preBandWidth+')</span>';
                    }else{
                        return value;
                    }
                }
            }, {
                field: 'czlx',
                title: '操作类型',
                formatter:czlxFormatter
            }, {
                field: 'dealFlag',
                title: '处理状态',
                formatter:dealFlagFormatter2
            }]
        }
        return columns;
    },
    initTable:function(){
        initTable.initBoostrapTable("indexTable","houselist",houseInfo.getTableColumns(1),getQueryParam,"commonButton");
        
    },
    searchBtn:function(){
        $('#houseIndexSearch').click(function(){
            initTable.refreshTable("indexTable","houselist");
        });
        $('#detail_IP').click(function(){
            initTable.refreshTable("ipTableDetial","getIpDetail");
        });
        $('#detail_frame').click(function(){
            initTable.refreshTable("frameTableDetail","getFrameDetail");
        });
        $('#detail_link').click(function(){
            initTable.refreshTable("linkTableDetail","getLinkDetail");
        });
    },
    //机房主体信息校验
    houseMain_chk:function(){
        cleanErrorText("houseAddPage");
        var validate =true;
        var query = $('#houseMianAddForm').serializeObject();
        query.houseProvince= $('#addProvince').val();
        if($('#addCity').val()!=undefined && $('#addCity').val()!=""){
            query.houseCity= $('#addCity').val();
        }else{
            query.houseCity= $('#addProvince').val();
        }
        if($('#addCounty').val()!=undefined && $('#addCounty').val()!=""){
            query.houseCounty= $('#addCounty').val();
        }else{
            query.houseCounty= $('#addProvince').val();
        }
        query.houseOfficerIdType = $("#netSecTypeAdd").val();
        if(!$('#houseMianAddForm').valid()){
            validate =  false;
        }
        if(!validate){
            return validate;
        }
        var userInfo = icom.auth.getUserInfo();
        query.createUserId = userInfo.userId;
        query.updateUserId = userInfo.userId;
        $.ajax({
            url: 'validate',
            type: 'POST',
            contentType: 'application/json',
            data:JSON.stringify(query),
            async:false,
            dataType: 'json',
            success: function(data){
                var map=data.errorsArgsMap;
                if(jQuery.isEmptyObject(map)){
                    houseObj = query;
                    validate =  true;
                }else{
                    for (var attr in map) {
                        var error_id = attr+'_error';
                        $("#houseMianAddForm").find("label[id="+error_id+"]").text(map[attr]);
                    }
                    validate = false;
                }
            }
        });
        return validate;
    },
    //ip地址段校验
    houseIp_chk:function(){
        cleanErrorText("houseAddPage");
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
                    obj1.areaCode = realEntity[obj].areaCode
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
        var iswmpty = true;
        for(var ob2 in objArr){
            if(!myCheck(objArr[ob2])){
                iswmpty = false;
                break;
            }
        }
        if(iswmpty){
            validate = true;
            return validate;
        }
        //IP地址段相关校验
        var startIpAdds = document.getElementsByName('startIpAdd');
        var endIpAdds = document.getElementsByName('endIpAdd');
        for(var m=0;m<startIpAdds.length;m++){
            if((startIpAdds[m].value=="" && endIpAdds[m].value!="") || (startIpAdds[m].value!="" && endIpAdds[m].value=="")
                || (startIpAdds[m].value=="" && endIpAdds[m].value=="")){
                $("label[name='ip_error']").eq(m).text("请输入正确IP地址段");
                validate = false;
                break;
            }
            for(var j=m+1;j<startIpAdds.length;j++){
                if(startIpAdds[m].value==startIpAdds[j].value && endIpAdds[m].value==endIpAdds[j].value){
                    $("label[name='ip_error']").eq(m).text("存在重复的IP地址段");
                    validate = false;
                    break;
                }
            }
        }
        //隶属地市码校验
        for(var ob3 in objArr){
            if(objArr[ob3].areaCode == undefined || objArr[ob3].areaCode==""){
                $("label[name='ip_areaCode_error']").eq(objArr[ob3].outIndex).text("请选择隶属单位");
                validate = false;
            }
            objArr[ob3].createUserId = userInfo.userId;
            objArr[ob3].updateUserId = userInfo.userId;
        }
        for(var n in idArr){
            if(!$('#'+idArr[n]).valid()){
                validate = false;
            }
        }
        if(!validate){
            return validate;
        }

        $.ajax({
            url: 'ipvalidate',
            type: 'POST',
            contentType: 'application/json',
            data:JSON.stringify(objArr),
            async:false,
            dataType: 'json',
            success: function(data){
                if(data.resultCode==3){
                    swal({
                        title: "录入数据错误！",
                        text: "存在重复IP地址段："+data.resultMsg,
                        type: "warning",
                    });
                    validate = false;
                }else if(data.resultCode==0){
                    validate = true;
                    houseObj.ipSegList = objArr;
                }else{
                    for (var attr in data.ajaxValidationResultMap) {
                        if(data.ajaxValidationResultMap[attr].errorsArgsMap!=null){
                            var text = "";
                            for(var m in data.ajaxValidationResultMap[attr].errorsArgsMap){
                                var error_id = 'ip_'+m+'_error';
                                if(m == 'confickIp'){
                                    var map = data.ajaxValidationResultMap[0].errorsArgsMap;
                                    for (var attr in map) {
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
                                    }
                                }else if(m=='startIP' || m=='endIP'|| m=='startIp:endIp'){
                                    $("label[name='ip_error']").eq(data.ajaxValidationResultMap[attr].innerIndex).text(data.ajaxValidationResultMap[attr].errorsArgsMap[m]);
                                }else{
                                    $("label[name='"+error_id+"']").eq(data.ajaxValidationResultMap[attr].outIndex).text(data.ajaxValidationResultMap[attr].errorsArgsMap[m]);
                                }
                            }
                        }
                    }
                    houseObj.ipSegList = "";
                    validate = false;
                }
            }
        });
        return validate;
    },
    //机架校验
    houseFram_chk:function(){
        cleanErrorText("houseAddPage");
        var validate = true;
        var realEntity = [];
        var idArr = [];
        realEntity.push($('#framChildForm').serializeObject());
        idArr.push('framChildForm');
        var idend = $("#idPlus").val();
        for(var i=1;i<idend;i++){
            var ipenty =  $("#framChildForm"+i).serializeObject();
            if(!jQuery.isEmptyObject(ipenty)){
                idArr.push('framChildForm'+i);
                realEntity.push(ipenty);
            }
        }
        var iswmpty = true;
        for(var ob2 in realEntity){
            realEntity[ob2].outIndex = outIndex;
            if(!myCheck(realEntity[ob2])){
                iswmpty = false;
                break;
            }
        }
        if(iswmpty){
            validate = true;
            return validate;
        }
        var outIndex = 0;
        var userInfo =icom.auth.getUserInfo();
        for(var obj=0;obj< realEntity.length;obj++){
            realEntity[obj].outIndex = outIndex;
            //机架名称重复判断
            /*for(var j=obj+1;j< realEntity.length;j++){
                if((realEntity[obj].frameName==realEntity[j].frameName) && realEntity[obj].frameName!="" && realEntity[j].frameName!=""){
                    $("label[name='frame_frameName_error']").eq(obj).text("存在重复的机架名称");
                    validate = false;
                }
            }*/
            if(realEntity[obj].areaCode == undefined || realEntity[obj].areaCode==""){
                $("label[name='frame_areaCode_error']").eq(outIndex).text("请选择隶属单位");
                validate = false;
            }
            var objArr = [];
            if(Array.isArray(realEntity[obj].areaCode)){
                realEntity[obj].areaCode = realEntity[obj].areaCode.join(",");
            }
            var isAllocate = false;
            var userName = $("#"+idArr[obj]).find('input[name="userName"]');
            var userNumber = $("#"+idArr[obj]).find('input[name="idNumber"]');
            var idType = $("#"+idArr[obj]).find('select[name="idType"]');
            for(var i=0;i< userName.length;i++){
                var obj1 = {};
                obj1.userName = userName[i].value;
                obj1.idType = idType[i].value;
                obj1.idNumber = userNumber[i].value;
                if(obj1.userName!=''||obj1.idType!=''||obj1.idNumber!=""){
                    objArr.push(obj1);
                }
            }
            realEntity[obj].userFrameList = objArr;
            realEntity[obj].createUserId = userInfo.userId;
            realEntity[obj].updateUserId = userInfo.userId;
            realEntity[obj].userName = "";
            realEntity[obj].idType = "";
            realEntity[obj].idNumber = "";
            outIndex++;
        }
        if(realEntity.length<=0){
            return false;
        }
        for(var n in idArr){
            if(!$('#'+idArr[n]).valid()){
                validate = false;
            }
        }
        if(!validate){
            return validate;
        }
        $.ajax({
            url: 'framvalidate',
            type: 'POST',
            contentType: 'application/json',
            data:JSON.stringify(realEntity),
            async:false,
            dataType: 'json',
            success: function(data){
                if(data.resultCode==3){
                    swal({
                        title: "录入数据错误！",
                        text: data.resultMsg,
                        type: "warning",
                    });
                    validate = false;
                }else if(data.resultCode==0){
                    validate = true;
                    houseObj.frameList = realEntity;
                }else{
                    var error = "";
                    for (var attr in data.ajaxValidationResultMap) {
                        if(data.ajaxValidationResultMap[attr].errorsArgsMap!=null){
                            for(var m in data.ajaxValidationResultMap[attr].errorsArgsMap){
                                if(m=='idNumber' || m=='userName' || m=='idType'){
                                    error = error + data.ajaxValidationResultMap[attr].errorsArgsMap[m] + "<br/>";
                                }else{
                                    var error_id = 'frame_'+m+'_error';
                                    $("label[name='"+error_id+"']").eq(parseInt(attr)).text(data.ajaxValidationResultMap[attr].errorsArgsMap[m]);
                                }
                            }
                        }
                    }
                    houseObj.frameList = "";
                    if(error!=""){
                        swal({
                            title: "校验不通过",
                            text: error,
                            type: "error",
                            html:true
                        }, function(isConfirm) {
                        })
                    }
                    validate = false;
                }
            }
        });
        return validate;
    },
    //链路校验
    houseLink_chk:function(){
        cleanErrorText("houseAddPage");
        var validate = true;
        var realEntity = [];
        var idArr = [];
        realEntity.push($('#linkChildForm').serializeObject());
        idArr.push('linkChildForm');
        var idend = $("#idPlus").val();
        for(var i=1;i<idend;i++){
            var ipenty =  $("#linkChildForm"+i).serializeObject();
            if(!jQuery.isEmptyObject(ipenty)){
                idArr.push('linkChildForm'+i);
                realEntity.push(ipenty);
            }
        }

        if(realEntity.length<=0){
            return false;
        }

        var iswmpty = true;
        for(var ob2 in realEntity){
            if(!myCheck(realEntity[ob2])){
                iswmpty = false;
                break;
            }
        }
        if(iswmpty){
            validate = true;
            return validate;
        }
        if(!validate){
            return false;
        }
        var userInfo =icom.auth.getUserInfo();
        var outIndex = 0;
        for(var obj=0; obj < realEntity.length;obj++){
            //链路编号重复判断
            /*for(var k=obj+1;k< realEntity.length;k++){
                if(realEntity[obj].linkNo==realEntity[k].linkNo){
                    $("label[name='link_linkNo_error']").eq(outIndex).text("存在重复的链路编号");
                    validate = false;
                }
            }*/

            if(realEntity[obj].areaCode == undefined || realEntity[obj].areaCode==""){
                $("label[name='link_areaCode_error']").eq(outIndex).text("请选择隶属单位");
                validate = false;
            }
            if(Array.isArray(realEntity[obj].areaCode)){
                realEntity[obj].areaCode = realEntity[obj].areaCode.join(",");
            }
            realEntity[obj].accessUnit = "电信";
            realEntity[obj].linkType = 1;
            realEntity[obj].outIndex = outIndex;
            realEntity[obj].createUserId = userInfo.userId;
            realEntity[obj].updateUserId = userInfo.userId;
            outIndex++;
        }

        for(var n in idArr){
            if(!$('#'+idArr[n]).valid()){
                validate = false;
            }
        }
        if(!validate){
            return validate;
        }

        $.ajax({
            url: 'linkvalidate',
            type: 'POST',
            contentType: 'application/json',
            data:JSON.stringify(realEntity),
            async:false,
            dataType: 'json',
            success: function(data){
                if(data.resultCode==3){
                    swal({
                        title: "录入数据错误！",
                        text: "存在重复链路编号："+data.resultMsg,
                        type: "warning",
                    });
                    validate = false;
                }else if(data.resultCode==0){
                    validate = true;
                    houseObj.gatewayInfoList = realEntity;
                }else{
                    for (var attr in data.ajaxValidationResultMap) {
                        if(data.ajaxValidationResultMap[attr].errorsArgsMap!=null){
                            for(var m in data.ajaxValidationResultMap[attr].errorsArgsMap){
                                var error_id = 'link_'+m+'_error';
                                $("label[name='"+error_id+"']").eq(parseInt(attr)).text(data.ajaxValidationResultMap[attr].errorsArgsMap[m]);
                            }
                        }
                    }
                    houseObj.gatewayInfoList = "";
                    validate = false;
                }
            }
        });
        return validate;
    },
    initBtn:function(){
        //批量预审
        $("#index_approv").click(function () {
            var houseList =  $("#indexTable").bootstrapTable('getSelections');
            if(houseList.length<=0){
                swal({
                    title: "请至少选择一条数据操作",
                }, function(isConfirm) {
                })
            }else{
                var ids = [];
                for(var n in houseList){
                    ids.push(houseList[n].houseId);
                }
                houseInfo.doPreJud(ids);
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
                    ids.push(houseList[n].houseId);
                }
                houseInfo.delete(ids);
            }
        });

        //详情预审
        $("#detail_approv").click(function () {
            var ids = [];
            ids.push($("#detailHouseId").val());
            houseInfo.doPreJud(ids,1);
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

        //机房性质下拉框
        cselect.initSelectJcdm('jfxz','houseType',null);
        //首页时间查询条件
        icom.tpick.createTimePick().initDoubleDate("start","end",4);
        icom.asel.createAreaSelect("searchOne","searchTwo","searchThree",2,null,null,null,1);
        //h5标题的新增,整个页面的新增
        $(".addTitle").click(function () {
            var addTitleHTML=$(this).parent().parent().parent().clone();
            var id = addTitleHTML.find(".selectpicker").attr('id');
            var oldId = id;
            var num = $("#idPlus").val();
            var ipTypeIds = $("#ipTypeIds").val();
            $("#idPlus").val( parseInt(num)+1);
            id = id+num;
            var ipId = 'ipUseType' + num;
            if(ipTypeIds==""){
                $("#ipTypeIds").val(ipId);
            }else{
                $("#ipTypeIds").val(ipTypeIds+','+ipId);
            }
            //IP地市使用方式
            addTitleHTML.find("#ipUseType").attr('id',ipId);
            //隶属单位
            addTitleHTML.find("#"+oldId+"_parent").attr('id',id+"_parent");
            addTitleHTML.find(".selectpicker").attr('id',id);
            addTitleHTML.find("label[class='control-label p-n error']").text("");
            addTitleHTML.find("input").removeClass("error");
            addTitleHTML.find("select").removeClass("error");
            addTitleHTML.find("label[class='col-md-10 p-l-lg col-md-offset-2 text-danger']").text('');
            addTitleHTML.find("label[class='col-md-8 p-l-lg col-md-offset-2 text-danger']").text('');
            //日期
            if(oldId=='ipInfoArea'){
                var nowId = addTitleHTML.find('[name=useTime]').attr('id')+num;
                addTitleHTML.find('[name=useTime]').attr('id',nowId);
            }
            //form表单
            var formId = addTitleHTML.find("form").attr('id');
            //单位名称联想输入框初始化
            var unitNameId = "";
            if(formId=="ipChildForm"){
                var num = $("#userNameIds").val();
                $("#userNameIds").val( parseInt(num)+1);
                unitNameId = "useNameAdd_ip"+num;
                addTitleHTML.find("#useNameAdd_ip").attr("id",unitNameId);
            }else if(formId=="framChildForm"){
                var num = $("#userNameIds").val();
                $("#userNameIds").val( parseInt(num)+1);
                unitNameId = "useNameAdd_frame"+num;
                addTitleHTML.find("#useNameAdd_frame").attr("id",unitNameId);
            }
            formId = formId + num;
            addTitleHTML.find("form").attr('id',formId);
            //删除符号
            addTitleHTML.find("h5>a").removeClass("addTitle").addClass("removeTitleContent").html("<i class=\'fa fa-minus\'></i> 删除");
            $(this).parent().parent().parent().after(addTitleHTML);
            if(unitNameId!=""){
                inputInit(unitNameId);
            }
            //隶属地市码
            var html ='<select  id="'+id+'" class="form-control selectpicker "  name="areaCode" required></select>';
            $("#"+id+"_parent").html(html);
            cselect.loadUserSubAreaCode(id);

            //ip地址类型事件绑定和日期空间初始化
            if(oldId=='ipInfoArea'){
                addTitleHTML.find('[name=ipType]').change(function(){
                    if(addTitleHTML.find('[name=ipType]').val()!=2){
                        $("#"+formId).find('.blflg').show();
                    }else{
                        $("#"+formId).find('.blflg').hide();
                    }
                });
                icom.tpick.createTimePick().initSingleDate(nowId,4);
            }

            //清空原来值
            $("#"+id).parent().parent().parent().find(".removeGroup-ip").parent().parent().remove();
            $("#"+id).parent().parent().parent().find(".removeGroup-fram").parent().parent().parent().remove();
            $('#'+formId+' input').val("");

            //表单里面的新增--IP
            $("#"+id).parent().parent().parent().find(".addGroup-ip").click(function  () {
                var addGroupHTML=$(this).parent().parent().clone();
                addGroupHTML.find("a").removeClass("addGroup-ip").addClass("removeGroup-ip").html("<i class=\'fa fa-minus-circle\'></i> 删除");
                addGroupHTML.find("label[class='control-label p-n error']").text("");
                addGroupHTML.find("label[class='col-md-10 p-l-lg col-md-offset-2 text-danger']").text('');
                addGroupHTML.find("label[class='col-md-8 p-l-lg col-md-offset-2 text-danger']").text('');
                addGroupHTML.find("input").val("");
                $(this).parent().parent().after(addGroupHTML);
                //删除添加的组
                $(".removeGroup-ip").click(function () {
                    $(this).parent().parent().remove();
                });
            });

            //表单里面的新增--机架
            $("#"+id).parent().parent().parent().find(".addGroup-fram").click(function  () {
                var num = $("#userNameIds").val();
                $("#userNameIds").val( parseInt(num)+1);
                var addGroupHtmlFram=$(this).parent().parent().parent().clone();
                addGroupHtmlFram.find("a").removeClass("addGroup-fram").addClass("removeGroup-fram").html("<i class=\'fa fa-minus-circle\'></i> 删除");
                addGroupHtmlFram.find("input").val("");
                addGroupHtmlFram.find("label[class='control-label p-n error']").text("");
                addGroupHtmlFram.find("input[name='userName']").attr("id","useNameAdd_frame"+num);
                addGroupHtmlFram.find("label[class='col-md-10 p-l-lg col-md-offset-2 text-danger']").text('');
                addGroupHtmlFram.find("label[class='col-md-8 p-l-lg col-md-offset-2 text-danger']").text('');
                $(this).parent().parent().parent().after(addGroupHtmlFram);
                inputInit("useNameAdd_frame"+num);
                //删除添加的组
                $(".removeGroup-fram").click(function () {
                    $(this).parent().parent().parent().remove();
                })
            });

            //删除添加的组
            $(".removeTitleContent").click(function () {
                $(this).parent().parent().parent().remove();
            });
        });

        //表单里面的新增-IP
        $(".addGroup-ip").click(function  () {
            var addGroupHTML=$(this).parent().parent().clone();
            addGroupHTML.find("a").removeClass("addGroup-ip").addClass("removeGroup-ip").html("<i class=\'fa fa-minus-circle\'></i> 删除");
            addGroupHTML.find("label[class='control-label p-n error']").text("");
            addGroupHTML.find("input").val("");
            addGroupHTML.find("label[class='col-md-10 p-l-lg col-md-offset-2 text-danger']").text('');
            addGroupHTML.find("label[class='col-md-8 p-l-lg col-md-offset-2 text-danger']").text('');
            $(this).parent().parent().after(addGroupHTML);
            //删除添加的组
            $(".removeGroup-ip").click(function () {
                $(this).parent().parent().remove();
            });
        });

        //表单里面的新增--机架
        $(".addGroup-fram").click(function  () {
            var num = $("#userNameIds").val();
            $("#userNameIds").val( parseInt(num)+1);
            var addGroupHtmlFram=$(this).parent().parent().parent().clone();
            addGroupHtmlFram.find("a").removeClass("addGroup-fram").addClass("removeGroup-fram").html("<i class=\'fa fa-minus-circle\'></i> 删除");
            addGroupHtmlFram.find("input").val("");
            addGroupHtmlFram.find("label[class='control-label p-n error']").text("");
            addGroupHtmlFram.find("input[name='userName']").attr("id","useNameAdd_frame"+num);
            addGroupHtmlFram.find("label[class='col-md-10 p-l-lg col-md-offset-2 text-danger']").text('');
            addGroupHtmlFram.find("label[class='col-md-8 p-l-lg col-md-offset-2 text-danger']").text('');
            $(this).parent().parent().parent().after(addGroupHtmlFram);
            inputInit("useNameAdd_frame"+num);
            //删除添加的组
            $(".removeGroup-fram").click(function () {
                $(this).parent().parent().parent().remove();
            })
        });

        $('#ipUseType').change(function(){
            if($('#ipUseType').val()!=2){
                $('#ipUseType').parent().parent().parent().parent().find('.blflg').show();
            }else{
                $('#ipUseType').parent().parent().parent().parent().find('.blflg').hide();
            }
        });
        //机房性质变化事件绑定
        $("#identyFlagAdd").change(function () {
            var ipTypeIds = $("#ipTypeIds").val();
            if($("#identyFlagAdd").val()==5){
                if(ipTypeIds==""){
                    cselect.initSelectJcdm('ipdzsyfs','ipUseType',null,3);
                }else{
                    var arrId = ipTypeIds.split(',');
                    cselect.initSelectJcdm('ipdzsyfs','ipUseType',null,3);
                    for(var n in arrId){
                        cselect.initSelectJcdm('ipdzsyfs',arrId[n],null,3);
                    }
                }
            }else {
                if(ipTypeIds==""){
                    cselect.initSelectJcdm('ipdzsyfs','ipUseType',null,4);
                }else{
                    var arrId = ipTypeIds.split(',');
                    cselect.initSelectJcdm('ipdzsyfs','ipUseType',null,4);
                    for(var n in arrId){
                        cselect.initSelectJcdm('ipdzsyfs',arrId[n],null,4);
                    }
                }
            }
        });

        /* //核验结果导出
         $("#resultExport").click(function () {
             $.ajax({
                 url:"getChkResult",
                 type:"POST",
                 data:{"houseIds":$("#resultHouseId").val()},
                 async:false,
                 dataType: 'json',
                 success:function (data) {
                     var reslutMsg = "";
                     if(data.resultMsg!=null){
                         reslutMsg = data.resultMsg;
                     }
                     js_export(reslutMsg,'createInvote');
                 }});

         });*/

        $("#btn_edt").click(function () {
            houseInfo.editSave();
        });

        //下一步
        $("#add-modal .next").click(function() {
            //校验
            if(add_index  == 0){
                if(!houseInfo.houseMain_chk()){
                    return false;
                }
            }else if(add_index  == 1){
                if(!houseInfo.houseIp_chk()){
                    return false;
                }
            }else if(add_index  == 2 && $("#identyFlagAdd").val() != 5){
                if(!houseInfo.houseFram_chk()){
                    return false;
                }
            }
            //  机架页面显示与不显示
            if($("#identyFlagAdd").val() == 5) {
                houseObj.frameList = null;
                $("#add-modal .wizard-steps>div").eq(2).hide();
                $("#add-modal .wizard-steps>div").eq(3).find("span").text("3")
                $("#add-modal .wizard-content>.step-content").eq(2).hide();
            } else {
                $("#add-modal .wizard-steps>div").eq(2).show();
                $("#add-modal .wizard-steps>div").eq(3).find("span").text("4")
                $("#add-modal .wizard-content>.step-content").eq(2).show();
            }
            $("#add-modal .prev").parent().css("display", "inline-block");
            add_index++;
            //专线跳过机架
            if(add_index == 2 && $("#identyFlagAdd").val() == 5){
                $("#add-modal .wizard-steps>div").eq(3).addClass("completed-step active-step").siblings().removeClass("active-step");
                $("#add-modal .wizard-content>.step-content").eq(3).show().siblings().hide();
                if(add_index % 4 == 2) {
                    $("#add-modal .prequalification").parent().show();
                    $("#add-modal .next").parent().hide();
                }
            }else{
                $("#add-modal .wizard-steps>div").eq(add_index % 4).addClass("completed-step active-step").siblings().removeClass("active-step");
                $("#add-modal .wizard-content>.step-content").eq(add_index % 4).show().siblings().hide();
                if(add_index % 4 == 3) {
                    $("#add-modal .prequalification").parent().show();
                    $("#add-modal .next").parent().hide();
                }
            }

        });
        //上一步
        $("#add-modal .prev").click(function() {
            //   跳转到第3步的条件 start
            if(add_index == 3 && $("#identyFlagAdd").val() == 5) {
                $("#add-modal .wizard-steps>div").eq(2).hide();
                $("#add-modal .wizard-steps>div").eq(3).find("span").text("3")
                $("#add-modal .wizard-content>.step-content").eq(2).hide();
                add_index = 2;
            }
            //跳转到第3步的条件 end
            $("#add-modal .prequalification").parent().css("display", "none");
            $("#add-modal .next").parent().css("display", "inline-block");
            $("#add-modal .prev").parent().css("display", "inline-block");
            add_index--;
            //console.log(add_index%4+"上一步")
            $("#add-modal .wizard-steps>div").eq(add_index % 4).addClass("active-step").siblings().removeClass("active-step");
            $("#add-modal .wizard-content>.step-content").eq(add_index % 4).show().siblings().hide();
            if(add_index % 4 == 0) {
                $("#add-modal .prev").parent().hide();
                $("#add-modal .next").parent().show();
            }
        });
        //新增页面预审
        $("#approve").on("click",function () {
            $("#add-modal .prev").attr("disabled",'true');
            $("#add-modal .prequalification").attr("disabled",'true');
            $("#add-modal .next").attr("disabled",'true');
            $("#addCancel").attr("disabled",'true');

            if(!houseInfo.houseLink_chk()){
                $("#add-modal .prev").removeAttrs("disabled");
                $("#add-modal .prequalification").removeAttrs("disabled");
                $("#add-modal .next").removeAttrs("disabled");
                return false;
            }else{
                $.ajax({
                    url: 'save',
                    type: 'POST',
                    contentType: 'application/json',
                    data:JSON.stringify(houseObj),
                    async:true,
                    dataType: 'json',
                    success: function(data){
                        console.log(data.resultCode);
                        if(data.resultCode==1){
                            console.log("错误提示");
                            var errorMsg = "";
                            for(var n in data.ajaxValidationResult.errorsArgsMap){
                                if(errorMsg==""){
                                    errorMsg = data.ajaxValidationResult.errorsArgsMap[n];
                                }else{
                                    errorMsg = errorMsg +"<br/>"+ data.ajaxValidationResult.errorsArgsMap[n];
                                }
                            }
                            swal({
                                title: "新增失败",
                                text: errorMsg,
                                type: "error",
                                html:true
                            }, function(isConfirm) {
                                $("#add-modal .prev").removeAttrs("disabled");
                                $("#add-modal .prequalification").removeAttrs("disabled");
                                $("#add-modal .next").removeAttrs("disabled");
                                $("#addCancel").removeAttrs("disabled");
                            })
                        }else{
                            swal({
                                title: "预审通过,IDC/ISP信息安全管理系统进行机房上报审核中！",
                                type: "success",
                                // closeOnConfirm: true
                            }, function(isConfirm) {
                                $("#add-modal .prev").removeAttrs("disabled");
                                $("#add-modal .prequalification").removeAttrs("disabled");
                                $("#add-modal .next").removeAttrs("disabled");
                                $("#addCancel").removeAttrs("disabled");
                                if(isConfirm) {
                                    houseInfo.refreshIndex();
                                    $("#add-modal").modal('hide');
                                }
                            })
                        }
                    }
                });
            }
        });

        // 机房信息导出
        $("#exportBtn").click(function () {
            houseInfo.exportData();
        });

        $("#uploadBtn").click(function(){
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
                handleFile.initClick();
                $("#upload").modal("show");
            }
        });

        // 机房信息导入
        $('#subImport').click(function () {
            handleFile.importFile('/import/houseInfo',"indexTable");
        });

    },
    cleanData:function(){
        $("#houseMianAddForm input").val("");
        $("#houseMianAddForm select").val("");
        $("#ipChildForm input").val("");
        $("#ipChildForm select").val("");
        $("#framChildForm input").val("");
        $("#framChildForm select").val("");
        $("#linkChildForm input").val("");
        $("#linkChildForm select").val("");
        $(".removeGroup-ip").parent().parent().remove();
        $(".removeGroup-fram").parent().parent().remove();
        $(".removeTitleContent").parent().parent().parent().remove();
    },
    //新增
    houseAdd:function(){
        $('#houseAddBt').click(function(){
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
            }

            //新增分配使用日期
            icom.tpick.createTimePick().initSingleDate("startUseAdd",4)
            $(".fa-minus-circle").parent().parent().parent().remove();
            houseInfo.cleanData();
            cselect.initSelectJcdm('jfxz','housTypeAdd',null);
            icom.asel.createAreaSelect("addProvince","addCity","addCounty",1,null,null,null,1);
            cselect.initSelectJcdm('zjlx','netSecTypeAdd',null,1);
            cselect.initSelectJcdm('zjlx','ipTypeAdd',null,2);
            cselect.initSelectJcdm('zjlx','framTypeAdd',null,2);
            cselect.initSelectJcdm('ipdzsyfs','ipUseType',null,4);
            $('.blflg').show();
            $("#idPlus").val(1);
            //子节点隶属单位初始化
            //ip地址段
            $("#ipInfoArea_parent").html('<select  id="ipInfoArea" class="form-control selectpicker"  name="areaCode"></select>');
            cselect.loadUserSubAreaCode("ipInfoArea");
            //机架
            $("#framInfoArea_parent").html('<select  id="framInfoArea" class="form-control selectpicker"  name="areaCode"></select>');
            cselect.loadUserSubAreaCode("framInfoArea");
            //链路
            $("#linkInfoArea_parent").html('<select  id="linkInfoArea" class="form-control selectpicker"  name="areaCode"></select>');
            cselect.loadUserSubAreaCode("linkInfoArea");

            //初始化 start
            //默认显示第一步
            $("#add-modal  .wizard-steps>div").eq(0).addClass("completed-step active-step").siblings().removeClass("completed-step active-step");
            $("#add-modal .wizard-content>.step-content").eq(0).show().siblings().hide();
            $("#add-modal .wizard-content input").val("");
            //初始化时候，上一步btn、完成btn、预审btn隐藏，下一步btn显示
            $("#add-modal .prev").parent().css("display", "none");
            $("#add-modal .prequalification").parent().css("display", "none");
            $("#add-modal .next").parent().css("display", "inline-block");
            add_index = 0; //add_index重置为0

            //用户单位名称初始化
            inputInit("useNameAdd_ip");
            inputInit("useNameAdd_frame");
            //初始化 end
            cleanErrorText("houseAddPage");
            $("#add-modal").modal("show");
        });

    },
    detailTableInit:function(){
        initTable.initBoostrapTable("ipTableDetial","getIpDetail",houseInfo.getTableColumns(2),getIpQueryParam);
        initTable.initBoostrapTable("frameTableDetail","getFrameDetail",houseInfo.getTableColumns(3),getFrameQueryParam);
        initTable.initBoostrapTable("linkTableDetail","getLinkDetail",houseInfo.getTableColumns(4),getLinkQueryParam);
    },
    //详情展示
    showDetail:function(index){
        var houseList = $("#indexTable").bootstrapTable('getData');
        var houseId = houseList[index].houseId;
        $("#tabHead").find("li").removeClass("active");
        $("#tab2").removeClass("active");
        $("#tab3").removeClass("active");
        $("#tabHead").find("li").eq(0).addClass("active");
        $("#tab1").addClass("active");
        $.ajax({
            url:"getHouseDetail",
            type:"GET",
            data:{"houseId":houseId},
            async:false,
            dataType: 'json',
            success:function (data) {
                if(data!=null){
                    $("#detailHouseId").val(houseId);
                    $("#houseNo_dt").text(data.houseIdStr);
                    /*if(data.preHouseName!=null && data.preHouseName!='' && data.preHouseName!=data.houseName){
                        var html = '<span>'+data.houseName+'</span><span class="text-info">('+data.preHouseName+')</span>';
                        $('#houseName_dt').html(html);
                    }else{*/
                    var html = '<span>'+data.houseName+'</span>';
                    $('#houseName_dt').html(html);
                    // }
                    $("#houseType_dt").text(getJCDM_STR("jfxz",data.houseType));
                    var addr_detail = "";
                    if((data.provinceName == data.cityName)||data.cityName==null){//直辖市省份和地级市相同，取一个即可
                        addr_detail = data.provinceName;
                    }else {
                        addr_detail = data.provinceName + data.cityName;
                    }
                    if(data.countyName!=null){
                        addr_detail+=data.countyName;
                    }
                    $("#houseAddress_dt").attr('title',addr_detail);
                    $("#houseAddress_dt").text(addr_detail);
                    if(data.identity==1){
                        $("#identity_dt").text("IDC");
                    }else{
                        $("#identity_dt").text("专线");
                    }
                    $("#houseOfficerName_dt").text(data.houseOfficerName);
                    $("#dealFlag_dt").text(dealFlagFormatter(data.dealFlag));
                    $("#houseOfficerIdType_dt").text(zjlxFormatter(data.houseOfficerIdType));
                    $("#houseOfficerId_dt").text(data.houseOfficerId);
                    $("#houseOfficerTelephone_dt").text(data.houseOfficerTelephone);
                    $("#houseOfficerMobile_dt").text(data.houseOfficerMobile);
                    $("#houseOfficerEmail_dt").text(data.houseOfficerEmail);

                    if(data.dealFlag !=2 && data.dealFlag !=4){
                        $("#detail_approv").show();
                    }else{
                        $("#detail_approv").hide();
                    }
                    houseInfo.detailTableInit();
                    $("#details").modal('show');
                }
            }
        })
    },
    //主页刷新
    refreshIndex:function(){
        initTable.refreshTable("indexTable","houselist");
    },
    doPreJud:function(ids,flag){
        $.ajax({
            url:"preJudHouse",
            type:"POST",
            data:{"houseIds":ids},
            async:false,
            dataType: 'json',
            success:function (data) {
                if(data.resultCode==0){
                    swal({
                        title: "预审成功,IDC/ISP信息安全管理系统进行机房上报审核中！",
                        type: "success",
                    }, function(isConfirm) {
                        if(isConfirm) {
                            if(flag!=undefined && flag!=null ){
                                $("#details").modal("hide");
                            }
                            houseInfo.refreshIndex();
                        }
                    })
                }else{
                    swal({
                        title: "预审失败",
                        text: data.resultMsg,
                        type: "error",
                    }, function(isConfirm) {
                        if(isConfirm) {
                            houseInfo.refreshIndex();
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
                    url:"delete",
                    type:"POST",
                    data:{"houseIds":ids},
                    async:false,
                    dataType: 'json',
                    success:function (data) {
                        houseInfo.refreshIndex();
                        if(data.resultCode==0){
                            swal({
                                title: "删除成功",
                                type: "success",
                            })
                        }else{
                            swal({
                                title: "删除失败",
                                text: data.resultMsg,
                                type: "error",
                            })
                        }
                    }});
            }
        });

    },
    cancelJud:function(id){
        $.ajax({
            url:"revertApprove",
            type:"POST",
            data:{"houseIds":id},
            async:false,
            dataType: 'json',
            success:function (data) {
                if(data.resultCode==0){
                    swal({
                        title: "撤销预审成功",
                        type: "success",
                    }, function(isConfirm) {
                        if(isConfirm) {
                            houseInfo.refreshIndex();
                        }
                    })
                }else{
                    swal({
                        title: "撤销预审失败",
                        text: data.resultMsg,
                        type: "error",
                    }, function(isConfirm) {
                        if(isConfirm) {
                            houseInfo.refreshIndex();
                        }
                    })
                }
            }});
    },
    editHouse:function(id){
        cleanErrorText("edit_form");
        $.ajax({
            url:"getHouseDetail",
            type:"GET",
            data:{"houseId":id},
            async:false,
            dataType: 'json',
            success:function (data) {
                if(data!=null){
                    $("#editHouseId").val(id);
                    $("#houseNo_edt").val(data.houseIdStr);
                    $('#houseName_edt').val(data.houseName);
                    cselect.initSelectJcdm('jfxz','houseType_edt',data.houseType);
                    if(data.identity==1){
                        $("#identity_dt_id").val(1);
                        $('#identyFlag_edt').val("IDC");
                    }else if(data.identity==5){
                        $("#identity_dt_id").val(5);
                        $('#identyFlag_edt').val("专线");
                    }

                    icom.asel.createAreaSelect("addProvince_edt","addCity_edt","addCounty_edt",1,data.houseProvince,data.houseCity,data.houseCounty,1);
                    $('#house_edt').val(data.houseAddress);
                    $('#netSecName_edt').val(data.houseOfficerName);
                    cselect.initSelectJcdm('zjlx','netSecType_edt',data.houseOfficerIdType,1);
                    $('#netSecNo_edt').val(data.houseOfficerId);
                    $('#netSecPhone_edt').val(data.houseOfficerTelephone);
                    $('#netSecMobilePhone_edt').val(data.houseOfficerMobile);
                    $('#netSecMail_edt').val(data.houseOfficerEmail);
                    $("#modify").modal("show");
                }
            }
        })

    },
    editSave:function(){
        var validate = true;
        $("#edit_form").find("label .error").text('');
        var query = $('#edit_form').serializeObject();
        query.houseProvince= $('#addProvince_edt').val();
        if($('#addCity_edt').val()!=undefined && $('#addCity_edt').val()!=""){
            query.houseCity= $('#addCity_edt').val();
        }else{
            query.houseCity= $('#addProvince_edt').val();
        }
        if($('#addCounty_edt').val()!=undefined && $('#addCounty_edt').val()!=""){
            query.houseCounty= $('#addCounty_edt').val();
        }else{
            query.houseCounty= $('#addProvince_edt').val();
        }
        if(!$('#edit_form').valid()){
            validate = false;
        }
        if(!validate){
            return validate;
        }
        if(Array.isArray(query.areaCode)){
            query.areaCode = query.areaCode.join(",");
        }
        var userInfo = icom.auth.getUserInfo();
        query.updateUserId = userInfo.userId;
        $.ajax({
            url: 'update',
            type: 'POST',
            contentType: 'application/json',
            data:JSON.stringify(query),
            async:false,
            dataType: 'json',
            success:function (data) {
                if(data.resultCode==0){
                    swal({
                        title: "预审通过,IDC/ISP信息安全管理系统进行机房上报审核中！",
                        type: "success",
                    }, function(isConfirm) {
                        if(isConfirm) {
                            houseInfo.refreshIndex();
                            $("#modify").modal("hide");
                        }
                    })
                }else {
                    var map=data.ajaxValidationResult.errorsArgsMap;
                    for (var attr in map) {
                        var error_id = attr+'_error';
                        $('#edit_form').find("label[id="+error_id+"]").text(map[attr]);
                    }
                    return false;
                }
            }})
    },

    syncTime:function () {
        // handleFile.getProcess('/import/getStatus');
        handleFile.getProcess('/import/getStatus',2);
    },

    init:function(){
        dataList = jcdmCode.getData().jfxzArr;
        houseInfo.initBtn();
        houseInfo.searchBtn();
        houseInfo.houseAdd();
        houseInfo.initTable();
        // 导出模板
        handleFile.exportTemplate('/export/houseTemplate');
        // 导出失败结果
        handleFile.exportErrorFile('/export/houseErrorFile');
        // 更新导入状态
        houseInfo.syncTime();
    }
};

houseInfo.init();

function detail(index){
    houseInfo.showDetail(index);
}

function preJud(index){
    var houseList = $("#indexTable").bootstrapTable('getData');
    var houseId = houseList[index].houseId;
    var idarr = [];
    idarr.push(houseId);
    houseInfo.doPreJud(idarr);
}

function resetImportProcess() {
    var process = $('#importProcess >div');
    process.attr("style","width: 0%;");
    process.text("0%");
    $('#errorFile').html("");
    $('#lastImportStatus').val(1);
    houseInfo.syncTime();
}

function deleteRow(index){
    var houseList = $("#indexTable").bootstrapTable('getData');
    var houseId = houseList[index].houseId;
    var idarr = [];
    idarr.push(houseId);
    houseInfo.delete(idarr);
}

function cancelJud(index){
    var houseList = $("#indexTable").bootstrapTable('getData');
    var houseId = houseList[index].houseId;
    houseInfo.cancelJud(houseId);
}

function editHouse(index){
    var houseList = $("#indexTable").bootstrapTable('getData');
    var houseId = houseList[index].houseId;
    houseInfo.editHouse(houseId);
}

//机房服务性质格式化修改
function jfxzFormatterModify(value, row, index){
    var result = "";
    // var dataList = jcdmCode.getData().jfxzArr;
    for(var n in dataList){
        if(value==dataList[n].id){
            return dataList[n].mc;
        }
    }
    return "";
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
