package com.aotain.datamanagerweb.controller.handlefile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.aotain.datamanagerweb.constant.ImportConstant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.ImportTaskModel;
import com.aotain.datamanagerweb.annotation.LogAction;
import com.aotain.datamanagerweb.annotation.RequiresPermission;
import com.aotain.datamanagerweb.constant.HouseImportTaskModel;
import com.aotain.datamanagerweb.controller.CommonHandlerController;
import com.aotain.datamanagerweb.model.FileImportResult;
import com.aotain.datamanagerweb.model.SystemOperator;
import com.aotain.datamanagerweb.service.handlefile.FileHandleService;
import com.aotain.datamanagerweb.utils.SpringUtil;

@RestController
@RequestMapping("/import")
public class ImportHandleController extends CommonHandlerController {

	private static final String IDC_MODULE_NAME = "经营者";
	private static final String HOUSE_MODULE_NAME = "机房";
	private static final String USER_MODULE_NAME = "用户";
	
    private Logger logger= LoggerFactory.getLogger(ImportHandleController.class);

    @Autowired
    private FileHandleService fileHandleService;

    @RequiresPermission(value = "ROLE_IDC_IMPORT")
    @LogAction(module=IDC_MODULE_NAME,type=SystemActionLogType.IMPORT)
    @RequestMapping(value = "idcInfo",method = {  RequestMethod.POST },produces = {"application/json;charset=UTF-8"})
    public ResultDto handleIdcImport( HttpServletRequest request , HttpServletResponse response, ImportTaskModel importTaskModel){

        try {
            SystemOperator operator = synchroAuthInfo();
            if (operator==null){
                operator = SpringUtil.getSystemOperator();
            }
            importTaskModel.setCityCodeList(operator.getAreaList());
            importTaskModel.setUserAuthHouseList(operator.getAuthHouseList());
            importTaskModel.setUserAuthIdentityList(operator.getAuthIdentityList());
            importTaskModel.setCreateUserId(Long.valueOf(operator.getUserId()));
            importTaskModel.setUpdateUserId(operator.getUserId());
            importTaskModel.setTaskType(ImportConstant.TaskTypeEum.JYZ.getType());
            return fileHandleService.handIdcImport(request,importTaskModel);
        }catch (Exception e){
            logger.error("import idcInfo error",e);
            return getErrorResult();
        }
    }

    @RequiresPermission(value="ROLE_PRE_USER_IMPORT")
    @LogAction(module=USER_MODULE_NAME,type=SystemActionLogType.IMPORT)
    @RequestMapping(value = "userInfo",method = {  RequestMethod.POST },produces = {"application/json;charset=UTF-8"})
    public ResultDto handleImport( HttpServletRequest request , HttpServletResponse response, ImportTaskModel importTaskModel){
        try {
            SystemOperator operator = synchroAuthInfo();
            if (operator==null){
                operator = SpringUtil.getSystemOperator();
            }
            importTaskModel.setCityCodeList(operator.getAreaList());
            importTaskModel.setUserAuthHouseList(operator.getAuthHouseList());
            importTaskModel.setUserAuthIdentityList(operator.getAuthIdentityList());
            importTaskModel.setCreateUserId(Long.valueOf(operator.getUserId()));
            importTaskModel.setUpdateUserId(operator.getUserId());
            return fileHandleService.handUserImport(request,importTaskModel);
        }catch (Exception e){
            logger.error("import userInfo error",e);
            return getErrorResult();
        }
    }

    @RequiresPermission(value="ROLE_PRE_HOUSE_IMPORT")
    @LogAction(module=HOUSE_MODULE_NAME,type=SystemActionLogType.IMPORT)
    @RequestMapping(value = "houseInfo",method = {  RequestMethod.POST },produces = {"application/json;charset=UTF-8"})
    public ResultDto handleHouseImport( HttpServletRequest request , HttpServletResponse response, HouseImportTaskModel importTaskModel){

        try {
            importTaskModel.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
            importTaskModel.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
            importTaskModel.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
            importTaskModel.setCreateUserId((long)SpringUtil.getSystemOperator().getUserId());
            importTaskModel.setUpdateUserId(SpringUtil.getSystemOperator().getUserId());
            importTaskModel.setAppId(SpringUtil.getSystemOperator().getAppId());
            importTaskModel.setDataPermissionId(SpringUtil.getSystemOperator().getDataPermissionId());
            importTaskModel.setDataPermissionToken(SpringUtil.getSystemOperator().getDataPermissionToken());
            importTaskModel.setDataPermissionName(SpringUtil.getSystemOperator().getDataPermissionName());
            importTaskModel.setDataPermissionDesc(SpringUtil.getSystemOperator().getDataPermissionDesc());
            importTaskModel.setPermissionMethodUrl(SpringUtil.getSystemOperator().getPermissionMethodUrl());
            importTaskModel.setUserToken(SpringUtil.getSystemOperator().getUserToken());
            importTaskModel.setDataPermissionSettingList(SpringUtil.getAuthHomeSetting());
            ResultDto resultDto = fileHandleService.handHouseImport(request,importTaskModel);
            return resultDto;
        }catch (Exception e){
            logger.error("import houseInfo error",e);
            return getErrorResult();
        }
    }

    @RequestMapping(value = "getStatus",method = {  RequestMethod.POST },produces = {"application/json;charset=UTF-8"})
    public FileImportResult handleImport(Long userId,Integer type){

        try {
            userId =Long.valueOf(SpringUtil.getSystemOperator().getUserId());
            return fileHandleService.getImportProcess(userId,type);
        }catch (Exception e){
            logger.error("get userInfo error",e);
            return null;
        }
    }

}
