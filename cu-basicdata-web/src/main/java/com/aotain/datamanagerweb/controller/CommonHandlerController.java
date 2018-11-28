package com.aotain.datamanagerweb.controller;

import com.alibaba.fastjson.JSON;
import com.aotain.cu.serviceapi.dto.AjaxValidationResult;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.datamanagerweb.constant.DataPermissionConstant;
import com.aotain.datamanagerweb.model.SystemOperator;
import com.aotain.datamanagerweb.utils.SpringUtil;
import com.aotain.login.pojo.DataPermission;
import com.aotain.login.pojo.UserDetailInfo;
import com.aotain.login.support.Authority;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

public class CommonHandlerController {

    public ResultDto handleHystrixResultDto() {
        ResultDto dto = new ResultDto();
        dto.setResultCode(ResultDto.ResultCodeEnum.ERROR.getCode());
        dto.setResultMsg("找不到服务");
        return dto;
    }

    public AjaxValidationResult handleHystrixAjaxRet() {
        AjaxValidationResult dto = new AjaxValidationResult();
        return dto;
    }

    public ResultDto getErrorResult() {
        ResultDto dto = new ResultDto();
        dto.setResultCode(ResultDto.ResultCodeEnum.ERROR.getCode());
        dto.setResultMsg("导入失败");
        return dto;
    }

    public ResultDto getErrorResult(String msg) {
        ResultDto dto = new ResultDto();
        dto.setResultCode(ResultDto.ResultCodeEnum.ERROR.getCode());
        dto.setResultMsg(msg);
        return dto;
    }

    public ResultDto getSuccessRest() {
        ResultDto dto = new ResultDto();
        dto.setResultCode(ResultDto.ResultCodeEnum.SUCCESS.getCode());
        dto.setResultMsg("导入成功");
        return dto;
    }
    /**
     * 同步权限信息
     */
    protected SystemOperator synchroAuthInfo() {
        String sycnhPath = SpringUtil.getSystemOperator().getDataPermissionUrl()+"/"+SpringUtil.getSystemOperator().getUserToken().replace("=", "%3D")+"?deployId="+SpringUtil.getSystemOperator().getAppId();
        //获取最新的权限机房信息
        JsonObject jsonObject = SpringUtil.getPaassportHttpResult(sycnhPath, "");
        if(jsonObject!=null&&"1".equals(jsonObject.get("statuCode").toString())){
            JsonArray jsonArray  = jsonObject.getAsJsonArray("result");
            DataPermission dataPermission = null;
            SystemOperator operator = new SystemOperator();
            for(JsonElement element:jsonArray) {
                dataPermission = JSON.parseObject(element.toString(), DataPermission.class);
                if (dataPermission.getSettings() != null && !dataPermission.getSettings().isEmpty()) {
                    if (DataPermissionConstant.AUTH_HOUSE_LIST.equals(dataPermission.getDataPermissionToken())) {
                        List<String> authHouseList = new ArrayList();
                        for (com.aotain.login.pojo.DataPermissionSetting setting : dataPermission.getSettings()) {
                            authHouseList.add(setting.getSettingKey());
                        }
                        operator.setAuthHouseList(authHouseList);

                    }
                    if (DataPermissionConstant.AUTH_IDENTITY_LIST.equals(dataPermission.getDataPermissionToken())) {
                        List<String> authIdentityList = new ArrayList();
                        for (com.aotain.login.pojo.DataPermissionSetting setting : dataPermission.getSettings()) {
                            authIdentityList.add(setting.getSettingKey());
                        }
                        operator.setAuthIdentityList(authIdentityList);
                    }
                    if (DataPermissionConstant.AUTH_CITY_CODE_LIST.equals(dataPermission.getDataPermissionToken())) {
                        List<String> authCityCodeList = new ArrayList();
                        for (com.aotain.login.pojo.DataPermissionSetting setting : dataPermission.getSettings()) {
                            authCityCodeList.add(setting.getSettingKey());
                        }
                        operator.setAreaList(authCityCodeList);
                    }
                }
            }
            operator.setUserId(SpringUtil.getSystemOperator().getUserId());
            return operator;
        }
        return null;
    }
}
