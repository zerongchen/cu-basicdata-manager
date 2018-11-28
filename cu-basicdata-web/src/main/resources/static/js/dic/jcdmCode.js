jcdmCode={
    data:null,
    initData:function () {
      $.ajax({
          url: "/common/getBaseCode",
          //type: 'GET',
          //data:param.data,
          async:false,
          dataType: 'json',
          success: function(data){
              if (data!=null){
                  jcdmCode.data=(JSON.stringify(data));
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
        jcdmCode.initData();
        return JSON.parse(jcdmCode.data);
    },
    refresh:function () {
        $.ajax({
            url: "/common/refreshBaseCode",
            async:false,
            success: function(data){
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
