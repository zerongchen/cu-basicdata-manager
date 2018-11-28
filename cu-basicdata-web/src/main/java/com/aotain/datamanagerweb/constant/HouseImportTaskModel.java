package com.aotain.datamanagerweb.constant;

import com.aotain.cu.serviceapi.model.ImportTaskModel;

import javax.servlet.http.HttpServletRequest;

/**
 * Demo class
 *
 * @author bang
 * @date 2018/10/19
 */
public class HouseImportTaskModel extends ImportTaskModel{

    public HouseImportTaskModel(){
        super();
    }

    private HttpServletRequest httpServletRequest;

    public HttpServletRequest getHttpServletRequest() {
        return httpServletRequest;
    }

    public void setHttpServletRequest(HttpServletRequest httpServletRequest) {
        this.httpServletRequest = httpServletRequest;
    }
}
