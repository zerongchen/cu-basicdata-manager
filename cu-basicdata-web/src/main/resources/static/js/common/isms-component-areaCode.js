/*$(function(){
	$("#houseId_add ").on("change",function(){
    	sel.loadAreaCodeSel("areaCodeAdd",$(this).val());
    });
    
    $("#houseId_edit #houseIdEdit").on("change",function(){
    	sel.loadAreaCodeSel("areaCodeEdit",$(this).val());
    });
})*/
var sel = {
		loadAreaCodeSel:function(divId,houseId,data,userId){
			var $divId = $('#'+divId);
			$divId.empty();
			var url ="";
			var sendData = "";
			if(userId==null){
				url = '/common/getAreaByHouseId';
				sendData = {"houseId":houseId};
			}else{
				url = '/common/getAreaByUserId';
				sendData = {"userId":userId};
			}
			var sendFlag = false;
			if(data!=undefined&&data!=null){
				sendFlag = true;
			}
			$divId.chosen("destroy").init();
			 $.ajax({
		         type: 'POST',
		         dataType: 'json',
		         url: url,
		         contentType: 'application/x-www-form-urlencoded; charset=utf-8',
		         data: sendData,
		         success: function (result) {
		        	 var option ="";
		        	 if(data!=undefined&&data!=null){
		    			 $.each(result,function(i,n){
		            		 option += '<option value="' + n.value + '">' + n.title + '</option>';
		            	 });
		    			 $divId.append(option);
		            	 $divId.find("option[value = '"+data+"']").attr("selected","selected");
		    		 }else{
		    			 option += "<option value=''>请选择</option>";
		    			 $.each(result,function(i,n){
		            		 option += '<option value="' + n.value + '">' + n.title + '</option>';
		            	 });
		    			 $divId.append(option);
		    		 }
		        	 var config={
		                 	disable_search_threshold: 2,
		                     no_results_text: '',
		                     width: '100%',
		                     search_contains: true
		                 };
		        	 $divId.chosen("destroy").init();
		        	 // if(edit > 1){
		 				$divId.chosen("destroy").init();
		 			// }
		        	 $divId.chosen(config);
		         }});
		},

    loadHouseSel:function(divId){
        var $divId = $('#'+divId);
        $divId.empty();
        var url ='/getHouseSelectInfo';
        $divId.chosen("destroy").init();
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
                $divId.append(option);
                var config={
                    disable_search_threshold: 2,
                    no_results_text: '',
                    width: '100%',
                    search_contains: true
                };
                $divId.chosen("destroy").init();
                $divId.chosen(config);
            }});
    },
    loadIDCHouseSel:function(divId){
        var $divId = $('#'+divId);
        $divId.empty();
        var url ='/getIDCHouseSelectInfo';
        $divId.chosen("destroy").init();
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
                $divId.append(option);
                var config={
                    disable_search_threshold: 2,
                    no_results_text: '',
                    width: '100%',
                    search_contains: true
                };
                $divId.chosen("destroy").init();
                $divId.chosen(config);
            }});
    },
    loadAreaCodeSelNew:function(divId,data){
        var $divId = $('#'+divId);
        $divId.empty();
        var url ='/getUserSubAreaCode';
        $divId.chosen("destroy").init();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: url,
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            //data: '',
            success: function (result) {
                var option ="";
                if(data!=undefined&&data!=null){
                    $.each(result,function(i,n){
                        option += '<option value="' + n.value + '">' + n.title + '</option>';
                    });
                    $divId.append(option);
                    $divId.find("option[value = '"+data+"']").attr("selected","selected");
                }else{
                    option += "<option value=''>请选择</option>";
                    $.each(result,function(i,n){
                        option += '<option value="' + n.value + '">' + n.title + '</option>';
                    });
                    $divId.append(option);
                }
                var config={
                    disable_search_threshold: 2,
                    no_results_text: '',
                    width: '100%',
                    search_contains: true
                };
                $divId.chosen("destroy").init();
                $divId.chosen(config);
            }});
    }
};
