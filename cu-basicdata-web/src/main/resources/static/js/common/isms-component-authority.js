/**
 * Isms 公共组件对象定义-时间选择工具（支持日期选择，时间选择，日期+时间选择等功能）
 * 
 * @author liuz@aotain.com
 */

// 工具入口定义
//icom.auth = {
//    createAuthority:function () {
//        return new icom.Authority();
//    }
//};

IsmsComponent.prototype.Authority = function(){
	this._init_();
}

IsmsComponent.prototype.Authority.prototype = {
    _init_ : function() {
        $.ajax({
            url:'/getLoginUser',
            type:'GET',
            async:false,
            success:function (data) {
                var userInfo = {};
                userInfo.userAccount = data.userName;
                userInfo.userName = data.fullName;
                userInfo.userLevel = data.userLevel;
                //登录账号携带的隶属码信息
                userInfo.userAreaCode = data.areaCodes;
                userInfo.userId = data.userId;
                //登录账号携带的机房信息
                userInfo.userAuthHouseList = data.authHouses;
                //登录账号携带的专线标识信息
                userInfo.userAuthIdentityList = data.authIdentities;
                if (userInfo != null){
                    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                } else {
                    try {
                        throw new Error('jcdmCode data is null , pls check');
                    } catch (e) {
                        console.log(e.name + ': ' + e.message);
                    }
                }
            }
        })
    },
    getUserInfo:function () {
        var result = sessionStorage.getItem('userInfo');
        if(result==null || result==""){
            this._init_();
            result = sessionStorage.getItem('userInfo');
        }
        return JSON.parse(result);
    },
    demo : function(){
        alert("Authority function demo");
    }
}
icom.auth = new icom.Authority();