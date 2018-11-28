package com.aotain.datamanagerweb.controller.houseinfo;

import java.util.*;

import javax.servlet.http.HttpServletRequest;

import com.aotain.datamanagerweb.service.system.SystemLogManageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.aotain.cu.serviceapi.dto.AjaxValidationResult;
import com.aotain.cu.serviceapi.dto.HouseGatewayInformationDTO;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.datamanagerweb.annotation.LogAction;
import com.aotain.datamanagerweb.annotation.RequiresPermission;
import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.datamanagerweb.service.houseinfo.HouseLinkInfoServiceApi;
import com.aotain.datamanagerweb.utils.SpringUtil;
import com.aotain.login.support.Authority;

/**
 * 机房链路
 * @author silence
 * @time 2018年7月28日
 */
@Component
@Controller
@RequestMapping(value = "/houseLink")
public class HouseLinkInfoController {
	
	private static final String MODULE_NAME = "机房链路";

    @Autowired
    private HouseLinkInfoServiceApi houseLinkInfomationService;

	@Autowired
	private SystemLogManageService systemLogManageService;
    
    @RequestMapping(value = "/index",method = RequestMethod.GET)
    public String getIndex(){
        return "/houseinfo/houseLink";
    }

    @RequiresPermission(value="ROLE_PRE_HOUSE_LINK_QUERY")
    @RequestMapping(value = "/listHouseLink",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.READ)
    public PageResult<HouseGatewayInformationDTO> getHouseLinkInfoList(HouseGatewayInformationDTO dto){
    	dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
    	dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
    	dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        return houseLinkInfomationService.getHouseLinkInfoList(dto);
    }
    
    @RequiresPermission(value="ROLE_PRE_HOUSE_LINK_ADD")
	@RequestMapping(value = "/insert", method = { RequestMethod.POST })
	@ResponseBody
	@LogAction(module=MODULE_NAME,type=SystemActionLogType.CREATE)
	public ResultDto insert(HttpServletRequest request) {
		String params = request.getParameter("params");
		if (params == null) {
			return null;
		}
		HouseGatewayInformationDTO jo = null;
		Map<String, String> map = null;
		String[] dataArr = params.split(",");
		List<HouseGatewayInformationDTO> list = new ArrayList<HouseGatewayInformationDTO>();
		for (String str : dataArr) {
			map = new HashMap<String, String>();
			String[] poArr = str.split("&");
			for (String temp : poArr) {
				String[] mapArr = temp.split("=");
				map.put(mapArr[0], mapArr[1]);
			}
			jo = new HouseGatewayInformationDTO();
			initHouseLinkParams(request, jo, map);
			list.add(jo);
		}
		ResultDto result =  houseLinkInfomationService.insert(list);
		if(result.getResultCode()==0){
			Set<String> keys = result.getAjaxValidationResultMap().keySet();
			for(String key: keys){
				systemLogManageService.dataLog("gatewayId", SystemActionLogType.CREATE, "机房-链路信息",  result.getAjaxValidationResultMap().get(key).getPid().toString());
			}
		}
		return result;
	}

	private void initHouseLinkParams(HttpServletRequest request, HouseGatewayInformationDTO jo,
			Map<String, String> map) {
		jo.setLinkNo(map.get("linkNo"));
		jo.setHouseId(Long.parseLong(map.get("houseId")));
		jo.setBandWidth(Long.parseLong(map.get("bandWidth")));
		jo.setGatewayIP(map.get("gatewayIP"));
		jo.setHouseName(map.get("houseName"));
		jo.setCreateUserId(Authority.getUserDetailInfo(request).getUserId());
		jo.setAreaCode(map.get("areaCode"));
		jo.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
		jo.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
		jo.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
		jo.setUpdateUserId(Authority.getUserDetailInfo(request).getUserId());
		jo.setLinkType(1);
	}

    
	@RequiresPermission(value="ROLE_PRE_HOUSE_LINK_DEL")
    @RequestMapping(value ="/delete", method = {  RequestMethod.POST })
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.DELETE)
    public ResultDto delete(String linkIds){
    	if(linkIds==null||linkIds==""){
    		return new ResultDto();
    	}
    	String[] idArr = linkIds.split(",");
    	List<HouseGatewayInformationDTO> links = new ArrayList<HouseGatewayInformationDTO>();
    	HouseGatewayInformationDTO dto = null;
    	for(String id:idArr){
    		dto = new HouseGatewayInformationDTO();
    		dto.setGatewayId(Long.parseLong(id));
    		dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        	dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        	dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
    		links.add(dto);
    	}
		ResultDto result = houseLinkInfomationService.delete(links);
		if(result.getResultCode()==0){
			systemLogManageService.dataLog("gatewayId", SystemActionLogType.DELETE, "机房-链路信息",  linkIds);
		}
		return result;
    }
    
	@RequiresPermission(value="ROLE_PRE_HOUSE_LINK_UPDATE")
    @RequestMapping(value ="/update", method = {  RequestMethod.POST })
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.UPDATE)
    public ResultDto update(HouseGatewayInformationDTO dto,HttpServletRequest  request){
    	dto.setUpdateTime(new Date());
    	dto.setUpdateUserId(Authority.getUserDetailInfo(request).getUserId());
    	dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
    	dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
    	dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
    	List<HouseGatewayInformationDTO> list = new ArrayList<HouseGatewayInformationDTO>();
    	list.add(dto);
		ResultDto result =  houseLinkInfomationService.update(list);
		if(result.getResultCode()==0){
			systemLogManageService.dataLog("gatewayId", SystemActionLogType.UPDATE, "机房-链路信息",  dto.getGatewayId().toString());
		}
		return result;
    }
    
    @RequestMapping(value ="/validate", method = {  RequestMethod.POST })
    @ResponseBody
    public AjaxValidationResult validate(HouseGatewayInformationDTO dto){
    	dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
    	dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
    	dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        return houseLinkInfomationService.validate(dto);
    }

}
