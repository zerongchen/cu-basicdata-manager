var treeJSON ;
var treeData;
var checkNode;
var searchCode = '';
var zTree;
var stepValue = 0;
$(function(){

	onloadSourZTree();
	onloadProvince();
	icom.asel.createAreaSelect("one","addCity","addCounty",1,null,null,null);
    $("#areaCodetable").bootstrapTable('destroy').bootstrapTable({
        method: 'post',
        url: '/areaCode/listAreaCode',
        queryParams : function (params) {
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {   
            	pageSize: params.limit,                         //页面大小
            	pageIndex: (params.offset / params.limit) + 1,   //页码
                sort: params.sort,      //排序列名  
                sortOrder: params.order, //排位命令（desc，asc） 
                code:$('#sel_code').val(),
                mc:$('#sel_mc').val(),
                areaCode:$('#sel_areaCode').val(),
                postCode:$('#sel_postCode').val()
            };
            return temp;
        },
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
        clickToSelect:false,
        showPaginationSwitch:false,
        pageSize: 10,
        pageList: [10, 15, 50, 100, 200],
        uniqueId:'id',
        columns: [
            {field: 'check',title: 'title',checkbox:true},
            {field: 'id',title: 'id',width:'50px',visible:false},
            {field: 'mc',title: '区域名称',width:'120px'},
            {field: 'code',title: '区域编码',width:'120px'},
            {field: 'postCode',title: '邮编',width:'120px'},
            {field: 'parentCode',title: '父级区域编码',width:'120px',visible:false},
            {field: 'codeLevel',title: '地市层级',width:'50px',visible:false},
            {field: 'operating',title: '操作',width:'130px',formatter: operateFormatter}
        ]
    });
    $('#houseIndexSearch').click(function(){
    	$("#areaCodetable").bootstrapTable("refresh",{url: '/areaCode/listAreaCode' });
    });
    
    $("#inserButton").on("click",function(){
    	$("#addForm0").find("label.error").text('');
		if(checkNode==undefined||checkNode==null){
			swal({title: "区域管理处请勾选省或市级地市再新增！",type: "warning"})
		}else{
			if(checkNode.codeLevel==1||checkNode.codeLevel==2){
				$("#areaChoose").html("已选择区域:"+checkNode.name);
			}else{
				swal({title: "区域管理处请勾选省或市级地市再新增！",type: "warning"})
			}
		}
    });
    
    //新增
    $('#btnAdd').on('click',function(e){
        e.preventDefault();
        var data;
        var jsonStr="";
        var flag = true;
        for(var i =0;i<=stepValue;++i){
        	if($("#addForm"+i).length>0){
        		data = decodeURIComponent($("#addForm"+i).serialize(),true);
        		if(i==stepValue){
        			jsonStr = jsonStr + data;
        		}else{
        			jsonStr = jsonStr + data+",";
        		}
            	var valid=$("#addForm"+i).validate().form();
            	if(valid==false){
            		flag = false;
            	}
            	var validateFlag = AjaxValidator.isValid("addForm"+i, '/areaCode/validate');
            	if(valid==false||validateFlag==null||validateFlag==false){
            		flag = false;
            	}
        	}
        }
        if(flag){
        	 $.ajax({
                 type: 'POST',
                 dataType: 'json',
                 url: '/areaCode/insert',
                 contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                 data: {"params":jsonStr},
                 success : function(result){
                	 if(result.resultCode==3){
                		 swal({
                 	        title: "录入数据错误！",
                 	        text: result.resultMsg,
                 	        type: "error",
                 	    });
                	 }else if(result.resultCode==1){
                     	swal({title: "新增失败",type: "error"})
                     }else{
                     	swal({
                             title: "新增成功",
                             type: "success",
                             showCancelButton: false,
                             confirmButtonText: "确定",
                             closeOnConfirm: true
                         }, function(isConfirm) {
                             if(isConfirm) {
                                 window.location.href = '/areaCode/index';
                             }
                         })
                     }
                 }
             });
        }

    });
   //批量删除
    $("#allDelte").click(function(){
    	var rows =$("#areaCodetable").bootstrapTable('getSelections');
    	if(rows.length==0){
    		swal({title: "请勾选需要删除的数据",type: "warning"})
    		//alert("请勾选需要删除的数据");
    	}else{
    		swal({
                title: "确定批量删除这"+rows.length+"条信息吗?",
                text: "删除后将无法恢复，请谨慎操作！",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "是的，我要删除！",
                cancelButtonText: "取消",
                closeOnConfirm: true,
                closeOnCancel: false
            }, function(isConfirm) {
            	if(isConfirm){
            		var ids="";
            		for(var i=0;i<rows.length;i++){
            			if(i<rows.length-1){
            				ids = ids + rows[i].id + ",";
            			}else{
            				ids = ids + rows[i].id;
            			}
            			
            		}
            		delFunction(ids);
            	}else{
            		swal("已取消", "取消了批量删除操作！", "error")
            	}
            	
            });
    	}
    }
    );

    $("#setCancel").on("click",function(){
    	$("#provinceSetDiv").hide();
    });
    $("#btnSet").on("click",function(){
    	var data = $("#one").val();
    	if(data==null||data==0){
    		swal({title: "请选择部署省份",type: "warning"})
    		return ;
    	}
    	$.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/areaCode/setPronvice',
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            data: {"code":data},
            success: function (result) {
                if (result == true) {
                    swal({
                        title: "设置成功",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonText: "确定",
                        closeOnConfirm: true
                    }, function (isConfirm) {
                    	$("#provinceSetDiv").hide();
                    })
                    
                } else {
                    swal({title: "设置失败",type: "error"})
                }

            }
        });
    });
    
    $('#btnEdit').on('click',function(e){
        e.preventDefault();
        $("#editForm").find("label.error").text('');
        var valid=$("#editForm").validate().form();
        if(valid) {
            var validateFlag = AjaxValidator.isValid("editForm", '/areaCode/validate');
        	if (validateFlag) {
                var data = $('#editForm').serialize();
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/areaCode/update',
                    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                    data: data,
                    success: function (result) {
                        if (result.resultCode == 0) {
                            swal({
                                title: "修改成功",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonText: "确定",
                                closeOnConfirm: true
                            }, function (isConfirm) {
                                if (isConfirm) {
                                    window.location.href = '/areaCode/index';
                                }
                            })
                        } else {
                            swal({title: "保存失败",type: "error"})
                        }

                    }
                });
            }
        }
    });

    //新增取消
    $('#btnCancel').on('click',function(e){
    	$("form").find("input").val('');
    	//$("form").not("#addForm0").parent().parent().parent().parent().parent().remove();
        $("#addForm input,select").each(function(){
            $(this).val('');
        });
    });

    $('#btnCancelEdit').on('click',function(e){
        $("#editForm input,select").each(function(){
            $(this).val('');
        });
    });
    $("#addFormTitle").click(function () {
    	var addTitleHTML=$(this).parent().parent().parent().clone();
    	stepValue= stepValue+1;
        var id = addTitleHTML.find(".selectpicker").attr('id');
        addTitleHTML.find("a").removeClass("addTitle").addClass("removeTitleContent").html("<i class=\'fa fa-minus\' name='delBtn'></i> 删除");
    	addTitleHTML.find("form").attr("id","addForm"+stepValue);
    	addTitleHTML.find("input").val('');
    	addTitleHTML.find("label.error").text('');
    	$("#bottomDIv").before(addTitleHTML);
    	addTitleHTML.find("i[name='delBtn']").parent().css("cursor","pointer").on('click',function(){
    		$(this).parent().parent().parent().remove();
    		//stepValue = stepValue-1;
    	});
    	addTitleHTML.find("input").val('');
    	addTitleHTML.find("label.error").text('');
    	addTitleHTML.find("input[name='parentCode']").val(checkNode.id);
    	addTitleHTML.find("input[name='codeLevel']").val(checkNode.codeLevel-1);
    });	

    
});

function onloadProvince(){
	$.ajax({
        url:'/common/getAreaCode',
        type:"post",
        dataType: 'json',
        success:function(result){
        	var num=1;
        	$.each(result.provinceArr,function(i,val){
        		if(val.build!=null&&val.build==1){
        			$("#provinceAdd").append('<li name="showCode" value="'+val.code+'"><a >'+val.mc+'</a> </li>');
            		if(num%3==0){
            			$("#provinceAdd").append('<li class="divider"></li>');
            		}
            		if(val.flag==1){
            			$("#provinceButton").text("部署省份设置("+val.mc+")");
            		}
            		num++;
        		}
        	});
        	$("li[name='showCode']").on("click",function(){
        		$("#provinceButton").text("部署省份设置("+$(this).text()+")");
        		$.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/areaCode/setPronvice',
                    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                    data: {"code":$(this).val()},
                    success: function (result) {
                        /*if (result == true) {
                            swal({
                                title: "设置成功",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonText: "确定",
                                closeOnConfirm: true
                            })
                        } else {
                            swal({title: "设置失败",type: "error"})
                        }*/
                    }
                });
            });
        }
	});
}


function beforeUpdate(id){
	$("#editForm").find("label.error").text('');
    var data = $('#areaCodetable').bootstrapTable('getRowByUniqueId', id);
    var inputs = $('#editForm').find('input[class="form-control"]');
    var textIDArray = new Array();
    for(var i=0;i<inputs.size();i++){
        textIDArray[i] = inputs[i].name;
    }
    setFormdata(textIDArray, data, $('#editForm'));
    $('#editForm').find("input[name=id]").val(data.id);
    $('#editForm').find("input[name=code]").val(data.code);
    $('#editForm').find("input[name=mc]").val(data.mc);
    $('#editForm').find("input[name=postCode]").val(data.postCode);
    $('#editForm').find("input[name=parentCode]").val(data.parentCode);

}



function deleteFun(id){
	swal({
        title: "确定要删除这条信息吗",
        text: "删除后将无法恢复，请谨慎操作！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是的，我要删除！",
        cancelButtonText: "让我再考虑一下…",
        closeOnConfirm: true,
        closeOnCancel: false
    }, function(isConfirm) {
    	if(isConfirm){
    		delFunction(id);
    	}else{
    		swal("已取消", "取消了删除操作！", "error")
    	}
    });
	
}
function delFunction(id){
	$.ajax({
        url:'/areaCode/delete',
        type:"post",
        dataType: 'json',
        data: {'ids' : id},
        success:function(result){
        	if(result.resultCode == 1){
                swal({
                    title: "删除失败！",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                })
            }else{
                swal({
                    title: "删除成功！",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                })
            }
        	$("#areaCodetable").bootstrapTable('refresh');
        }
       
    });
}

//加载来源ztree
function onloadSourZTree(){
  $.ajax( {
    async : true, //是否异步
    cache : false, //是否使用缓存
    type : 'post', //请求方式,post
    dataType : "json", //数据传输格式
    url : "/areaCode/getAreaTree", //请求链接,
    data:{"codeLevel":1},
    success : function(data) {
	 var setting = {
		  view: {
		    dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
		    showLine: true,//是否显示节点之间的连线
		    fontCss:{'color':'black','font-weight':'bold'},//字体样式函数
		    selectedMulti: false //设置是否允许同时选中多个节点
		  },
		  check:{
		    chkboxType: { "Y": "", "N": "" },//设置父节点和子节点不级联勾选
		    chkStyle: "checkbox",//复选框类型
		    enable: true //每个节点上是否显示 CheckBox 
		  },
		  data: {
		    simpleData: {//简单数据模式
		      enable:true,
		      idKey: "id",
		      pIdKey: "pId",
		      rootPId: ""
		    }
		  },
		  callback: {
		    beforeClick: function(treeId, treeNode) {
		      checkNode = treeNode;
			  $("#chooseAreaName").text("已选区域:"+treeNode.name);
		      if (treeNode.isParent) {
		      }else{
		        zTree.checkNode(treeNode, !treeNode.checked, true, true);//单击勾选，再次单击取消勾选
		      }
		    },
		    onClick: function(treeId, treeNode){
		    	if(checkNode.codeLevel==1||checkNode.codeLevel==2){//只有一二级可继续加载，并且加载完后点击不继续加载
		    		$("#areaChoose").attr("name",checkNode.id);
		    		$("#addForm0").find("input[name='parentCode']").val(checkNode.id);
		    		$("#addForm0").find("input[name='codeLevel']").val(parseInt(checkNode.level)+1);
		    		$("#inserButton").attr("data-target","#myModaladd");//恢复新增功能
		    		var nodeNum;
	    	    	for(var i=0;i<treeJSON.length;++i){
	    	    		if(treeJSON[i].id == checkNode.id){
	    	    			nodeNum =i;//记录勾选的节点下标
	    	    		}
	    	    	}
	    	    	if(searchCode.indexOf(checkNode.id)>=0){
	    	    	}else{
	    	    		searchCode+=checkNode.id;
	    	    		$.ajax( {
				    	    async : true, //是否异步
				    	    cache : false, //是否使用缓存
				    	    type : 'post', //请求方式,post
				    	    dataType : "json", //数据传输格式
				    	    url : "/areaCode/getAreaTree", //请求链接,
				    	    data:{"parentCode":checkNode.id},
				    	    success : function(data) {
				    	    	for(var i=0;i<data.length;++i){
				    	    		treeData[treeData.length]=data[i];
				    	    	}
				    	    	//如果本身没被选中，其他的节点也没有被选中，则选中
						    	var nodes = zTree.getCheckedNodes(true);
						    	if(data!=null&&data.length>0){
						    		$.fn.zTree.init($("#user_tree"), setting, eval( "["+treeData+"]" ));
						    		zTree.expandNode(zTree.getNodes()[0]);//全国节点默认只展开下一级子节点
							    	checkNode = zTree.getNodeByTId(checkNode.tId);//原来的选中节点checkNode不包含重新加载的子节点，故需重新获取
							    	zTree.expandNode(checkNode,true);//展开选中的子节点
							    	zTree.checkNode(checkNode,true);//因为树刚重新初始化，需让加载前选中的节点重新选中
							    	cancelCheckBoxType(zTree);
				    	    	}
				    	    }
				    	});
	    	    	}
		    	}else{
		    		$("#inserButton").attr("data-target","#myModaladdFobidden");//禁止新增功能
		    	}
		    	$("#areaCodetable").bootstrapTable("refresh",{url: '/areaCode/listAreaCode?parentCode='+ checkNode.id});
		    }
		  }
	  };
      ztreeSourNodes = eval( "["+data+"]" ); //将string类型转换成json对象
      treeJSON = ztreeSourNodes;
      treeData = data;
      $.fn.zTree.init($("#user_tree"), setting, ztreeSourNodes);
      zTree = $.fn.zTree.getZTreeObj("user_tree");       // 获取ztree对象
      cancelCheckBoxType(zTree);
      zTree.expandAll(true);
    },
    error : function() {
        alert('亲，网络有点不给力呀！');
      }
  });
}

/**
 * 取消树节点的复选框
 * @param ztree
 */
function cancelCheckBoxType(ztree){
	node = zTree.getNodes(),      //获取根节点
    nodes = zTree.transformToArray(node);    //遍历所有节点
    if(nodes.length>0){
     for(var i=0;i<nodes.length;i++){
  	   nodes[i].nocheck=true;
  	   zTree.updateNode(nodes[i]);
     }
    }
}

function operateFormatter(value, row, index){
    var op="";
    op+="<a data-toggle='modal' data-target='#myModaledit' onclick=\"beforeUpdate('"+row.id+"');\" title='修改' class='m-r'><i class='fa fa-edit fa-lg'></i></a>";
    op+="<a  class='m-r demo4' onclick=\"deleteFun('"+row.id+"');\"  title='删除'><i class='fa fa-close fa-lg'></i></a>" ;
    return op;
}
//获取叶子节点
function getAllChildrenNodes(treeNode,result){
    if (treeNode.isParent) {
      var childrenNodes = treeNode.children;
      if (childrenNodes) {
          for (var i = 0; i < childrenNodes.length; i++) {
              result += ',' + childrenNodes[i].id;
              result = getAllChildrenNodes(childrenNodes[i], result);
          }
      }
  }
  return result;
}