var errorTime = 0;

loginJs = {
    initClick : function () {
        $("#flushBtn").on('click',function () {

            $("#validateImg").attr("src",'/code?ran='+Math.random())
        });
        
        $("#loginForm").find('input').on('focus',function () {
            $("#error_msg").text("");
            // $("errorCode2").html("");
        });

        $("#submitBtn").on('click',function () {
            loginJs.login();
        });
        $('#password').keydown(function(e){
            if(e.keyCode==13){
                loginJs.login();
            }
        });
        $('#verificationCodeId').keydown(function(e){
            if(e.keyCode==13){
                loginJs.login();
            }
        });

    },
    login:function () {
        $("#error_msg").text("");
        var data = $("#loginForm").formToJSON();
        if(data.username==null || data.username==""){
            $("#error_msg").text("请输入用户名");
            return false;
        }
        if(data.password==null || data.password==""){
            $("#error_msg").text("请输入密码");
            return false;
        }
        if(data.verificationCode==null || data.verificationCode==""){
            $("#error_msg").text("请输入验证码");
            return false;
        }
        //用户名和密码加密
        RSAUtils.setMaxDigits(200);
        var key = new RSAUtils.getKeyPair($('#pubexponent').val(), '', $('#pubmodules').val());
        data.username = RSAUtils.encryptedString(key, data.username);
        data.password = RSAUtils.encryptedString(key, data.password);
        //模拟表单提交
        var formHtml = "<form disabled='disabled' action>";
        var form = '<form class="hide" id="loginForms"><input name="username" value="'+data.username+'">' +
            '<input name="password" value="'+data.password+'"><input name="verificationCode" value="'+data.verificationCode+'"></form>';
        $('body').append(form);
        $('#loginForms').attr('action', '/dealLogin').attr('method', 'post').submit() ;return false;
    },


    init :function () {
        loginJs.initClick();
    }
};


$(document).ready(function() {
    loginJs.init();

});
