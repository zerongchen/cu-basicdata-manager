package com.aotain.datamanagerweb.utils.constant;

import lombok.Getter;
import lombok.Setter;

/**
 * 机房操作相关常量类
 *
 * @author bang
 * @date 2018/07/20
 */
@Getter
@Setter
public class HouseConstant {

    /******处理标记枚举类******/
    public enum DealFlagEnum{

        NOT_CHECK("未预审",0),
        CHECK_FAIL("预审不通过",1),
        CHECKING("上报审核中",2),
        REPORT_CHECK_FAIL("上报审核不通过",3),
        REPORTING("提交上报",4),
        REPORT_SUCCESS("上报成功",5),
        REPORT_FAIL("上报失败",6);
        @Getter
        @Setter
        private String desc;
        @Getter
        @Setter
        private Integer value;
        DealFlagEnum(String desc,int value){
            this.desc = desc;
            this.value = value;
        }
    }

    /******处理标记枚举类******/
    public enum OperationTypeEnum{

        ADD("新增",1),
        MODIFY("修改",2),
        DELETE("删除",3);

        @Getter
        @Setter
        private String desc;
        @Getter
        @Setter
        private Integer value;
        OperationTypeEnum(String desc,int value){
            this.desc = desc;
            this.value = value;
        }
    }

    /**
     * 操作类型枚举类
     */
    public enum CzlxEnum{

        ADD("新增",1),
        MODIFY("变更",2),
        DELETE("删除",3);
        @Getter
        @Setter
        private String desc;
        @Getter
        @Setter
        private Integer value;
        CzlxEnum(String desc,int value){
            this.desc = desc;
            this.value = value;
        }
    }

    /******ip地址使用方式枚举类******/
    public enum IpUseTypeEnum{

        STATIC("静态",0),
        DYNAMIC("动态",1),
        REMAIN("保留",2),
        SPECIAL("专线",3),
        CLOUD_VIRTUAL("云虚拟",999);
        @Getter
        @Setter
        private String desc;
        @Getter
        @Setter
        private Integer value;
        IpUseTypeEnum(String desc,int value){
            this.desc = desc;
            this.value = value;
        }
    }

    /******主体子节点处理枚举类 （0-未上报、1-已上报）******/
    public enum ChildDealFlagEnum{

        UN_UPLOAD("未上报",0),
        UPLOADED("已上报",1);
        @Getter
        @Setter
        private String desc;
        @Getter
        @Setter
        private Integer value;

        ChildDealFlagEnum(String desc,int value){
            this.desc = desc;
            this.value = value;
        }
    }

}
