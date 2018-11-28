
var ipSegList = [];
$(function(){

    icom.tpick.createTimePick().initDoubleDate("start","end",1);

    loadSelectHouse('sel_house');

    $("#infotable").bootstrapTable('destroy').bootstrapTable({
        method: 'post',
        url: '/userIp/userIPlist',
        queryParams: getQueryParam,
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
        clickToSelect:true,
        pageSize: 10,
        pageList: [10, 25, 50, 100, 200],
        uniqueId:'ipSegId',
        columns: [{field: '' ,checkbox:true},
            {field: 'ipSegId',title: 'ipID',visible:false},
            {field: 'userName',title: '单位名称',width:'120px'},
            {field: 'houseName',title: '机房名称',width:'120px'},
            {field: 'startIP',width:'120px',title: '起始IP'},
            {field: 'endIP',width:'120px',title: '结束IP'}
        ]
    });


    function getQueryParam(params){
        var query = "";
        query = $('#searchForm').serializeObject();
        var houseIDs = "";
        if(query.houseId!=null && query.houseId!=''){
        	if($.isArray(query.houseId)){
        		houseIDs = query.houseId.join(",");
        	}else{
        		houseIDs = query.houseId;
        	}
        }
        query.pageIndex = params.offset/params.limit+1;
        query.pageSize = params.limit;
        query.czlx = $('#czlx').val();
        query.ipType = $('#ipType').val();
        query.startDate = $('#start').val();
        query.endDate = $('#end').val();
        query.houseIDs = houseIDs;
        console.log(query);
        return query;
    }

    $('#searchBtn').click(function(){
        $("#infotable").bootstrapTable('refresh')
    });


    $('#btnCancelEdit').on('click',function(e){
        $("#editForm input,select").each(function(){
            $(this).val('');
        });
    });

    //h5标题的新增
    $(".addTitle").click(function () {
        var addTitleHTML=$(this).parent().parent().parent().clone();
        var num = $("#idPlus").val();
        $("#idPlus").val( parseInt(num)+1);
        var formId = addTitleHTML.find("form").attr('id');
        formId = formId + num;
        addTitleHTML.find("form").attr('id',formId);

        //隶属单位
        var id = addTitleHTML.find(".selectpicker").attr('id');
        id = id+num;
        addTitleHTML.find(".selectpicker").attr('id',id);
        addTitleHTML.find(".selectpicker").next('div').remove();

        addTitleHTML.find("h5>a").removeClass("addTitle").addClass("removeTitleContent").html("<i class=\'fa fa-minus\'></i> 删除");
        $(this).parent().parent().parent().after(addTitleHTML);
        //删除添加的组
        $(".removeTitleContent").click(function () {
            $(this).parent().parent().parent().remove();
        });
        cselect.initSelectCommon(id,'/common/getSubOrdArea');

        var nowId = addTitleHTML.find('[name=useTime]').attr('id')+num;
        addTitleHTML.find('[name=useTime]').attr('id',nowId);
        icom.tpick.createTimePick().initSingleDate(nowId,4);
        //清空原来值
        $("#"+id).parent().parent().parent().find(".removeGroup").parent().parent().parent().remove();
        $('#'+formId+' input').val("");

        //表单里面的新增
        $("#"+id).parent().parent().parent().find(".addGroup-ip").click(function  () {
            var addGroupHtmlFram=$(this).parent().parent().clone();
            addGroupHtmlFram.find("a").removeClass("addGroup-ip").addClass("removeGroup-ip").html("<i class=\'fa fa-minus-circle\'></i> 删除");
            addGroupHtmlFram.find("input").val("");
            $(this).parent().parent().after(addGroupHtmlFram);
            //删除添加的组
            $(".removeGroup-ip").click(function () {
                $(this).parent().parent().remove();
            })
        });
    });

    //表单里面的新增
    $(".addGroup-ip").click(function  () {
        var addGroupHTML=$(this).parent().parent().clone();
        addGroupHTML.find("a").removeClass("addGroup-ip").addClass("removeGroup-ip").html("<i class=\'fa fa-minus-circle\'></i> 删除");
        $(this).parent().parent().after(addGroupHTML);
        //删除添加的组
        $(".removeGroup-ip").click(function () {
            $(this).parent().parent().remove();
        })
    });

    $('#ipUseType').change(function(){
        if($('#ipUseType').val()!=2){
            $('#ipUseType').parent().parent().parent().parent().find('.blflg').show();
        }else{
            $('#ipUseType').parent().parent().parent().parent().find('.blflg').hide();
        }
    });
});


function operateFormatter(value, row, index){
    var op="";
    //var status=row.dealFlagHouse;
    //处理标记（0-未预审、1-预审不通过、2-上报审核中、3-上报审核不通过、4-提交上报、5-上报成功、6-上报失败）
    //if(status==0 || status==1 || status==3 || status==5 || status==6){
        op+="<a data-toggle='modal' data-target='#myModaledit' onclick=\"beforeUpdate('"+row.ipSegId+"');\" title='修改' class='m-r'><i class='fa fa-edit fa-lg'></i></a>";
        op+="<a  class='m-r demo4' onclick=\"deleteFun('"+row.ipSegId+"');\"  title='删除'><i class='fa fa-close fa-lg'></i></a>" ;
    //}
    return op;
}

function addFun(){

    //loadSelectHouse('houseId_add');
    cselect.initSelectCommon("ipInfoArea","/common/getSubOrdArea","");
    cselect.initSelectJcdm('zjlx','ipTypeAdd',null);
    icom.tpick.createTimePick().initSingleDate('startUseAdd',4);

    $('#myModaladd').modal('show');
}

function addValidate(){
    $("#myModaladd").find("label .error").text('');
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

    //组装数据
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
    //校验数据
    for(var n in idArr){
        if(!$('#'+idArr[n]).valid()){
            validate = false;
        }
    }
    var startIpAdds = document.getElementsByName('startIpAdd');
    var endIpAdds = document.getElementsByName('endIpAdd');
    for(var m=0;m<startIpAdds.length;m++){
        if(startIpAdds[m].value==""  || endIpAdds[m].value==""){
            $("label[name='ip_error']").eq(m).text("请输入正确IP地址段");
            validate = false;
        }
    }
    for(var ob3 in objArr){
        if(objArr[ob3].areaCode == undefined || objArr[ob3].areaCode==""){
            $("label[name='areaCode_error']").eq(objArr[ob3].outIndex).text("请选择隶属单位地市码");
            validate = false;
        }else{
            objArr[ob3].createUserId = userInfo.userId;
            objArr[ob3].updateUserId = userInfo.userId;
            if(userInfo.userAreaCode!=null){
                objArr[ob3].cityCodeList = userInfo.userAreaCode.split(",");
            }
        }
    }
    if(!validate){
        return validate;
    }

    $.ajax({
        url: '/serviceapi/pre/house/ipSegment/validate',
        type: 'POST',
        contentType: 'application/json',
        data:JSON.stringify(objArr),
        async:false,
        dataType: 'json',
        success: function(data){
            var map=data.errorsArgsMap;
            if(jQuery.isEmptyObject(map)){
                validate = true;
                ipSegList = objArr;
            }else{
                for (var attr in map) {
                    var error_id = attr+'_error';
                    if(attr=='startIp:endIp'){
                        $("label[name='ip_error']").eq(data.innerIndex).text(map[attr]);
                    }else{
                        $("label[name='"+error_id+"']").eq(data.outIndex).text(map[attr]);
                    }

                }
                validate = false;
            }
        }
    });
    return validate;
}

function beforeUpdate(id){
    //loadSelectHouse('houseId_edit');
    var data = $('#infotable').bootstrapTable('getRowByUniqueId', id);
    var inputs = $('#editForm').find('input[class="form-control"],input[class="form-control valid"]');
    var textIDArray = new Array();
    for(var i=0;i<inputs.size();i++){
        textIDArray[i] = inputs[i].name;
    }
    setFormdata(textIDArray, data, $('#editForm'));
    $('#editForm').find("input[name=frameId]").val(data.frameId);
    //$('#editForm').find("select[name=houseId]").val(data.houseId);
    $('#editForm').find("select[name=distribution]").val(data.distribution);
    $('#editForm').find("select[name=occupancy]").val(data.occupancy);
    $('#editForm').find("select[name=useType]").val(data.useType);
    $('#editForm').find("select[name=ipType]").val(data.ipType);

    var userInfo = icom.auth.getUserInfo();
    $('#editForm').find("input[name=updateUserId]").val(userInfo.userId);
}

function deleteFun(id){
    var ids = [];
    if (typeof(id) == "undefined") {
        var rows= $("#infotable").bootstrapTable('getSelections');
        if (rows.length > 0) {
            for ( var i = 0; i < rows.length; i++) {
                ids.push(rows[i].ipSegId);
            }
        }else{
            swal({title: "请选择要删除的记录",type: "error"});
            return;
        }
    }else{
        ids.push(id);
    }
    var idstr=ids.join(',');

    swal({
        title: "请确认是否删除IP信息？",
        type: "success",
        showCancelButton: true,
        confirmButtonText: "确定",
        closeOnConfirm: true
    }, function (isConfirm) {
        if (isConfirm) {
            $.ajax({
                url:'/serviceapi/pre/house/ipSegment/delete',
                type:"post",
                dataType: 'json',
                data: {'ids' : idstr},
                success:function(result){
                    if(result.resultCode == 0 || result.resultCode == 2){
                        $("#infotable").bootstrapTable('refresh');
                    }else{
                        swal({title: "删除失败",type: "error"})
                    }
                }
            });
        }
    })
}


function loadSelectHouse(id){
    var sel_house = icom.rsel.createRichSelect(id,{
        language: "zh-CN", //提示语言
        width:'100%',
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
                console.log(data,params);
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
    sel_house.render();

}
