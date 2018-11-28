/*
    功能描述:除去字符串对象值尾后的空格
    返回类型:返回除去字符串对象值尾后空格后的值
*/
String.prototype.trim2 = function(){
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

/*
    功能描述:判断字符串对象值是否是web网址域名格式
    返回类型:返回布尔类型
*/
String.prototype.IsWebSite=function(){
	var _Reg=new RegExp(/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/);
	return _Reg.test(this.toString());			
}

/*
功能描述:判断字符串对象值是否是web网址域名格式
返回类型:返回布尔类型
*/
String.prototype.IsURL=function(){ 
	var _weburl = new RegExp(
			"^" +
			// protocol identifier
			"(?:(?:https?|ftp)://)" +
			// user:pass authentication
			"(?:\\S+(?::\\S*)?@)?" +
			"(?:" +
			// IP address exclusion
			// private & local networks
			"(?!10(?:\\.\\d{1,3}){3})" +
			"(?!127(?:\\.\\d{1,3}){3})" +
			"(?!169\\.254(?:\\.\\d{1,3}){2})" +
			"(?!192\\.168(?:\\.\\d{1,3}){2})" +
			"(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
			// IP address dotted notation octets
			// excludes loopback network 0.0.0.0
			// excludes reserved space >= 224.0.0.0
			// excludes network & broacast addresses
			// (first & last IP address of each class)
			"(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
			"(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
			"(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
			"|" +
			// host name
			"(?:(?:[a-z0-9]+-?)*[a-z0-9]+)" +
			// domain name
			"(?:\\.(?:[a-z0-9]+-?)*[a-z0-9]+)*" +
			// TLD identifier
			"(?:\\.(?:[a-z]{2,}))" +
			")" +
			// port number
			"(?::\\d{2,5})?" +
			// resource path
			"(?:/[^\\s]*)?" +
			"$", "i"
			);
	return _weburl.test(this.toString()); 
} 

/*
功能描述:判断字符串对象值是否是域名格式
返回类型:返回布尔类型
*/
String.prototype.IsDomain=function(){ 
	var _weburl = new RegExp(
			"^" +
			// protocol identifier
			"(?:(?:https?|ftp)://)?" +
			// user:pass authentication
			"(?:\\S+(?::\\S*)?@)?" +
			"(?:" +
			// IP address exclusion
			// private & local networks
			/* 支持IP
			"(?!10(?:\\.\\d{1,3}){3})" +
			"(?!127(?:\\.\\d{1,3}){3})" +
			"(?!169\\.254(?:\\.\\d{1,3}){2})" +
			"(?!192\\.168(?:\\.\\d{1,3}){2})" +
			"(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
			*/
			// IP address dotted notation octets
			// excludes loopback network 0.0.0.0
			// excludes reserved space >= 224.0.0.0
			// excludes network & broacast addresses
			// (first & last IP address of each class)
			"(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
			"(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
			"(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
			"|" +
			// host name
			"(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)" +
			// domain name
			"(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*" +
			// TLD identifier
			"(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
			")" +
			// port number
			"(?::\\d{2,5})?" +
			// resource path
			"(?:/[^\\s]*)?" +
			"$", "i"
			);
	return _weburl.test(this.toString()); 
} 

/*
功能描述:判断字符串对象值是否是中文
返回类型:返回布尔类型
*/
String.prototype.IsChinese=function() {
	var reg=new RegExp(/[\u4e00-\u9fa5]/);
	return reg.test(this.toString());
}

/*
功能描述:判断字符串对象值是否是web网址域名格式
返回类型:返回布尔类型
*/
String.prototype.IsPort=function(){
	if(parseInt(this)>0&&parseInt(this)<=65535){
		return true;
	}else	return false;
}

/*
    功能描述:判断字符串对象值是否是html格式
    返回类型:返回布尔类型
*/
String.prototype.IsHTML=function(){
	var _Reg=new RegExp(/<(.*)>.*<\/\1>|<(.*) \/>/);
	return _Reg.test(this.toString());			
}


/*
    功能描述:判断字符串对象值是否是电话号码格式
    返回类型:返回布尔类型
*/
String.prototype.IsPhone=function(){
	//var _Reg=new RegExp(/(^([0][1-9]{2,3}[-])?\d{3,8}(-\d{5,8})?$)|(^\([0][1-9]{2,3}\)\d{5,8}(\(\d{1,8}\))?$)|(^\d{3,14}$)/);
	//return _Reg.test(this.toString());	
	var str = this.toString();
		if(str==null||str==''){
		return false;
	} 

	var exp1 = /^[0-9\-\;]*$/;
	var exp2 = /^(086-(0\d{3}|0\d{2})-(\d{8}|\d{7}))+(-(\d{4}|\d{3}))?$/;
	
	if(!(exp1.test(str) && exp2.test(str))){
		return false;
	}

	return true;		
}

/*
    功能描述:判断字符串对象值是否是手机号码格式
    返回类型:返回布尔类型
*/
String.prototype.IsMobile=function(){
	 var reg=new RegExp(/^[0]?(177|130|131|132|153|156|182|185|186|188|134|135|136|137|138|139|150|151|152|155|157|158|159|133|153|180|181|187|189|183|147)[0-9]{8}$/);
	 return (reg.test(this));
}

/*
功能描述:判断字符串对象值是否是支持的手机号码格式
返回类型:返回布尔类型
*/
String.prototype.IsValidMobile=function(){
 var reg=new RegExp(/^[0]?(133|153|177|189|181|180)[0-9]{8}$/);
 System.out.println("匹配信息2："+reg.test(this));
 return (reg.test(this));
}

/*
    功能描述:判断字符串对象值是否是mail格式
    返回类型:返回布尔类型
*/
String.prototype.IsMail=function(){
	var _Reg=new RegExp(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/);
	return _Reg.test(this.toString());
}

/*
    功能描述:判断字符串对象值是否是ip地址格式
    返回类型:返回布尔类型
*/
String.prototype.IsIPAddress=function(){
	var _Reg=new RegExp(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/);
	return _Reg.test(this.toString());
}		

/*
    功能描述:判断字符串对象值是否是正整数格式
    返回类型:返回布尔类型
*/
String.prototype.IsNumber=function(){
	var _Reg=new RegExp(/^[0-9]+$/);
	return _Reg.test(this.toString());
}		


/*
    功能描述:用户名验证：只能是英文字符，数字，下滑线和减号  首字符必须为英文或数字 不允许汉字 

    返回类型:返回布尔类型
*/
String.prototype.IsUserName=function(){
	var _Reg=new RegExp(/^[A-Za-z0-9][A-Za-z0-9_\-]{3,15}$/);
	return _Reg.test(this.toString());
}	

/*
    -----------------------------------------------------
*/