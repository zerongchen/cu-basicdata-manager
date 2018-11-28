
//more api https://select2.org/configuration/options-api
cselect={
	
	initSelect:function(sessionid,config){
		let session = $("#"+sessionid);
		let defaultConfig = {
				language: "zh-CN", //提示语言
				minimumInputLength: 0,//最小需要输入多少个字符才进行查询,或者不写
				placeholder:"请选择",
				allowClear:true,//是否允许清空
            	closeOnSelect: false,
				//maximumSelectionLength: 300, //最多选择个数
			};
		let cof ;
		
		if(config != undefined && config!=null ){
			if(config.language!=undefined) {defaultConfig.language=config.language ; delete config.language}
			if(config.minimumInputLength!=undefined) {defaultConfig.minimumInputLength=config.minimumInputLength;delete config.minimumInputLength}
			if(config.placeholder!=undefined) {defaultConfig.placeholder=config.placeholder;delete config.placeholder}
			if(config.allowClear!=undefined) {defaultConfig.allowClear=config.allowClear;delete config.placeholder}
			if(config.maximumSelectionLength!=undefined) {defaultConfig.maximumSelectionLength=config.maximumSelectionLength;delete config.maximumSelectionLength}

            cof = $.extend(config,defaultConfig);
		}else{
            cof = defaultConfig;
        }
        session.select2(cof);
        session.change(function(){
            var ele = $(this);
            if(ele.val().length==cof.maximumSelectionLength)
            {
                ele.select2('close');
            }
        });

	},
	
	initSelectDynamic:function(sessionid,config,param){
		let $selId = $("#"+sessionid);
		let option='';
		$.ajax({
        url: param.url,
        type: 'GET',
        //data:param.data,
        dataType: 'json',
        success: function(data){
            $selId.children().remove();
            $.each(data, function(i, n){
                    option += '<option value="' + n.value + '">' + n.title + '</option>';
            });
            $selId.append(option);
			cselect.initSelect(sessionid,config);
        },
		error:function(){
			$selId.select2();
		}
    });
	},
	resetValue:function(session,value){
		let $session = $("#"+session);
		if (value instanceof Array){
			$session.val(array).trigger('change');
		}else{
			let array = new Array();
			array.push(value);
			$session.val(array).trigger('change');
		}
	},
	appendValue:function(session,value){
		let $session = $("#"+session);
		let array = $session.select2("val");
		if(array==null){
			array=new Array();
		}
		array.push(value+"");
		$session.val(array).trigger('change');
	},
    /**
     *
     * @param type
     * @param id
     * @param value
     * @param flag 1-个人证件号码 2-单位证件号码 3-专线 4-非专线
     */
    initSelectJcdm:function(type,id,value,flag){
        var dataList = jcdmCode.getData();
        var resultList = [];
        switch (type)
		{
			case "jfxz":
				resultList = dataList.jfxzArr;
				break;
			case "zjlx":
			    if(flag==1){
			        for(var n in dataList.zjlxArr){
			            if(dataList.zjlxArr[n].id==2 || dataList.zjlxArr[n].id==7
                            || dataList.zjlxArr[n].id==9 || dataList.zjlxArr[n].id==8){
                            resultList.push( dataList.zjlxArr[n]);
                        }
                    }
                }else{
                    resultList = dataList.zjlxArr;
                }
                break;
            case "dwsx":
                resultList = dataList.dwsxArr;
                break;
            case "jrfs":
                resultList = dataList.jrfsArr;
                break;
            case "wzbalx":
                resultList = dataList.wzbalxArr;
                break;
            case "fwnr":
                resultList = dataList.fwnrArr;
                break;
            case "balx":
                resultList = dataList.balxArr;
                break;
            case "ipdzsyfs":
                if(flag==3){
                    for(var n in dataList.ipdzsyfsArr){
                        if(dataList.ipdzsyfsArr[n].id==3 || dataList.ipdzsyfsArr[n].id==2){
                            resultList.push( dataList.ipdzsyfsArr[n]);
                        }
                    }
                }else{
                    for(var n in dataList.ipdzsyfsArr){
                        if(dataList.ipdzsyfsArr[n].id!=3){
                            resultList.push( dataList.ipdzsyfsArr[n]);
                        }
                    }
                }
                break;
		}
        let $selId = $("#"+id);
        let option='<option value="">请选择 </option>';
        $.each(resultList, function(i, n){
        	if(value==null){
                option += '<option value="' + n.id + '">' + n.mc + '</option>';
			}else{
        		if(n.id==value){
                    option += '<option value="' + n.id + '" selected="selected">' + n.mc + '</option>';
				}else{
                    option += '<option value="' + n.id + '">' + n.mc + '</option>';
				}
			}

        });
        $selId.children().remove();
        $selId.append(option);
    },
    initFunrJcdm:function(id){
        var dataList = jcdmCode.getData();
        var resultList = dataList.fwnrArr;
        let $selId = $("#"+id);
        let liHtml="";
        $.each(resultList, function(i, n){

            liHtml += '<li value="'+n.id+'"><a >'+ n.mc +'</a></li>';

        });
        $selId.children().remove();
        $selId.append(liHtml);
    },
    /**
     *
     * @param selId
     * @param url
     * @param val
     * @param num
     * @param type 下拉框的样式，默认是没有附加搜索框的,要出现搜索框需要添加”请选择“按钮,此时type=1
     * @param chooseId 对选择的进行过滤展示
     */
    initSelectCommon:function(selId, url, val, num,type,chooseIds){
    $.ajax({
        url: url,
        type: 'GET',
        async: false,
        dataType: 'json',
        success: function(data){
            var data = eval(data);
            var $selId = $('#' + selId),
                option = '';
            if (type==1){
                option = '<option value="">请选择</option>';
            }
            $.each(data, function (i,n) {
            	if(chooseIds!=null && chooseIds!=""){
            		for(var j=0;j<chooseIds.length;++j){
            			if(chooseIds[j]==n.value){
            				if(val!=null && val!=""){
                                if(val==n.value){
                                    option += '<option value="' + n.value + '" selected="selected">' + n.title + '</option>';
                                }else{
                                    option += '<option value="' + n.value + '">' + n.title + '</option>';
                                }
                            }else{
                                option += '<option value="' + n.value + '">' + n.title + '</option>';
                            }
            			}
            		}
            	}else{
            		if(val!=null && val!=""){
                        var isFlag = false;
                        for(var m in val){
                            if(val[m]==n.value){
                                isFlag =true;
                                break;
                            }
                        }
                        if(isFlag){
                            option += '<option value="' + n.value + '" selected="selected">' + n.title + '</option>';
                        }else{
                            option += '<option value="' + n.value + '">' + n.title + '</option>';
                        }
                    }else{
                        option += '<option value="' + n.value + '">' + n.title + '</option>';
                    }
            	}
            });
            $selId.empty();
            
            if(val==null || val==""){
                $selId.val("");
                $selId.trigger("chosen:updated");
            }

            $selId.children().remove();
            $selId.append(option);
            var config = {
                disable_search_threshold: 10,
                no_results_text: '',
                width: '100%',
                placeholder_text_multiple:'请选择',
                search_contains: true,
            };
            if(num!=null && num>0){
                config.max_selected_options = num;
            }
            $selId.chosen(config);
        }
    });
},
    //单选初始化
    initSelectSingle:function(selId, url, val,chooseIds){
        $.ajax({
            url: url,
            type: 'GET',
            async: false,
            dataType: 'json',
            success: function(data){
                var data = eval(data);
                var $selId = $('#' + selId),
                    option = '<option value="">请选择</option>';
                $.each(data, function (i,n) {
                	if(chooseIds!=null && chooseIds!=""){
                		for(var j=0;j<chooseIds.length;++j){
                			if(chooseIds[j]==n.value){
                				if(val!=null && val!=""){
                                    if(val==n.value){
                                        option += '<option value="' + n.value + '" selected="selected">' + n.title + '</option>';
                                    }else{
                                        option += '<option value="' + n.value + '">' + n.title + '</option>';
                                    }
                                }else{
                                    option += '<option value="' + n.value + '">' + n.title + '</option>';
                                }
                			}
                		}
                	}else{
                		if(val!=null && val!=""){
                            if(val==n.value){
                                option += '<option value="' + n.value + '" selected="selected">' + n.title + '</option>';
                            }else{
                                option += '<option value="' + n.value + '">' + n.title + '</option>';
                            }
                        }else{
                            option += '<option value="' + n.value + '">' + n.title + '</option>';
                        }
                	}

                });
                $selId.children().remove();
                $selId.append(option);
            }
        });
    },
    /**
     * 机房主体信息页面新增，隶属地址码初始化
     * @param selId  标签ID
     * @param val 选中值
     * @param flag  默认全选,1-选中val,2-val的值在mainAreaCodes中选中
     * @param houseId 机房ID
     * @param userId 用户ID
     * @param mainAreaCodes
     * @param type type=1 出现搜索框,并追加“请选择”
     * @num 下拉框最多能选择数量
     */
    initAreaCode:function(selId, val, flag,houseId,userId,mainAreaCodes,num,type){
        var areaCode = "";
        if(flag==2){
            areaCode = mainAreaCodes.join(",");
        }else{
            areaCode = icom.auth.getUserInfo().userAreaCode;
        }
        var query = {};
        query.areaCodes = areaCode;
        if(houseId!=undefined && houseId!=null &&  houseId!=''){
            query.houseId = houseId;
        }
        if(userId!=undefined && userId!=null &&  userId!=''){
            query.userId = userId;
        }

        $.ajax({
            url: '/common/getSubOrdAreaCode',
            type: 'POST',
            data:JSON.stringify(query),
            contentType: 'application/json',
            async: true,
            dataType: 'json',
            success: function(data){
                var data = eval(data);
                var $selId = $('#' + selId),
                    option = '';
                if (type==1){
                    option = '<option value="">请选择</option>';
                }
                if(data!=null){
                    $.each(data, function (i,n) {
                        if(flag==1){
                            if(val!=null && val!=""){
                                var isFlag = false;
                                for(var m in val){
                                    if(val[m]==n.value){
                                        isFlag =true;
                                        break;
                                    }
                                }
                                if(isFlag){
                                    option += '<option value="' + n.value + '" selected="selected">' + n.title + '</option>';
                                }else{
                                    option += '<option value="' + n.value + '">' + n.title + '</option>';
                                }
                            }else{
                                option += '<option value="' + n.value + '">' + n.title + '</option>';
                            }
                        }else{
                            option += '<option value="' + n.value + '" selected="selected">' + n.title + '</option>';
                        }

                    });
                }
                $selId.empty();
                $selId.trigger("chosen:updated");
                $selId.children().remove();
                $selId.append(option);
                var config = {
                    disable_search_threshold: 10,
                    no_results_text: '',
                    width: '100%',
                    placeholder_text_multiple:'请选择',
                    search_contains: true,
                };
                if(num!=null && num>0){
                    config.max_selected_options = num;
                }
                $selId.chosen(config);
            }})
    },
    initSingleAreaCode:function (selId, mainAreaCodes) {

        let areaCode = mainAreaCodes.join(",");
        let query = {};
        query.areaCodes = areaCode;
        $.ajax({
            url: '/common/getSubOrdAreaCode',
            type: 'POST',
            data:JSON.stringify(query),
            contentType: 'application/json',
            async: true,
            dataType: 'json',
            success: function(data){
                var data = eval(data);
                var $selId = $('#' + selId),
                    option = '';
                if(data!=null){
                    option += '<option value="">请选择</option>';
                    $.each(data, function (i,n) {
                        option += '<option value="' + n.value + '">' + n.title + '</option>';
                    });
                }
                $selId.children().remove();
                $selId.append(option);
            }})
    },
    //隶属地市码单选使用
    singleSelect:function(id,key,val) {
        var htmls = "";
        if (key != null || key.length > 0) {
            for (var i = 0; i < key.length; i++) {
                htmls += '<option value="' + key[i] + '">' + val[i].text + '</option>';
            }
        }
        $("#" + id).empty();
        $("#" + id).trigger("chosen:updated");
        $("#" + id).children().remove();
        $("#" + id).append(htmls);
        var config = {
            disable_search_threshold: 10,
            no_results_text: '',
            width: '100%',
            placeholder_text_multiple:'请选择',
            search_contains: true,
            max_selected_options:1
        };
        $("#" + id).chosen(config);
    },
    //用户携带地市码信息下拉框
    loadUserSubAreaCode:function(divId){
        var $divId = $('#'+divId);
        var url ='/getUserSubAreaCode';
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: url,
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            //data: '',
            success: function (result) {
                var option ="";
                option += "<option value=''>请选择</option>";
                $.each(result,function(i,n){
                    option += '<option value="' + n.value + '">' + n.title + '</option>';
                });
                $divId.empty();
                $divId.trigger("chosen:updated");
                $divId.children().remove();
                $divId.append(option);
                var config={
                    disable_search_threshold: 2,
                    no_results_text: '',
                    width: '100%',
                    search_contains: true
                };
                $divId.chosen(config);
            }});
    },
    //后台模糊匹配用户下拉框
    initUserNames:function(url,divId){
    var unitName_sel = icom.rsel.createRichSelect(divId,{
        language: "zh-CN", //提示语言
        width:'100%',
        minimumInputLength: 0,//最小需要输入多少个字符才进行查询,或者不写
        placeholder:"请选择",
        allowClear:true,//重新加载是否清空
        maximumSelectionLength: 1, //最多选择个数
        ajax: {
            url: url,
            data: function (params) {
                var query = {
                    unitName: params.term  //插件固定参数 term:输入框的值, _type:"query"
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
    unitName_sel.render();
}
};

