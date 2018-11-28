$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [ o[this.name] ];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
$.fn.extend({
    formToJSON: function(){
        var $this = this;
        var obj = {};
        var formJson = $this.serializeArray();
        $.each(formJson, function(i, n){
            var val = obj[n.name];
            if(val){
                obj[n.name] = val + ',' + $.trim(n.value);
            }else{
                obj[n.name] = $.trim(n.value);
            }
        });
        return obj;
    }
});

var initTable={
    initBoostrapTable:function (id,url,getColumnFunction,queryParams,buttonId) {
        $("#"+id).bootstrapTable('destroy').bootstrapTable({
            method: 'post',
            url: url,
            queryParams: queryParams,
            contentType: 'application/x-www-form-urlencoded',
            dataType: "json",
            striped: true,
            undefinedText: '',
            showColumns: !0,
            toolbar: "#"+buttonId,
            pagination: true,
            sidePagination: 'server',
            iconSize: "outline",
            icons: {
                columns: "glyphicon-list",
            },
            clickToSelect:false,
            pageSize: 10,
            pageList: [10, 25, 50, 100, 200],
            columns: getColumnFunction,
        });
    },
    refreshTable:function(id,url){
        $("#"+id).bootstrapTable('refresh', { url: url});
    }
};

/*initTablejs= {
    /!**
     * column 表头
     * session table id
     * url 数据来源
     *
     * **!/
    params:{
        column:[],
        session:'',
        url:''
    },

    initParam:function(id,url,getColumnFunction,queryParams){
        initTablejs.params.column=getColumnFunction;
        initTablejs.params.session=id;
        initTablejs.params.url=url;
        initTablejs.params.queryParams=queryParams;
    },
    refreshTable:function(){
        $("#"+initTablejs.params.session).bootstrapTable('refresh', { url: initTablejs.params.url});
    },
    initBoostrapTable: function(){
        $("#"+initTablejs.params.session).bootstrapTable('destroy').bootstrapTable({
            // method: 'post',
            url: initTablejs.params.url,
            queryParams: initTablejs.params.queryParams,
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
            pageSize: 10,
            pageList: [10, 25, 50, 100, 200],
            columns: initTablejs.params.column
        });
    },

    init:function(){
        initTablejs.initBoostrapTable();
    }

};*/

function checkIP(value){
    var exp=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    var reg = value.match(exp);
    if(reg==null)
    {
        return false;
    }
    return true;
}
function checkPort(value) {
    var exp = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
    var reg = value.match(exp);
    if(reg==null)
    {
        return false;
    }
    return true;
}

function checkMac(address) {
    var c = '';
    var i = 0, j = 0;

    if ((address.toLowerCase() == 'ff:ff:ff:ff:ff:ff') || (address.toLowerCase() == '00:00:00:00:00:00')) {
        return false;
    }

    var addrParts = address.split(':');
    if (addrParts.length != 6) {
        return false;
    }
    for (i = 0; i < 6; i++){
        if (addrParts[i] == ''){
            return false;
        }
        if (addrParts[i].length != 2) {
            return false;
        }
        for (j = 0; j < addrParts[i].length; j++) {
            c = addrParts[i].toLowerCase().charAt(j);
            if ((c >= '0' && c <= '9') || (c >= 'a' && c <='f')) {
                continue;
            } else {
                return false;
            }
        }
    }
    if ((parseInt(addrParts[0], 16) % 2) == 1) {
        return false;
    }

    return true;
}

function saveTxt(data,fileName) {
    saveAs( new Blob([decodeURI(data)], {type: "text/plain;charset=utf-8"}), fileName);
}

function isURL(str_url) {// 验证url
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
        + "[a-z]{2,6})" // first level domain- .com or .museum
        + "(:[0-9]{1,4})?" // 端口- :80
        + "((/?)|" // a slash isn't required if there is no file name
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re = new RegExp(strRegex);
    return re.test(str_url);

}
function checkIpv6(value) {
    var matchStr = "((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$";
    var ret = value.match(matchStr);
    if (ret) {
        return true;
    } else {
        return false;
    }
}
function checkIpv4Prefix(value) {
    var matchStr = /^\+?[1-9][0-9]*$/;
    var ret = value.match(matchStr);
    if(ret){
        if (value <=32) {return true;}
    }
    return false
}
//非0正整数
function isNumber(value) {
    var matchStr = /^\+?[1-9][0-9]*$/;
    var ret = value.match(matchStr);
    if(ret){
       return true;
    }
    return false
}
//包括0的正整数
function isNmber0(value) {
	var matchStr = /^(0|[1-9]\d*)$/;
	var ret = value.match(matchStr);
    if(ret){
       return true;
    }
    return false
}
function checkIpv6Prefix(value) {
    var matchStr = /^\+?[1-9][0-9]*$/;
    var ret = value.match(matchStr);
    if(ret){
        if (value <=64) {return true;}
    }
    return false
}
