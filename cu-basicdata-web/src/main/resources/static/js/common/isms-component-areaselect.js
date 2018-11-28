/**
 * Isms 公共组件对象定义-地市码联动框
 * @author tanzj
 */

// 工具入口定义
icom.asel = {
    createAreaSelect: function(firstId,secondId,thridId,flag,firstData,secondData,thridData,isHouse){
        return new icom.AreaSelect().initSelects(firstId,secondId,thridId,flag,firstData,secondData,thridData,isHouse);
    }
};

IsmsComponent.prototype.AreaSelect = function(){
    this._init_();
}
IsmsComponent.prototype.AreaSelect.prototype = {
    _init_ : function() {
    },
    demo : function(){
        alert("AreaSelect function demo");
    },
    //下拉框生成
    selectInit:function(data,id,selectedData,flag,parentCode,thirdId,formFlag,isHouse){
        var areaList = [];
        if(flag==1){
            areaList = data.provinceArr;
        }else if(flag==2 && parentCode!=null && parentCode!=''){
            $.each(data.cityArr,function (i,n) {
                if(parentCode==n.parentCode) {
                    areaList.push(n);
                }
            });
        }else if(flag==3 && parentCode!=null && parentCode!=''){
            $.each(data.countyArr,function (i,n) {
                if(parentCode==n.parentCode) {
                    areaList.push(n);
                }
            });
        }
        var commonHtml = '<option value="">请选择 </option>';
        if(flag==2 && parentCode!=null && parentCode!='' && areaList.length<=0){
            $('#'+id).children().remove();
            if(formFlag==1){
                $('#'+id).parent().hide();
            }
            $('#'+id).hide();
            IsmsComponent.prototype.AreaSelect.prototype.selectInit(data,thirdId,selectedData,3,parentCode,null,formFlag);
        }else if(flag==3 && parentCode!=null && parentCode!='' && areaList.length<=0){
            $('#'+id).children().remove();
            if(formFlag==1){
                $('#'+id).parent().hide();
            }
            $('#'+id).hide();
        }else {
            if(flag==2){
                $('#'+thirdId).children().remove();
                $('#'+thirdId).append('<option value="">请选择 </option>');
            }
            if(formFlag==1){
                $('#'+id).parent().show();
            }
            $('#'+id).show();
            if(areaList==null || areaList.length<=0){
                $('#'+id).children().remove();
                $('#'+id).append(commonHtml);
            }else{
                if(flag==1 && isHouse==1){
                    $.each(areaList,function(i,n){
                        if(n.flag == 1 ){
                            commonHtml += '<option selected="selected" value="' + n.code + '">' + n.mc+ '</option>';
                        }else {
                            commonHtml += '<option value="' + n.code + '">' + n.mc + '</option>';
                        }
                    })
                }else {
                    $.each(areaList,function(i,n){
                        if(selectedData!=null && selectedData == n.code){
                            commonHtml += '<option selected="selected" value="' + n.code + '">' + n.mc+ '</option>';
                        }else {
                            commonHtml += '<option value="' + n.code + '">' + n.mc + '</option>';
                        }
                    })
                }

                $('#'+id).children().remove();
                $('#'+id).append(commonHtml);
            }
        }

    },
    /**
     * 初始化
     * @param firstId 一级区域下拉框id
     * @param secondId 二级区域下拉框id
     * @param thridId 三级区域下拉框id
     * @param firstData 一级区域下拉框选中值（没有则为null）
     * @param secondData 二级区域下拉框选中值（没有则为null）
     * @param thridData 三级区域下拉框选中值（没有则为null）
     * @param flag 表单中---1   查询中---2
     * @param isHouse 1--机房
     */
    initSelects:function(firstId,secondId,thridId,flag,firstData,secondData,thridData,isHouse){
        var data = areaCode.getData();
        this.selectInit(data,firstId,firstData,1,"","","",isHouse);
        if(isHouse==1){
            var province = $("#"+firstId).val();
            if(province!=undefined && province!=""){
                this.selectInit(data,secondId,secondData,2,province,thridId,flag);
            }else{
                this.selectInit(data,secondId,secondData,2,firstData,null,flag);
            }
            $("#"+firstId).attr("disabled","disabled");
        }else{
            this.selectInit(data,secondId,secondData,2,firstData,null,flag);
        }
        //
        if(isHouse==1){
            var twoLevel = false;
            pro:
            for(var i in data.provinceArr){
                if(data.provinceArr[i].flag == 1){
                    city:
                    for(var n in data.cityArr){
                        if(data.cityArr[n].parentCode == data.provinceArr[i].code){
                            twoLevel = true;
                            break pro;
                        }
                    }
                }
            }
            if(twoLevel){
                this.selectInit(data,thridId,thridData,3,secondData);
            }
        }else{
            this.selectInit(data,thridId,thridData,3,secondData);
        }
        //绑定事件
        $('#'+firstId).change(function(){
            IsmsComponent.prototype.AreaSelect.prototype.selectInit(data,secondId,"",2,$('#'+firstId).val(),thridId,flag);
        });
        $('#'+secondId).change(function(){
            IsmsComponent.prototype.AreaSelect.prototype.selectInit(data,thridId,"",3,$('#'+secondId).val(),null,flag);
        });
    }
}
