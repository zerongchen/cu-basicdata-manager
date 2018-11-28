package com.aotain.datamanagerweb.constant;

public class ImportConstant {

    public static final int THREAD_NUM = 16;

    public enum TaskTypeEum{
        JYZ(1),
        USER(3),
        HOUSE(2);
        private Integer type;
        TaskTypeEum(Integer type){
            this.type=type;
        }
        public Integer getType() {
            return type;
        }
    }

    public enum ImportTypeEum{
        OVERIDE_IMPORT(2,"覆盖导入"),
        INCRISE_IMPORT(1,"追加导入");
        private Integer type;
        private String desc;
        ImportTypeEum(Integer type,String desc){
            this.type=type;
            this.desc=desc;
        }

        public Integer getType() {
            return type;
        }

        public String getDesc() {
            return desc;
        }
    }

    public enum StatusEum{
//        1-正在导入，2-导入成功，3-导入失败
        IMPORTING(1,"正在导入"),
        IMPORT_SUCCESS(2,"导入成功"),
        IMPORT_FAIL(3,"导入失败");
        private Integer type;
        private String desc;
        StatusEum(Integer type,String desc){
            this.type=type;
            this.desc=desc;
        }

        public Integer getType() {
            return type;
        }

        public String getDesc() {
            return desc;
        }
    }
}
