/**
 * Isms 公共组件对象定义-富下拉选择框(支持：单选、多选；可限制最大加载数量；可点击事件自动清空等功能)
 * @author liuz@aotain.com
 */

// 工具入口定义
icom.rsel = {
    // 构造性类静态函数：创建RichSelect对象
    createRichSelect : function(id,config,param){ // 参数为仅为demo，请更具需求自行设计
        return new icom.RichSelect(id,config,param); // 可使用icom对象引用下文定义的类
    },
    // 功能性类静态函数：实现与RichSelect相关的常用功能
    sayHello : function(richSelect){
        alert("Hello "+richSelect.name+" !");
    },
    createSelectPicker : function(id,url,sendData){
        return new icom.RichSelect.selectPicker(id,url,sendData);
    },
};

// 富文本框对象定义（在原型中新增对象，避免全局类型冲突）
IsmsComponent.prototype.RichSelect = function(id,config,param){
    this._init_param_(id,config,param);
};
IsmsComponent.prototype.RichSelect.prototype = {
    // 初始化方法（构造方法，所有类都使用_init_作为构造方法）
    _init_ : function(id,name) {
        this.id = id;
        this.name = name;
    },
    // 成员方法：实现RichSelect的功能
    demo1 : function(){
        alert("RichSelect function demo1");
    },
    // 成员方法：与其它模块的调用
    demo2 : function(value){
        alert("RichSelect function demo2 : call core module function");
        icom.cutils.demo(value);
    },
    demo3 : function() {
        alert("RichSelect function demo3 : call other module function");
        icom.tpick.createDatePick().demo();
    },

    _init_param_ : function(id,config,param) {
        this.id = id;
        this.config = config;
        this.param = param;
        this.sec=$("#"+this.id);
    },
    render:function(){
        let sec = this.sec;
        let par = this.param;
        if(par != undefined && par!=null){
            let option='';
            $.ajax({
                url: par.url,
                //type: 'GET',
                data:par.data,
                dataType: 'json',
                success: function(data){
                    sec.children().remove();
                    $.each(data, function(i, n){
                        option += '<option value="' + n.value + '">' + n.title + '</option>';
                    });
                    sec.append(option);
                },
                error:function(){
                    sec.select2();
                }
            });
        }
        let defaultConfig = {
            language: "zh-CN", //提示语言
            minimumInputLength: 0,//最小需要输入多少个字符才进行查询,或者不写
            placeholder:"请选择",
            allowClear:true,//是否允许清空
            closeOnSelect: false,
            //maximumSelectionLength: 300, //最多选择个数
        };
        let cof ;
        let config = this.config;
        if(config != undefined && config!=null ){
            if(config.language!=undefined) {defaultConfig.language=config.language ; delete config.language}
            if(config.minimumInputLength!=undefined) {defaultConfig.minimumInputLength=config.minimumInputLength;delete config.minimumInputLength}
            if(config.placeholder!=undefined) {defaultConfig.placeholder=config.placeholder;delete config.placeholder}
            if(config.allowClear!=undefined) {defaultConfig.allowClear=config.allowClear;delete config.placeholder}
            if(config.maximumSelectionLength!=undefined) {defaultConfig.maximumSelectionLength=config.maximumSelectionLength;delete config.maximumSelectionLength}

            cof = $.extend(config,defaultConfig);
        }else{
            cof = defaultConfig;
        }
        sec.select2(cof);
        sec.change(function(){
            var ele = $(this);
            if(ele.val()!=null && ele.val().length==cof.maximumSelectionLength)
            {
                ele.select2('close');
            }
        });
    },
    resetValue:function(value){
        let sec = this.sec;
        if (value instanceof Array){
            sec.val(value).trigger('change');
        }else{
            let array = new Array();
            array.push(value);
            sec.val(array).trigger('change');
        }
    },
    appendValue:function(value){
        let $sec = this.sec;
        let array = $sec.select2("val");
        if(array==null){
            array=new Array();
        }
        array.push(value+"");
        $sec.val(array).trigger('change');
    },
    getValue:function () {
        let $sec = this.sec;
        let array = $sec.select2("val");
        return array;
    },

    selectPicker:function (id,url,sendData) {
        let $divId = $('#'+id);
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
                if(edit > 1){
                    $divId.chosen("destroy").init();
                }
                $divId.chosen(config);
            }});
    }

};
