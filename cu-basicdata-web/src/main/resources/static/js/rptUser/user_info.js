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
    query.houseId = $('#ser_house').val();
    query.officerName = $('#sel_officerName').val();
    query.unitAddress = $('#sel_unitAddress').val();
    query.czlx = $('#sel_czlx').val();
    if($("#houseId").val()!=null){
        query.houseIDs = $("#houseId").val().join(",");
    }
    return query;
}

function getDetailQueryParam(params){
    var query ={
        userId:$("#detailUserId").val(),
        pageIndex:params.offset/params.limit+1,
        pageSize:params.limit
    };
    return query;
}

function getDetailIpQueryParam(params){
    var query ={
        unitName:$("#detailUserName").val(),
        idType:$("#detailIdType").val(),
        idNumber:$("#detailIdNumber").val(),
        pageIndex:params.offset/params.limit+1,
        pageSize:params.limit
    };
    return query;
}

function getDetailColumns(type) {
    var columns = new Array();
    if(type==1){
        columns = [{
            field: 'serviceType',
            title: '应用服务类型',
            formatter:appServerName,
            width:'100px',
        }, {
            field: 'serviceContent',
            title: '服务内容',
            formatter:fwnrFormatter,
            width:'240px'
        }, {
            field: 'registerId',
            title: '备案号',
            width:'150px'
        }, {
            field: '',
            title: '服务域名',
            formatter:function(value,row,index){
                var result = "";
                for (var n in row.domainList){
                    result+="["+row.domainList[n].domainName+"]";
                }
                return result;
            },
            width:'200px'
        }, {
            field: 'setmode',
            title: '接入方式',
            formatter:function (value, row, index) {
                return  getJCDM_STR('jrfs',value);
            }
        }, {
            field: 'business',
            title: '业务类型',
            formatter:businessFormatter
        } , {
            field: 'updateTime',
            title:  '更新时间',
            formatter: dateFormatter
        }];
    }else if(type==2){
        columns = [ {
            field: 'houseName',
            title: '机房名称'
        }, {
            field: 'distributeTime',
            title: '资源分配日期'
        }, {
            field: 'bandWidth',
            title: '网络带宽(Mbps)'
        }, {
            field: 'updateTime',
            title: '更新时间',
            formatter: dateFormatter
        }];
    }else if(type==3){
        columns = [ {
            field: 'houseName',
            title: '机房名称'
        }, {
            field: 'startIP',
            title: '起始IP地址'
        }, {
            field: 'endIP',
            title: '终止IP地址'
        }];
    }else if(type==4){
        columns = [{
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
            title: '更新时间',
            formatter: dateFormatter
        }];
    }
    return columns;
}

function natureFormatter(value, row, index){
    if(value==1){
        return "提供互联网用户";
    }else{
        return "其他用户";
    }
}
function dwsxFormatter(value, row, index){
    if(value==1){
        return "军队";
    }else if(value==2){
        return "政府机关";
    }else if(value==3){
        return "事业单位";
    }else if(value==4){
        return "企业";
    }else if(value==5){
        return "个人";
    }else if(value==6){
        return "社会团体";
    }else if(value==999){
        return "其他";
    }
}

function natureFormatter(value, row, index){
    if(value==1){
        return "提供互联网用户";
    }else{
        return "其他用户";
    }
}
function dwsxFormatter(value, row, index){
    if(value==1){
        return "军队";
    }else if(value==2){
        return "政府机关";
    }else if(value==3){
        return "事业单位";
    }else if(value==4){
        return "企业";
    }else if(value==5){
        return "个人";
    }else if(value==6){
        return "社会团体";
    }else if(value==999){
        return "其他";
    }
}
function identifyFormatter(value, row, index){
    var idens = value.split(",");
    var res = "";
    for(var n in idens){
        if(idens[n]==1){
            res += "[IDC用户]";
        }else if(idens[n]==2){
            res +=  "[ISP用户]";
        }else if (idens[n]==3){
            res +=  "[IDC/ISP用户]";
        }else if(idens[n]==4){
            res +=  "[CDN用户]";
        }else if (idens[n]==5){
            res +=  "[专线用户]";
        }
    }
    return res;
}

var rptHouseInfo = {
    getTableColumns:function(type){
        var columns = [
            {field: 'userId',title: 'ID',visible:false},
            {field: 'unitName',title: '单位名称'},
            {field: 'nature',title: '用户属性',width:'150px',formatter:natureFormatter},
            {field: 'identify',title: '用户标识',width:'75px',formatter:identifyFormatter},
            {field: 'unitNature',title: '单位属性',width:'75px',formatter:dwsxFormatter},
            {field: 'unitAddress',title: '单位地址',formatter:function(value, row, index){
            	var completeAddress=row.unitAddressProvinceName;
                if(row.unitAddressProvinceName == row.unitAddressCityName){//直辖市省份和地级市相同，取一个即可
                	completeAddress += row.unitAddressAreaName + row.unitAddress ;
                }else{
                	completeAddress += row.unitAddressCityName + row.unitAddressAreaName + row.unitAddress;
                }
                return completeAddress;
            }},
            {field: 'officerName',title: '网络负责人'},
            {field: 'updateTime',title: '更新时间',width:'100px',formatter: dateFormatter},
            {field: 'operating',title: '操作',formatter: function (value, row, index) {
                    var r_userDetail=$("#r_userDetail").val();
                    if(r_userDetail==1){
                        return '<a title="详情" href="#" class="m-r" onclick="detail('+index+')"><i class="fa fa-file-text-o fa-lg"></i></a>';
                    }
                    return '';
                },width:'150px'}];
        return columns;
    },
    initTable:function(){
        initTable.initBoostrapTable("indexTable","list",rptHouseInfo.getTableColumns(),getQueryParam,'commonButton2');
    },
    initBtn:function(){
        $('#userInfoIndexSearch').click(function(){
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
    getDetail:function (userInfo) {
        $("#detailUserId").val(userInfo.userId);
        $("#detailUserName").val(userInfo.unitName);
        $("#detailIdType").val(userInfo.idType);
        $("#detailIdNumber").val(userInfo.idNumber);
        $("#tabHead").find("li").removeClass("active");
        $("#tab4").removeClass("active");
        $("#tab2").removeClass("active");
        $("#tab3").removeClass("active");
        $("#tabHead").find("li").eq(0).addClass("active");
        $("#tab1").addClass("active");
        $("#nature_dt").text(natureFormatter(userInfo.nature,"",""));
        $("#unitName_dt").text(userInfo.unitName);
        $("#unitNature_dt").text(dwsxFormatter(userInfo.unitNature,"",""));
        $("#idType_dt").text(zjlxFormatter(userInfo.idType));
        $("#idNumber_dt").text(userInfo.idNumber);
        $("#registeTime_dt").text(userInfo.registeTime);
        $('#unitZipCode_dt').text(userInfo.unitZipCode);
        var completeAddress=userInfo.unitAddressProvinceName;
        if(userInfo.unitAddressProvinceName == userInfo.unitAddressCityName){//直辖市省份和地级市相同，取一个即可
        	completeAddress += userInfo.unitAddressAreaName;
        }else{
        	completeAddress += userInfo.unitAddressCityName + userInfo.unitAddressAreaName;
        }
        $("#unitAddress_dt").text(completeAddress + userInfo.unitAddress);
        $("#officerName_dt").text(userInfo.officerName);
        $("#officerIdType_dt").text(zjlxFormatter(userInfo.officerIdType));
        $("#officerTelphone_dt").text(userInfo.officerTelphone);
        $("#officerId_dt").text(userInfo.officerId);
        $('#officerMobile_dt').text(userInfo.officerMobile);
        $("#officerEmail_dt").text(userInfo.officerEmail);
        $("#serviceRegTime_dt").text(userInfo.registeTime);
        initTable.refreshTable("serviceTableDetial","/rptUser/userService/list");
        initTable.refreshTable("bandWidthTableDetail","/rptUser/userHH/list");
        initTable.refreshTable("ipTableDetail","/rptUser/userIp/list");
        initTable.refreshTable("virtualTableDetail","/rptUser/userVirtual/list");
        $("#details").modal('show');
    },
    initDetailTable:function () {
        initTable.initBoostrapTable("serviceTableDetial","/rptUser/userService/list",getDetailColumns(1),getDetailQueryParam);
        initTable.initBoostrapTable("bandWidthTableDetail","/rptUser/userHH/list",getDetailColumns(2),getDetailQueryParam);
        initTable.initBoostrapTable("ipTableDetail","/rptUser/userIp/list",getDetailColumns(3),getDetailIpQueryParam);
        initTable.initBoostrapTable("virtualTableDetail","/rptUser/userVirtual/list",getDetailColumns(4),getDetailQueryParam);
    },
    exportData:function () {
        $('#exportData').click(function () {
            let param = $('#indexSearch').formToJSON();
            let data = $('#moreSearchForm').formToJSON();
            $.extend(param,data);
            $('#exportUserDataForm').remove();
            var form = '<form class="hide" id="exportUserDataForm">';
            $.each(param, function(i) {
                form +='<input name="'+i+'" type="hidden" value="'+param[i]+'">'
            });
            form += '</form>';
            $('body').append(form);
            $('#exportUserDataForm').attr('action', '/export/exportRptUserData').attr('method', 'post').submit() ;return false;
        })
    },

   /* ready:function () {
        userExport.exportData();
        handleFile.exportTemplate('/export/userTemplate');
    },*/
    init:function(){
        rptHouseInfo.exportData();
        rptHouseInfo.initTable();
        rptHouseInfo.initBtn();
        rptHouseInfo.initDetailTable();
    }
};

rptHouseInfo.init();

function detail(index){
    var userList = $("#indexTable").bootstrapTable('getData');
    rptHouseInfo.getDetail( userList[index]);
}