areaCode={
    data:null,
    initData:function () {
  /*      if (sessionStorage.hasOwnProperty("areaCode")){
            return;
        }*/
        $.ajax({
            url: "/common/getAreaCode",
            async:false,
            dataType: 'json',
            success: function(data){
                if (data!=null){
                    areaCode.data=(JSON.stringify(data));
                    sessionStorage.setItem("areaCode",JSON.stringify(data));
                }else {
                    try {
                        throw new Error('get areaCode data is null , pls check');
                    } catch (e) {
                        console.log(e.name + ': ' + e.message);
                    }
                }
            }
        });
    },
    getData:function () {
        areaCode.initData();
        // return JSON.parse(areaCode.data);
        return JSON.parse(sessionStorage.getItem("areaCode"));
    },
    refresh:function () {
        $.ajax({
            url: "/common/refreshAreaCode",
            async:false,
            success: function(data){
                sessionStorage.removeItem("areaCode");
            },
            error:function () {
                try {
                    throw new Error('refresh areaCode data is null , pls check');
                } catch (e) {
                    console.log(e.name + ': ' + e.message);
                }
            }
        });
    }

};
sessionStorage.removeItem("areaCode");
