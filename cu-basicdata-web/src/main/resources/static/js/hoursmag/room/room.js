hr={
    wizardFuc:function () {
        $("#wizard").steps({
            //该步骤发生变化前触发
            onStepChanging: function(event, currentIndex, newIndex) {
                return true;
            },
            //该步骤发生变化后触发
            onStepChanged: function(event, currentIndex, priorIndex) {
                if(currentIndex == 3) {
                    //预审按钮的显示
                    $(".prequalification").show();
                    //预审按钮的点击
                    $(".prequalification").click(function() {
                        swal({
                            title: "预审通过",
                            text: "请登陆IDC/ISP信息安全管理系统进行机房数据上报！",
                            type: "success",
                            showCancelButton: true,
                        })
                    });
                }else{
                    $(".prequalification").hide();
                }
            },
            //完成时候的方法（保存并退出按钮）
            onFinished: function(event, currentIndex) {
                console.log(currentIndex + "完成时候的参数")
                swal({
                    title: "确定要保存以上步骤的记录吗",
                    text: "取消后将无法恢复，请谨慎操作！",
                    type: "success",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    closeOnConfirm: false
                }, function(isConfirm) {
                    if(isConfirm) {
                        swal({
                            title: "保存成功",
                            text: "已经保存了所有记录",
                            type: "success",
                        }, function(isConfirm) {
                            if(isConfirm) {
                                // window.location.href = 'computerRoom-main.html'
                            }
                        })
                    }
                })
            },
            //取消的方法（清空按钮）
            onCanceled: function(event, currentIndex) {
//				window.location.href = 'computerRoom-main.html'
            },
        });
    },
    clickFuc:function () {
        $(".addTitle").click(function () {
            var addTitleHTML=$(this).parent().parent().parent().clone();
            addTitleHTML.find("h5>a").removeClass("addTitle").addClass("removeTitleContent").html("<i class=\'fa fa-minus\'></i> 删除");
            $(this).parent().parent().parent().after(addTitleHTML);
            //删除添加的组
            $(".removeTitleContent").click(function () {
                $(this).parent().parent().parent().remove();
            });
        });
        //表单里面的新增
        $(".addGroup").click(function  () {
            var addGroupHTML=$(this).parent().parent().clone();
            addGroupHTML.find("a").removeClass("addGroup").addClass("removeGroup").html("<i class=\'fa fa-minus-circle\'></i> 删除");
            $(this).parent().parent().after(addGroupHTML);
            //删除添加的组
            $(".removeGroup").click(function () {
                $(this).parent().parent().remove();
            })
        });
    },
    getColumn:function(){
        let column=[
            {field: 'name',title: '机房ID'},
            {field: 'star',title: '机房编号'},
            {field: 'time',title: '专线标识'},
            {field: 'description',title: '机房名称'},
            {field: 'nature',title: '机房性质'},
            {field: 'location',title: '机房所在地'},
            {field: 'user',title: '机房负责人'},
            {field: 'status',title: '处理状态'},
            {field: 'review',title: '审核结果'},
            {field: 'updated',title: '更新时间'},
            {field: 'operating',title: '操作',width:'130px'},
        ];
    return column;

    },
    initTable:function () {
        initTablejs.initParam("table1","/static/js/demo/bootstrap_table_test1.json",hr.getColumn,null);
        initTablejs.initBoostrapTable();
    }

};

<!--wizard表单步骤验证 -->
$(document).ready(function() {
    //https://github.com/rstaib/jquery-steps/wiki/Settings 	参数设置网址
    $(" #wizard > .step-content ").css("min-height", "200px");
    hr.wizardFuc();
    hr.clickFuc();
    hr.initTable();
    //demo for select2
    cselect.initSelect("select1")
});



