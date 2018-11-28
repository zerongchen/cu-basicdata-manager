/**
 * Isms 公共组件对象定义-校验框架实现（本文件实现两个功能：1.自定义公共校验方法;2.扩展JQuery Validate插件）
 * @author liuz@aotain.com
 */

// 1. 自定义公共校验方法(校验工具暂时不用实现，有需要时再添加)
icom.validate = {

};
IsmsComponent.prototype.Validate = function(){
    this._init_();
}
IsmsComponent.prototype.Validate.prototype = {
    _init_ : function() {
    }
}

// TODO: 此处需要实现对JQuery Validate插件的扩展
// 2.扩展JQuery Validate插件

/**
 *  jQuery Validate扩展验证方法
 */
jQuery.validator.setDefaults({
    errorElement: 'div',
    errorPlacement: function(error, element) {
        if(element.parent().next().attr("name")=="tips"){
            error.appendTo(element.parent().next().next());
        }else{
            error.appendTo(element.parent().next());
        }
    }
});
// 手机号码验证
jQuery.validator.addMethod("isMobile", function(value, element) {
    var length = value.length;
    return this.optional(element) || (length == 11 && /^(1[0-9])\d{9}$/.test(value));
}, "请填写正确的手机号码");

// 固定电话验证
jQuery.validator.addMethod("isPhone", function(value, element) {
    var tel = /(?:(\(\+?86\))(0[0-9]{2,3}\-?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)|(?:(86-?)?(0[0-9]{2,3}\-?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)|(400)-(\d{3}-\d{4}|\d{4}-\d{3})|(400)[0,1,6,7,8,9]-(\d{3}-\d{3}|\d{2}-\d{4}|\d{4}-\d{2})|^(400)\d{7}/;
    return this.optional(element) || (tel.test(value));
}, "请填写正确的电话号码");
// 邮政编码验证
jQuery.validator.addMethod("isZipCode", function(value, element) {
    var tel = /^[0-9]\d{5}$/;
    return this.optional(element) || (tel.test(value));
}, "请填写正确的邮政编码");
// 身份证号码验证
jQuery.validator.addMethod("isIdCardNo", function(value, element) {
    return this.optional(element) || isIdCardNo(value);
}, "请填写正确的身份证号码");
// IP地址验证
jQuery.validator.addMethod("isIpAddress", function(value, element) {
    //var exp = /^\s*((([0-9A-Fa-f]{1,4}:){7}(([0-9A-Fa-f]{1,4})|:))|(([0-9A-Fa-f]{1,4}:){6}(:|((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})|(:[0-9A-Fa-f]{1,4})))|(([0-9A-Fa-f]{1,4}:){5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){4}(:[0-9A-Fa-f]{1,4}){0,1}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){3}(:[0-9A-Fa-f]{1,4}){0,2}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){2}(:[0-9A-Fa-f]{1,4}){0,3}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:)(:[0-9A-Fa-f]{1,4}){0,4}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(:(:[0-9A-Fa-f]{1,4}){0,5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})))(%.+)?\s*$/;
    return this.optional(element) || /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/.test(value);
}, "请填写正确的IP地址");
// 带宽校验
jQuery.validator.addMethod("isBanWidth", function(value, element) {
    return this.optional(element) || isBanWidth(value);
}, "请填写非负整数带宽值");


//网络带宽
function isBanWidth(value){
    //var  re = new RegExp(/^\+?[1-9][0-9]*$/);
	var  re = new RegExp(/^(0|\+?[1-9][0-9]*)$/);
    if(re.test(value)){
        if(value<2147483647){
            return true;
        }else {
            return false;
        }
    }else {
        return false;
    }
}

//手机号码
function isMobilePhone(value){
   var  re = new RegExp(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/);
   return re.test(value);
}
//电话号码
function isPhoneNum(value){
    var  re = new RegExp(/^(\d{3,4}-?)?\d{7,9}$/g);
    return re.test(value);
}

//身份证号码的验证规则
function isIdCardNo(num){
    //if (isNaN(num)) {alert("输入的不是数字！"); return false;}
    var len = num.length, re;
    if (len == 15)
        re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{2})(\w)$/);
    else if (len == 18)
        re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/);
    else {
        //alert("输入的数字位数不对。");
        return false;
    }
    var a = num.match(re);
    if (a != null)
    {
        if (len==15)
        {
            var D = new Date("19"+a[3]+"/"+a[4]+"/"+a[5]);
            var B = D.getYear()==a[3]&&(D.getMonth()+1)==a[4]&&D.getDate()==a[5];
        }
        else
        {
            var D = new Date(a[3]+"/"+a[4]+"/"+a[5]);
            var B = D.getFullYear()==a[3]&&(D.getMonth()+1)==a[4]&&D.getDate()==a[5];
        }
        if (!B) {
            //alert("输入的身份证号 "+ a[0] +" 里出生日期不对。");
            return false;
        }
    }
    if(!re.test(num)){
        //alert("身份证最后一位只能是数字和字母。");
        return false;
    }
    return true;
}
