/**
 * Isms 公共组件对象定义-时间选择工具（支持日期选择，时间选择，日期+时间选择等功能）
 * @author liuz@aotain.com
 */

/**
 * 日期Format方法扩展
 * @param fmt
 * @returns {*}
 * @constructor
 */
Date.prototype.Format = function(fmt)
{
    var o = {
        "M+" : this.getMonth()+1,         //月份
        "D+" : this.getDate(),          //日
        "h+" : this.getHours(),          //小时
        "m+" : this.getMinutes(),         //分
        "s+" : this.getSeconds(),         //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds()       //毫秒
    };
    if(/(Y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

// 工具入口定义
icom.tpick = {
    createDatePick : function(){
        return new icom.TimePick();
    },
    createTimePick : function(){
        return new icom.TimePick();
    }
    // ...
};

IsmsComponent.prototype.TimePick = function(){
    this._init_();
}
IsmsComponent.prototype.TimePick.prototype = {
    _init_ : function() {
    },
    demo : function(){
        alert("TimePick function demo");
    },
    initDoubleDate : function(startId,endId,datetype){
        $('#'+startId).removeAttr("lay-key");
        $('#'+endId).removeAttr("lay-key");
        switch (Number(datetype)){
            case 1:
                let startDate1= laydate.render({
                    elem: "#"+startId+"",
                    type: 'datetime', //日期时间 可选择：年、月、日、时、分、秒
                    format: "yyyy-MM-dd HH:mm:ss", //定义显示样式
                    theme: 'molv', //设置主题颜色
                    done: function (value, dates) {
                        endDate1.config.min ={
                            year:dates.year,
                            month:dates.month-1, //关键
                            date: dates.date,
                            hours: dates.hours,
                            minutes: dates.minutes,
                            seconds : dates.seconds
                        };
                    }
                });
                let endDate1= laydate.render({
                    elem: "#"+endId+"",
                    type: 'datetime', //日期时间 可选择：年、月、日、时、分、秒
                    format: "yyyy-MM-dd HH:mm:ss", //定义显示样式
                    theme: 'molv', //设置主题颜色
                    done: function (value, dates) {
                        if (value !== '') {
                            startDate1.config.max={
                                year:dates.year,
                                month:dates.month-1,//关键
                                date: dates.date,
                                hours:dates.hours,
                                minutes: dates.minutes,
                                seconds : dates.seconds
                            }
                        }else{
                            startDate1.config.max={
                                year:'99999',
                                month:'99999',//关键
                                date: '99999',
                                hours:'99999',
                                minutes: '99999',
                                seconds : '99999'
                            }
                        }
                    }
                });
                break;
            case 2:
                let startDate2= laydate.render({
                    elem: "#"+startId+"",
                    type: 'datetime', //日期时间 可选择：年、月、日mm、时、分、秒
                    format: "yyyy-MM-dd HH:mm", //定义显示样式
                    theme: 'molv', //设置主题颜色
                    done: function (value, dates) {
                        endDate2.config.min ={
                            year:dates.year,
                            month:dates.month-1, //关键
                            date: dates.date,
                            hours: dates.hours,
                            minutes: dates.minutes,
                            seconds : 0
                        };
                    }
                });
                let endDate2= laydate.render({
                    elem: "#"+endId+"",
                    type: 'datetime', //日期时间 可选择：年、月、日、时、分、秒
                    format: "yyyy-MM-dd HH:mm", //定义显示样式
                    theme: 'molv', //设置主题颜色
                    done: function (value, dates) {
                        if (value !== '') {
                            startDate2.config.max={
                                year:dates.year,
                                month:dates.month-1,//关键
                                date: dates.date,
                                hours:dates.hours,
                                minutes: dates.minutes,
                                seconds : 0
                            }
                        }else{
                            startDate2.config.max={
                                year:'99999',
                                month:'99999',//关键
                                date: '99999',
                                hours:'99999',
                                minutes: '99999',
                                seconds : 0
                            }
                        }
                    }
                });
                break;
            case 3:
                let startDate3= laydate.render({
                    elem: "#"+startId+"",
                    type: 'datetime', //日期时间 可选择：年、月、日、时、分、秒
                    format: "yyyy-MM-dd HH", //定义显示样式
                    theme: 'molv', //设置主题颜色
                    done: function (value, dates) {
                        endDate3.config.min ={
                            year:dates.year,
                            month:dates.month-1, //关键
                            date: dates.date,
                            hours: dates.hours,
                            minutes: 0,
                            seconds : 0
                        };
                    }
                });
                let endDate3= laydate.render({
                    elem: "#"+endId+"",
                    type: 'datetime', //日期时间 可选择：年、月、日、时、分、秒
                    format: "yyyy-MM-dd HH", //定义显示样式
                    theme: 'molv', //设置主题颜色
                    done: function (value, dates) {
                        if (value !== '') {
                            startDate3.config.max={
                                year:dates.year,
                                month:dates.month-1,//关键
                                date: dates.date,
                                hours:dates.hours,
                                minutes: 0,
                                seconds : 0
                            }
                        }else{
                            startDate3.config.max={
                                year:'99999',
                                month:'99999',//关键
                                date: '99999',
                                hours:'99999',
                                minutes: 0,
                                seconds : 0
                            }
                        }

                    }
                });
                break;
            case 4:
                let startDate4 = laydate.render({
                    elem: "#"+startId+"",
                    format: "yyyy-MM-dd", //定义显示样式
                    theme: 'molv', //设置主题颜色
                    done: function (value, dates) {
                        endDate4.config.min ={
                            year:dates.year,
                            month:dates.month-1, //关键
                            date: dates.date,
                            hours: 0,
                            minutes: 0,
                            seconds : 0
                        };
                    }
                });
                let endDate4= laydate.render({
                    elem: "#"+endId+"",
                    format: "yyyy-MM-dd", //定义显示样式
                    theme: 'molv', //设置主题颜色
                    done: function (value, dates) {
                        if (value !== '') {
                            startDate4.config.max={
                                year:dates.year,
                                month:dates.month-1,//关键
                                date: dates.date,
                                hours: 0,
                                minutes: 0,
                                seconds : 0
                            }
                        }else{
                            startDate4.config.max={
                                year:'99999',
                                month:'99',//关键
                                date: '99',
                                hours: 0,
                                minutes: 0,
                                seconds : 0
                            }
                        }
                    }
                });
                break;
            case 5:
                let startDate5 = laydate.render({
                    elem: "#"+startId+"",
                    format: "yyyy-MM-dd", //定义显示样式
                    theme: 'molv', //设置主题颜色
                    done: function (value, dates) {
                        endDate5.config.min ={
                            year:dates.year,
                            month:dates.month-1, //关键
                            date: dates.date,
                            hours: 0,
                            minutes: 0,
                            seconds : 0
                        };
                    }
                });
                let endDate5= laydate.render({
                    elem: "#"+endId+"",
                    format: "yyyy-MM-dd", //定义显示样式
                    theme: 'molv', //设置主题颜色
                    done: function (value, dates) {
                        if (value !== '') {
                            startDate5.config.max={
                                year:dates.year,
                                month:dates.month-1,//关键
                                date: dates.date,
                                hours: 0,
                                minutes: 0,
                                seconds : 0
                            }
                        }else{
                            startDate5.config.max={
                                year:'99999',
                                month:'99',//关键
                                date: '99',
                                hours: 0,
                                minutes: 0,
                                seconds : 0
                            }
                        }
                    }
                });
                break;
            case 6:
                let startDate6 = laydate.render({
                    elem: "#"+startId+"",
                    type: 'month',
                    theme: 'molv', //设置主题颜色
                    done: function (value, dates) {
                        endDate6.config.min ={
                            year:dates.year,
                            month:dates.month-1, //关键
                            date: dates.date,
                            hours: 0,
                            minutes: 0,
                            seconds : 0
                        };
                    }
                });
                let endDate6= laydate.render({
                    elem: "#"+endId+"",
                    type: 'month', //日期时间 可选择：年、月、日、时、分、秒
                    theme: 'molv', //设置主题颜色
                    done: function (value, dates) {
                        startDate6.config.max={
                            year:dates.year,
                            month:dates.month-1,//关键
                            date: dates.date,
                            hours: 0,
                            minutes: 0,
                            seconds : 0
                        }
                    }
                });
                break;
        }
        return false;
    },
    initSingleDate : function(dateId,datetype){
        $('#'+dateId).removeAttr("lay-key");
        switch (Number(datetype)){
            case 1:
                let date1= laydate.render({
                    elem: "#"+dateId+"",
                    type: 'datetime', //日期时间 可选择：年、月、日、时、分、秒
                    format: "yyyy-MM-dd HH:mm:ss", //定义显示样式
                    theme: 'molv', //设置主题颜色
                    max:'date'

                });
                break;
            case 2:
                let date2= laydate.render({
                    elem: "#"+dateId+"",
                    type: 'datetime', //日期时间 可选择：年、月、日mm、时、分、秒
                    format: "yyyy-MM-dd HH:mm", //定义显示样式
                    theme: 'molv', //设置主题颜色
                });
                break;
            case 3:
                let date3= laydate.render({
                    elem: "#"+dateId+"",
                    type: 'datetime', //日期时间 可选择：年、月、日、时、分、秒
                    format: "yyyy-MM-dd HH", //定义显示样式
                    theme: 'molv', //设置主题颜色
                    max:'date'
                });
                break;
            case 4:
                let date4 = laydate.render({
                    elem: "#"+dateId+"",
                    format: "yyyy-MM-dd", //定义显示样式
                    theme: 'molv', //设置主题颜色
                    max:'date'

                });
                break;
            case 5:
                let date5 = laydate.render({
                    elem: "#"+dateId+"",
                    format: "yyyy-MM-dd", //定义显示样式
                    theme: 'molv', //设置主题颜色
                });
            case 6:
                let date6 = laydate.render({
                    elem: "#"+dateId+"",
                    type: 'month',
                    theme: 'molv', //设置主题颜色
                });
                break;
        }
        // $("#"+dateId).removeAttrs()
        return false;
    }
}
