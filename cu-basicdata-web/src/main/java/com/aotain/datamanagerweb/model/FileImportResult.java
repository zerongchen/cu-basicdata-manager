package com.aotain.datamanagerweb.model;

public class FileImportResult {

    private String percent;

    private Long userId;

    private String errorFileName;

    private Integer status;

    public String getPercent() {
        return percent;
    }

    public void setPercent( String percent ) {
        this.percent = percent;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId( Long userId ) {
        this.userId = userId;
    }

    public String getErrorFileName() {
        return errorFileName;
    }

    public void setErrorFileName( String errorFileName ) {
        this.errorFileName = errorFileName;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus( Integer status ) {
        this.status = status;
    }
}
