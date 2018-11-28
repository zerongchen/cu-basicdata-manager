package com.aotain.datamanagerweb.controller.rptUser;

import com.aotain.cu.serviceapi.dto.*;
import com.aotain.datamanagerweb.annotation.RequiresPermission;
import com.aotain.datamanagerweb.utils.SpringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.datamanagerweb.annotation.LogAction;
import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.datamanagerweb.service.rptUser.RptUserServiceApi;

@Component
@Controller
@RequestMapping(value = "/rptUser")
public class RptUserInfoController {
	
	private static final String USER_MAIN_MODULE_NAME = "上报用户主体";
	private static final String USER_SERVICE_MODULE_NAME = "上报用户服务";
	private static final String USER_HH_MODULE_NAME = "上报用户带宽";
	private static final String USER_VITUAL_MODULE_NAME = "上报用户虚拟机";
	private static final String USER_IPSEG_MODULE_NAME = "上报用户IP";

	@Autowired
	private RptUserServiceApi userServiceApi;
	
	@RequestMapping(value = "/userService/index",method = RequestMethod.GET)
    public String getUserServiceIndex(){
        return "/rptUser/user_service";
    }
	
	@RequestMapping(value = "/userHH/index",method = RequestMethod.GET)
    public String getUserHHIndex(){
        return "/rptUser/user_hh";
    }
	
	@RequestMapping(value = "/userVirtual/index",method = RequestMethod.GET)
    public String getUserVirtualIndex(){
        return "/rptUser/user_virtual";
    }
	@RequestMapping(value = "/userIp/index",method = RequestMethod.GET)
    public String getUserIpIndex(){
        return "/rptUser/user_ip";
    }

    @RequestMapping(value = "/userInfo/index",method = RequestMethod.GET)
    public String getUserInfoIndex(){
        return "/rptUser/user_info";
    }

    /**
     * 查询上报用户信息
     *
     */
    @RequestMapping(value ="/userInfo/list", method = {  RequestMethod.POST })
    @ResponseBody
    @RequiresPermission(value = "RPT_USER_QUERY")
    @LogAction(module=USER_MAIN_MODULE_NAME,type=SystemActionLogType.READ)
    public PageResult<UserInformationDTO> queryUserInfo(UserInformationDTO dto) {
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        return userServiceApi.queryUserInfo(dto);
    }

	
	/**
	 * 查询上报用户服务信息
	 * 
	 */
	@RequestMapping(value ="/userService/list", method = {  RequestMethod.POST })
    @ResponseBody
    @RequiresPermission(value = "RPT_USER_SERVICE_QUERY")
    @LogAction(module=USER_SERVICE_MODULE_NAME,type=SystemActionLogType.READ)
    public PageResult<UserServiceInformationDTO> queryUserService(UserServiceInformationDTO dto) {
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
	    return userServiceApi.queryUserService(dto);
    }
	
	/**
	 * 查询上报用户虚拟主机信息
	 * 
	 */
	@LogAction(module=USER_VITUAL_MODULE_NAME,type=SystemActionLogType.READ)
	@RequestMapping(value ="/userVirtual/list", method = {  RequestMethod.POST })
    @ResponseBody
    @RequiresPermission(value = "RPT_USER_VIRTUAL_QUERY")
    public PageResult<UserVirtualInformationDTO> queryUserVirtual(UserVirtualInformationDTO dto) {
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        return userServiceApi.queryUserVirtual(dto);
    }
	
	/**
	 * 查询上报用户带宽信息
	 * 
	 */
	@LogAction(module=USER_HH_MODULE_NAME,type=SystemActionLogType.READ)
	@RequestMapping(value ="/userHH/list", method = {  RequestMethod.POST })
    @ResponseBody
    @RequiresPermission(value = "RPT_USER_HH_QUERY")
    public PageResult<UserBandwidthInformationDTO> queryUserHH(UserBandwidthInformationDTO dto) {
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
	    return userServiceApi.queryUserHH(dto);
    }
	/**
	 * 查询上报用户Ip信息
	 * 
	 */
	@LogAction(module=USER_IPSEG_MODULE_NAME,type=SystemActionLogType.READ)
	@RequestMapping(value ="/userIp/list", method = {  RequestMethod.POST })
    @ResponseBody
    public PageResult<HouseIPSegmentInforDTO> queryUserIp(HouseIPSegmentInforDTO dto) {
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
	    return userServiceApi.queryUserIp(dto);
    }
	
}
