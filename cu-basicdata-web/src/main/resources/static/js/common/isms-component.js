/**
 * Isms 公共组件对象定义
 * @author liuz@aotain.com
 */
var IsmsComponent = function () {
    // start : Common工具箱
    function CommonUtils(){
        // 测试方法
        this.demo = function(value) {
            alert("CommonUtils demo : input="+ value);
        };
    };
    this.cutils = new CommonUtils();
    // end : Common工具箱
};
var icom = new IsmsComponent();


// 数组检索工具
if (!Array.prototype.indexOf)
{
    Array.prototype.indexOf = function(elt /*, from*/)
    {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++)
        {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}

$(document).ready(function(){
	$("form").attr("autocomplete","off");
});