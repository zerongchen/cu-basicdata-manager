package com.aotain.datamanagerweb.model;

public class TitleValueBean  implements java.io.Serializable{

    private static final long serialVersionUID = -1384988812720447808L;

    private String title;

    private String value;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
