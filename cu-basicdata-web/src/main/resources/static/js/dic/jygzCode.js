jygzCode={
    data:null,
    initData:function () {
        if (sessionStorage.hasOwnProperty("jygz")){
            return;
        }
        $.ajax({
            url: "/common/getRule",
            async:false,
            dataType: 'json',
            success: function(data){
                if (data!=null){

                    jygzCode.data=(JSON.stringify(data));
                    sessionStorage.setItem("jygz",(JSON.stringify(data)));
                }else {
                    try {
                        throw new Error('get JYGZ data is null , pls check');
                    } catch (e) {
                        console.log(e.name + ': ' + e.message);
                    }
                }
            }
        });
    },
    getData:function () {
        jygzCode.initData();
        return JSON.parse(sessionStorage.getItem("jygz"));
    },
    refresh:function () {
        $.ajax({
            url: "/common/refreshJyGz",
            async:false,
            success: function(data){
                sessionStorage.removeItem("jygz");
            },
            error:function () {
                try {
                    throw new Error('refresh JYGZ data is null , pls check');
                } catch (e) {
                    console.log(e.name + ': ' + e.message);
                }
            }
        });
    }
};
sessionStorage.removeItem("jygz");