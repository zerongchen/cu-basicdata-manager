/**
 * 机房主体信息页面
 *
 *
 **/
function getQueryParam(params){
    var query = "";
    query = $('#indexSearch').serializeObject();
    query.pageIndex = params.offset/params.limit+1;
    query.pageSize = params.limit;
    query.setmode = $('#setmode').val();
    query.bandWidth = $('#bandWidth').val();
    query.distributeTime = $('#distributeTime').val();
    query.startDate = $('#start').val();
    query.endDate = $('#end').val();
    var ss = $("#sel_house").val();
    if($("#sel_house").val()!=null){
        query.houseIDs = $("#sel_house").val().join(",");
    }
    return query;
}

var userBandWidth = {
    getTableColumns:function(type){
        var columns = [];

        columns = [{
            checkbox: true
        }, {
            field: 'unitName',
            title: '单位名称',
        }, {
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
                title: '更新时间'
            }];
        return columns;
    },
    initTable:function(){
        initTable.initBoostrapTable("indexTable","/rptUser/userHH/list",userBandWidth.getTableColumns(),getQueryParam);
    },
    searchBtn:function(){
        $('#serviceIndexSearch').click(function(){
            initTable.refreshTable("indexTable","/rptUser/userHH/list");
        });
    },
    clearDate:function(){
        $("#userHHChildForm input").val("");
        $("#userHHChildForm select").val("");
        $(".removeTitleContent").parent().parent().parent().remove();
    },
    addNew:function(){
        $("#hhForms").find("label.error").text("");
        $("#unitNameAdd").removeAttrs("disabled");
        $(".removeGroup").parent().parent().remove();
        $("#bandWidthTitle").html('<i class="fa fa-plus m-r-xs"></i>新增');
        $("#myModaladd").find("h4").text("新增信息");
        $("#bandWidthTitle").addClass('addTitle');
        $("#bandWidthId_sa").val('');
        //单位名称
        var htmls ='<select  id="unitNameAdd" class="form-control selectpicker " multiple data-live-search="false" name="userId" required>' +
            '                            </select>';
        $("#unitNameSel").html(htmls);
        cselect.initSelectCommon("unitNameAdd","/common/getUnitNameList","",1);
        //机房
        var html1 ='<select  id="houseIdAdd" class="form-control selectpicker " multiple data-live-search="false" name="houseId" required>' +
            '                            </select>';
        $("#houseIds").html(html1);
        cselect.initSelectCommon("houseIdAdd","/getHouseSelectInfo","",1);
        //隶属地市码
        var html ='<select  id="userhhArea" class="form-control selectpicker " multiple data-live-search="false" name="areaCode" required>' +
            '                            </select>';
        $("#parentAreaCode").html(html);
        cselect.initSelectCommon("userhhArea",'/common/getSubOrdArea',"");
        userBandWidth.clearDate();
        icom.tpick.createTimePick().initSingleDate("distributeTimeId_sa",4);
        $("#addPlus").val(1);
        $("#myModaladd").modal('show');
    },
    refreshIndex:function(){
        initTable.refreshTable("indexTable","bandwidthlist");
    },
    save:function(){
        var validate = true;
        var url = '';
        var title = '';
        var query = new Array();
        var userInfo = icom.auth.getUserInfo();
        if($("#bandWidthId_sa").val()=="" || $("#bandWidthId_sa").val()==undefined){
            url = 'save';
            title = '新增成功';
            $("#hhForms").find("label.error").text("");
            var allForm = $('#hhForms').find('form');
            var form;
            var data;
            for (var i=0;i<allForm.length;i++){
                form =  allForm.eq(i);
                data = form.formToJSON();
                data.outIndex = i;
                if(!form.valid()){
                    if(data.areaCode == undefined || data.areaCode==""){
                        form.find("label[name='areaCode_error']").text("请选择隶属单位地市码");
                    }
                    if(data.houseId == undefined || data.houseId==""){
                        form.find("label[name='houseId_error']").text("请选择机房");
                    }
                    if(data.userId == undefined || data.userId==""){
                        form.find("label[name='unitName_error']").text("请选择单位名称");
                    }
                    return false;
                }
                if(data.areaCode == undefined || data.areaCode==""){
                    form.find("label[name='areaCode_error']").text("请选择隶属单位地市码");
                    validate = false;
                }
                if(data.houseId == undefined || data.houseId==""){
                    form.find("label[name='houseId_error']").text("请选择机房");
                    validate = false;
                }
                if(data.userId == undefined || data.userId==""){
                    form.find("label[name='unitName_error']").text("请选择单位名称");
                    validate = false;
                }
                if(!validate){
                    return false;
                }
                if(Array.isArray(data.areaCode)){
                    data.areaCode = data.areaCode.join(",");
                }
                data.createUserId = userInfo.userId;
                data.updateUserId = userInfo.userId;
                data.cityCodeList = userInfo.userAreaCode.split(",");
                query.push(data);
            }
        }else{
            url = 'update';
            title = '修改成功';
            var data = $("#userHHChildForm").serializeObject();
            if(!$("#userHHChildForm").valid()){
                if(data.areaCode == undefined || data.areaCode==""){
                    form.find("label[name='areaCode_error']").text("请选择隶属单位地市码");
                }
                if(data.houseId == undefined || data.houseId==""){
                    form.find("label[name='houseId_error']").text("请选择机房");
                }
                return false;
            }
            if(data.areaCode == undefined || data.areaCode==""){
                form.find("label[name='areaCode_error']").text("请选择隶属单位地市码");
                validate = false;
            }
            if(data.houseId == undefined || data.houseId==""){
                form.find("label[name='houseId_error']").text("请选择机房");
                validate = false;
            }
            if(!validate){
                return false;
            }
            if(Array.isArray(data.areaCode)){
                data.areaCode = data.areaCode.join(",");
            }
            data.updateUserId = userInfo.userId;
            data.cityCodeList = userInfo.userAreaCode.split(",");
            data.outIndex = 0;
            query.push(data);
        }
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
                    $.ajax({
                        url: url,
                        type: 'POST',
                        contentType: 'application/json',
                        data:JSON.stringify(query),
                        async:false,
                        dataType: 'json',
                        success:function (data) {
                            if(data.resultCode==0){
                                swal({
                                    title: title,
                                    text: "已经保存了所有记录",
                                    type: "success",
                                }, function(isConfirm) {
                                    if(isConfirm) {
                                        userBandWidth.refreshIndex();
                                        $("#myModaladd").modal("hide");
                                    }
                                })
                            }else {
                                swal({
                                    title: "保存失败",
                                    text: data.resultMsg,
                                    type: "success",
                                }, function(isConfirm) {
                                })
                            }
                        }})
                }else{
                    for (var attr in map) {
                        var error_id = attr+'_error';
                        $('#hhForms').find("label[name="+error_id+"]").eq(data.outIndex).text(map[attr]);
                    }
                    return false;
                }
            }
        });

    },
    initBtn:function(){

        //首页时间查询条件
        icom.tpick.createTimePick().initDoubleDate("start","end",4);
        icom.tpick.createTimePick().initSingleDate("distributeTime",4);
        //机房下拉框
        var house_sel = icom.rsel.createRichSelect("sel_house",{
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
        //新增按钮
        $("#bandWidthAddBt").click(function () {
            userBandWidth.addNew();
        });
        //页面中新增事件绑定
        $(".addTitle").click(function () {
            var addTitleHTML=$(this).parent().parent().parent().clone();
            addTitleHTML.find("h5>a").removeClass("addTitle").addClass("removeTitleContent").html("<i class=\'fa fa-minus\'></i> 删除");

            var num = $("#addPlus").val();
            $("#addPlus").val( parseInt(num)+1);
            var id = "userhhArea"+num;
            var nameId = "unitNameAdd"+num;
            var houseId = "houseIdAdd" + num;
            //隶属单位
            addTitleHTML.find("#userhhArea").next('div').remove();
            addTitleHTML.find("#userhhArea").attr('id',id);
            //单位名称
            addTitleHTML.find("#unitNameAdd").next('div').remove();
            addTitleHTML.find("#unitNameAdd").attr('id',nameId);

            //机房
            addTitleHTML.find("#houseIdAdd").next('div').remove();
            addTitleHTML.find("#houseIdAdd").attr('id',houseId);
            //日期
            var nowId = "distributeTimeId_sa"+num;
            addTitleHTML.find('#distributeTimeId_sa').attr('id',nowId);
            addTitleHTML.find("input").val("");
            addTitleHTML.find("select").val("");
            $(this).parent().parent().parent().after(addTitleHTML);
            cselect.initSelectCommon(id,'/common/getSubOrdArea',"");
            cselect.initSelectCommon(houseId,"/getHouseSelectInfo","",1);
            cselect.initSelectCommon(nameId,"/common/getUnitNameList","",1);
            icom.tpick.createTimePick().initSingleDate(nowId,4);
            //删除添加的组
            $(".removeTitleContent").click(function () {
                $(this).parent().parent().parent().remove();
            });

        });

        //新增保存按钮
        $("#btnAdd").click(function () {
            userBandWidth.save();
        });

        //批量删除
        $("#index_delete").click( function () {
            var banwidthList =  $("#indexTable").bootstrapTable('getSelections');
            if(banwidthList.length<=0){
                swal({
                    title: "请至少选择一条数据操作",
                }, function(isConfirm) {
                })
            }else{
                var ids = [];
                for(var n in banwidthList){
                    ids.push(banwidthList[n].hhId);
                }
                userBandWidth.delete(ids);
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
            cancelButtonText: "让我再考虑一下…",
            closeOnConfirm: false,
            closeOnCancel: false
        }, function(isConfirm) {
            if(isConfirm) {
                $.ajax({
                    url:"delete",
                    type:"POST",
                    data:{"hhIds":ids},
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
                                    userBandWidth.refreshIndex();
                                }
                            })
                        }else{
                            swal({
                                title: "删除失败",
                                text: data.resultMsg,
                                type: "error",
                            }, function(isConfirm) {
                                if(isConfirm) {
                                    userBandWidth.refreshIndex();
                                }
                            })
                        }
                    }});
            } else {
                swal("已取消", "取消了删除操作！", "error")
            }
        });
    },
    editInfo:function(bandWidth){
        userBandWidth.clearDate();
        $("#hhForms").find("label.error").text("");
        $("#unitNameAdd").attr("disabled","disabled");
        $(".removeGroup").parent().parent().remove();
        $("#bandWidthTitle").html('修改');
        $("#myModaladd").find("h4").text("修改信息");
        $("#bandWidthTitle").removeClass('addTitle');
        $("#bandWidthId_sa").val(bandWidth.hhId);
        $("#bandWidthId").val(bandWidth.bandWidth);
        //单位名称
        var htmls = '<input type="text" class="form-control" readonly value="'+bandWidth.userId+'" name="userId" required>';
        $("#unitNameSel").html(htmls);
        //机房
        var html1 ='<select  id="houseIdAdd" class="form-control selectpicker " multiple data-live-search="false" name="houseId" required>' +
            '                            </select>';
        $("#houseIds").html(html1);
        cselect.initSelectCommon("houseIdAdd","/getHouseSelectInfo",[bandWidth.houseId],1);
        //隶属地市码
        var html ='<select  id="userhhArea" class="form-control selectpicker " multiple data-live-search="false" name="areaCode" required>' +
            '                            </select>';
        $("#parentAreaCode").html(html);
        cselect.initSelectCommon("userhhArea",'/common/getSubOrdArea',bandWidth.areaCode.split(","));
        icom.tpick.createTimePick().initSingleDate("distributeTimeId_sa",4);
        $("#distributeTimeId_sa").val(bandWidth.distributeTime);
        $("#addPlus").val(1);
        $("#myModaladd").modal('show');
    },
    init:function(){
        userBandWidth.initBtn();
        userBandWidth.initTable();
        userBandWidth.searchBtn();
    }
};

userBandWidth.init();

function editBandWidth(index){
    var bandList = $("#indexTable").bootstrapTable('getData');
    userBandWidth.editInfo(bandList[index]);
}

function deleteRow(index){
    var bandList = $("#indexTable").bootstrapTable('getData');
    var hhId = bandList[index].hhId;
    var idarr = [];
    idarr.push(hhId);
    userBandWidth.delete(idarr);
}