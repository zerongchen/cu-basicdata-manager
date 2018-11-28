package com.aotain.datamanagerweb.controller.houseinfo;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.aotain.datamanagerweb.service.system.SystemLogManageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.aotain.cu.serviceapi.dto.AjaxValidationResult;
import com.aotain.cu.serviceapi.dto.HouseIPSegmentInforDTO;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.HouseIPSegmentInformation;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.datamanagerweb.annotation.LogAction;
import com.aotain.datamanagerweb.annotation.RequiresPermission;
import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.datamanagerweb.controller.CommonHandlerController;
import com.aotain.datamanagerweb.serviceapi.PreHouseIPSegmentApi;
import com.aotain.datamanagerweb.utils.IpUtils;
import com.aotain.datamanagerweb.utils.SpringUtil;

@Controller
public class HouseIPSegmentController extends CommonHandlerController {
	
	private static final String MODULE_NAME = "机房IP地址段";

	@Autowired
	private PreHouseIPSegmentApi preHouseIPSegmentApi;

	@Autowired
	private SystemLogManageService systemLogManageService;

	@RequestMapping(value = "/houseinfo/houseIp")
	public ModelAndView index() {
		ModelAndView mav = new ModelAndView("/houseinfo/houseIp");
		return mav;
	}

	@RequiresPermission(value="ROLE_PRE_HOUSE_IPSEG_QUERY")
	@RequestMapping(value = "/serviceapi/pre/house/ipSegment/query", method = { RequestMethod.POST })
	@ResponseBody
	@LogAction(module=MODULE_NAME,type=SystemActionLogType.READ)
	public PageResult<HouseIPSegmentInforDTO> queryRack(HouseIPSegmentInforDTO rack) {
		rack.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
		rack.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
		rack.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
		return preHouseIPSegmentApi.query(rack);
	}

	@RequiresPermission(value="ROLE_PRE_HOUSE_IPSEG_ADD")
	@RequestMapping(value = "/serviceapi/pre/house/ipSegment/insert", method = { RequestMethod.POST })
	@ResponseBody
	@LogAction(module=MODULE_NAME,type=SystemActionLogType.CREATE)
	public ResultDto insert(@RequestBody HouseIPSegmentInforDTO[] dto) {
		List<HouseIPSegmentInforDTO> list = new ArrayList<>();
		ResultDto result = new ResultDto();
		List<HouseIPSegmentInformation> ipList = new ArrayList<HouseIPSegmentInformation>();
		for (HouseIPSegmentInforDTO obj : dto) {
			obj.setCreateUserId(SpringUtil.getSystemOperator().getUserId());
			obj.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
			obj.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
			obj.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
			if(IpUtils.isIpAddress(obj.getStartIP())&&IpUtils.isIpAddress(obj.getEndIP())&&!IpUtils.isStartIPOverEndIp(obj.getStartIP(), obj.getEndIP())){
				ipList.add(obj);
			}
			list.add(obj);
		}
		/*for(int i=0;i<ipList.size()-1;++i){
			HouseIPSegmentInformation preDto = ipList.get(i);
			for(int j=i+1;j<ipList.size();++j){
				HouseIPSegmentInformation afterDto = ipList.get(j);
				if(!(IpUtils.isStartIPOverEndIp(afterDto.getStartIP(),preDto.getEndIP())||IpUtils.isStartIPOverEndIp(preDto.getStartIP(),afterDto.getEndIP()))){
					//前者IP与后者当不满足起始IP比终止IP大或者终止IP比起始IP小时为重复情况
					result.setResultCode(ResultDto.ResultCodeEnum.ERROR_CONFLICT.getCode());
					result.setResultMsg(afterDto.getStartIP()+"-"+afterDto.getEndIP());
					return result;
				}
			}
		}*/
		result = preHouseIPSegmentApi.insert(list);
		if(result.getResultCode()==0){
			Set<String> keys = result.getAjaxValidationResultMap().keySet();
			for(String key: keys){
				systemLogManageService.dataLog("houseSeqId", SystemActionLogType.CREATE, "机房-IP地址段信息",  result.getAjaxValidationResultMap().get(key).getPid().toString());
			}
		}
		return result;
	}

	@RequiresPermission(value="ROLE_PRE_HOUSE_IPSEG_UPDATE")
	@RequestMapping(value = "/serviceapi/pre/house/ipSegment/update", method = { RequestMethod.POST })
	@ResponseBody
	@LogAction(module=MODULE_NAME,type=SystemActionLogType.UPDATE)
	public ResultDto update(HouseIPSegmentInforDTO ass) {
		ass.setUpdateUserId(SpringUtil.getSystemOperator().getUserId());
		ass.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
		ass.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
		ass.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
		List<HouseIPSegmentInforDTO> ipSegmentInforDTOs = new ArrayList<HouseIPSegmentInforDTO>();
		ipSegmentInforDTOs.add(ass);
		ResultDto result =  preHouseIPSegmentApi.update(ipSegmentInforDTOs);
		if(result.getResultCode()==0){
			systemLogManageService.dataLog("houseSeqId", SystemActionLogType.UPDATE, "机房-IP地址段信息",  ass.getIpSegId().toString());
		}
		return result;
	}

	@RequiresPermission(value="ROLE_PRE_HOUSE_IPSEG_DEL")
	@RequestMapping(value = "/serviceapi/pre/house/ipSegment/delete", method = { RequestMethod.POST })
	@ResponseBody
	@LogAction(module=MODULE_NAME,type=SystemActionLogType.DELETE)
	public ResultDto delete(String ids) {
		if(ids==null||ids==""){
    		return new ResultDto();
    	}
    	String[] idArr = ids.split(",");
    	List<HouseIPSegmentInforDTO> list = new ArrayList<HouseIPSegmentInforDTO>();
    	HouseIPSegmentInforDTO dto = null;
    	for(String id:idArr){
    		dto = new HouseIPSegmentInforDTO();
    		dto.setIpSegId(Long.parseLong(id));
    		dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        	dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        	dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        	list.add(dto);
    	}
		ResultDto result =  preHouseIPSegmentApi.delete(list);
		if(result.getResultCode()==0){
			systemLogManageService.dataLog("houseSeqId", SystemActionLogType.DELETE, "机房-IP地址段信息",  ids);
		}
		return result;
	}

	@RequestMapping(value = "/serviceapi/pre/house/ipSegment/validate", method = { RequestMethod.POST })
	@ResponseBody
	public AjaxValidationResult validate(@RequestBody HouseIPSegmentInforDTO[] dto) {
		AjaxValidationResult result = new AjaxValidationResult();
		for (HouseIPSegmentInforDTO obj : dto) {
			obj.setAddType(1);
			obj.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
			obj.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
			obj.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
			result = preHouseIPSegmentApi.validate(obj);
			if (!result.getErrorsArgsMap().isEmpty()) {
				result.setOutIndex(obj.getOutIndex());
				break;
			}
		}
		return result;
	}

	@RequestMapping(value = "/serviceapi/pre/house/ipSegment/updateValidate", method = { RequestMethod.POST })
	@ResponseBody
	public AjaxValidationResult updateValidate(HouseIPSegmentInforDTO dto) {
		dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
		dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
		dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
		return preHouseIPSegmentApi.validate(dto);
	}

}
