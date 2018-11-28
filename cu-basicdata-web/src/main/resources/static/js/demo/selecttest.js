$(document).ready(function() {

    let da = icom.tpick.createDatePick();
    da.initDoubleDate("start","end",1);
    da.initSingleDate("dateId",1);
    icom.asel.createAreaSelect("one","two","three",null,null,null);
    console.log(icom.auth.getUserInfo());

    let sel_house = icom.rsel.createRichSelect("sel_house",{

        language: "zh-CN", //提示语言
        width:'20%',
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

    let sel_user = icom.rsel.createRichSelect("sel_user",{

        language: "zh-CN", //提示语言
        width:'20%',
        minimumInputLength: 0,//最小需要输入多少个字符才进行查询,或者不写
        placeholder:"请选择",
        allowClear:true,//重新加载是否清空
        //maximumSelectionLength: 3, //最多选择个数
        ajax: {
            url: '/getUserSelectInfo',
            data: function (params) {
                var query = {
                    unitName: params.term  //插件固定参数 term:输入框的值, _type:"query"
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
    sel_user.render();

    //
	let doms = icom.rsel.createRichSelect("sel_menu1",{

        language: "zh-CN", //提示语言
        width:'20%',
        minimumInputLength: 0,//最小需要输入多少个字符才进行查询,或者不写
        placeholder:"请选择",
        allowClear:true,//重新加载是否清空
        //maximumSelectionLength: 3, //最多选择个数
    });
    doms.render();

	$("#sel_menu1").on("select2:select",function(e){
		console.log(e.params.data);
		$('#value1').append("<a onclick=resetValue("+e.params.data.id+")>"+e.params.data.text+"</a><br>");
	})

    cselect.initSelectCommon("houseMainArea","/common/getSubOrdArea",null);
    let doms2 = icom.rsel.createRichSelect("sel_menu2");
    doms2.render();

	
	$("#sel_menu2").on("select2:select",function(e,data){
　　	console.log(e.params.data);
	})

    var  doms3 = icom.rsel.createRichSelect("sel_menu3",null,{url:'static/js/demo/select.json',data:{test:"test"}});
    doms3.render();

    $("#sel_menu3").on("select2:select",function(e,data){
　　	console.log(e.params.data);
		$('#value3').append("<a onclick=appendValue("+e.params.data.id+")>"+e.params.data.text+"</a><br>");
		})

	});
function appendValue(value) {
    let doms3 = icom.rsel.createRichSelect("sel_menu3");
    doms3.appendValue(value);
};
function resetValue(value) {
    let doms = icom.rsel.createRichSelect("sel_menu1");
    doms.resetValue(value);
};
	



