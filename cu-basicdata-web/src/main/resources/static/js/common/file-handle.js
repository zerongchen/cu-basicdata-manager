handleFile={

    exportTemplate:function(url){

        $('#exportTemplate').click(function () {
            $('#exportTem').remove();
            var form = '<form class="hide" id="exportTem">';
            form += '</form>';
            $('body').append(form);
            $('#exportTem').attr('action', url).attr('method', 'get').submit() ;return false;
        })

    },
    initClick:function () {
        $("#upLoad120").empty().append(" <input type=\"file\" id =\"importFile\" name=\"importFile\" accept=\".xls,.xlsm,.xlsx\" class=\"form-control\" required/>");
        $('input[type="file"]').prettyFile();
    },
    importFile:function (url,tableid) {

        var formData = $('#commonImportForm').formToJSON();

        var fileName=$('#commonImportForm').find('input[name="importFile"]').val();
        if(fileName=='' ||fileName==undefined){
            swal("请选择文件");
            return false;
        }
        $.ajaxFileUpload({
            url: url,
            secureuri: false,
            sync:false,
            contentType:'application/json',
            data: formData,
            fileElementId: 'importFile',
            dataType: "json",
            success: function (results) {
                if (results!=null && results.resultCode==0){
                    swal({
                        title: "操作成功",
                        text: "",
                        type: "success",
                    }, function(isConfirm) {
                        if(isConfirm) {
                            if(tableid!=null && tableid!=undefined && tableid!=''){
                                $("#"+tableid).bootstrapTable('refresh');
                            }
                            if (resetImportProcess instanceof Function ){
                                resetImportProcess();
                            }
                        }
                    })
                }else if (results!=null && results.resultCode==1){
                    swal(results.resultMsg);
                    resetImportProcess();
                }else {
                    swal("操作失败,请刷新页面重试");
                    resetImportProcess();
                }
            },
            error:function(data, status, e){
                swal("操作失败");
            },
            complete:function () {
                $("#upLoad120").empty().append(" <input type=\"file\" id =\"importFile\" name=\"importFile\" accept=\".xls,.xlsm,.xlsx\" class=\"form-control\" required/>");
                $('input[type="file"]').prettyFile();
            }

        })
    },
    /**
     * type:任务类型，1-经营者信息导入、2-机房信息导入、3-用户信息导入
     * @param url
     * @param type
     */
    getProcess:function (url,type) {

        var userInfo = icom.auth.getUserInfo();

        var process = $('#importProcess >div');
        $.ajax({
            url: url,
            type: 'post',
            sync:true,
            data:{"userId":userInfo.userId,"type":type},
            dataType: 'json',
            success: function(data){
                if (data!=null){
                    if (data.status==1){
                        process.attr("style","width: "+data.percent+";");
                        process.text(data.percent);
                        $('#errorFile').html("");
                        $('#lastImportStatus').val(1);
                        $('#errorFile').html("");
                        setTimeout(function(){handleFile.getProcess(url,type)},10000);

                    }else if(data.status==2){
                        process.attr("style","width: "+data.percent+";");
                        process.text(data.percent);
                        if (data.errorFileName==undefined||data.errorFileName==''){
                            $('#errorFile').html("导入成功");
                        } else {
                            $('#errorFile').html("<a>"+data.errorFileName+"</a>");
                        }
                        $('#lastImportStatus').val(2);
                    }else if (data.status==3){
                        process.attr("style","width: 0%;");
                        process.text("0%");
                        $('#errorFile').html("导入失败");
                        $('#lastImportStatus').val(3);
                    }else {
                        $('#lastImportStatus').val(3);
                        process.attr("style","width: 0%;");
                        process.text("0%");
                        $('#errorFile').html("");
                    }
                }
            },
            error:function(){

            }
        });
    },

    exportErrorFile:function (url) {
      $('#errorFile').click(function () {
          if ($('#lastImportStatus').val()==3){
              return;
          }
          var fileName = $(this).find("a").text();
          if (fileName==null || fileName=="" || fileName==undefined){
              return;
          }
          $('#exportErrorForm').remove();
          var form = '<form class="hide" id="exportErrorForm">';
          form += '<input type="hidden" name="errorFileName" value='+encodeURI(fileName)+'>';
          form += '</form>';
          $('body').append(form);
          $('#exportErrorForm').attr('action', url).attr('method', 'get').submit() ;return false;
      })
    },
    ready:function () {
    }
};
(function(){

})();