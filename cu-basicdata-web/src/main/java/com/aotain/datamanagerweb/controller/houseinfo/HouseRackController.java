package com.aotain.datamanagerweb.controller.houseinfo;

import java.util.*;

import com.aotain.datamanagerweb.service.system.SystemLogManageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.aotain.cu.serviceapi.dto.AjaxValidationResult;
import com.aotain.cu.serviceapi.dto.HouseFrameInformationDTO;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.HouseUserFrameInformation;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.datamanagerweb.annotation.LogAction;
import com.aotain.datamanagerweb.annotation.RequiresPermission;
import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.datamanagerweb.controller.CommonHandlerController;
import com.aotain.datamanagerweb.service.CommonServiceImpl;
import com.aotain.datamanagerweb.serviceapi.PreHouseRackApi;
import com.aotain.datamanagerweb.utils.SpringUtil;

@Controller
public class HouseRackController extends CommonHandlerController {
	
	private static final String MODULE_NAME = "机房机架";

    @Autowired
    private PreHouseRackApi preHouseRackApi;
    
    @Autowired
    private CommonServiceImpl commService;

	@Autowired
	private SystemLogManageService systemLogManageService;

    @RequestMapping(value ="/houseinfo/houseRack")
    public ModelAndView index() {
        ModelAndView mav = new ModelAndView("/houseinfo/houseRack");
        return mav;
    }

    @RequiresPermission(value="ROLE_PRE_HOUSE_FRAME_QUERY")
    @RequestMapping(value = "/serviceapi/pre/house/rack/query", method = { RequestMethod.POST })
	@ResponseBody
	@LogAction(module=MODULE_NAME,type=SystemActionLogType.READ)
	public PageResult<HouseFrameInformationDTO> queryRack(HouseFrameInformationDTO rack) {
		rack.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
		rack.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
		rack.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
		return preHouseRackApi.queryRack(rack);
	}

    @RequiresPermission(value="ROLE_PRE_HOUSE_FRAME_ADD")
    @RequestMapping(value = "/serviceapi/pre/house/rack/insert", method = { RequestMethod.POST })
	@ResponseBody
	@LogAction(module=MODULE_NAME,type=SystemActionLogType.CREATE)
	public ResultDto insert(@RequestBody HouseFrameInformationDTO[] dto) {
    	List<HouseFrameInformationDTO> list = new ArrayList<HouseFrameInformationDTO>();
		for (HouseFrameInformationDTO obj : dto) {
			obj.setCreateUserId(SpringUtil.getSystemOperator().getUserId());
			obj.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
			obj.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
			obj.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
			/*if(frameMap.containsKey(obj.getFrameName())){
				resultDto = new ResultDto();
				resultDto.setResultCode(ResultDto.ResultCodeEnum.ERROR_CONFLICT.getCode());
				resultDto.setResultMsg("存在重复机架名称："+obj.getFrameName());
				return resultDto;
			}else{
				frameMap.put(obj.getFrameName(), obj.getFrameName());
			}
			if(obj.getUserFrameList()!=null&&obj.getUserFrameList().size()>0){
				for(HouseUserFrameInformation uFdto:obj.getUserFrameList()){
					if(uFdto.getUserName()!=null&&uFdto.getUserName()!=""){
						String key = obj.getFrameName()+uFdto.getUserName();
						if(frameMap.containsKey(key)){
							resultDto = new ResultDto();
							resultDto.setResultCode(ResultDto.ResultCodeEnum.ERROR_CONFLICT.getCode());
							resultDto.setResultMsg("机架'"+obj.getFrameName()+"'重复录入单位名称："+uFdto.getUserName());
							return resultDto;
						}else{
							frameMap.put(key,key);
						}
					}
				}
			}*/
			list.add(obj);
		}
		ResultDto result =  preHouseRackApi.insert(list);
		if(result.getResultCode()==0){
			Set<String> keys = result.getAjaxValidationResultMap().keySet();
			for(String key: keys){
				systemLogManageService.dataLog("frameId", SystemActionLogType.CREATE, "机房-机架信息",  result.getAjaxValidationResultMap().get(key).getPid().toString());
			}
		}
		return result;
	}

    @RequiresPermission(value="ROLE_PRE_HOUSE_FRAME_UPDATE")
    @RequestMapping(value = "/serviceapi/pre/house/rack/update", method = { RequestMethod.POST })
	@ResponseBody
	@LogAction(module=MODULE_NAME,type=SystemActionLogType.UPDATE)
	public ResultDto update(@RequestBody HouseFrameInformationDTO ass) {
		ass.setUpdateUserId(SpringUtil.getSystemOperator().getUserId());
		ass.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
		ass.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
		ass.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
		List<HouseFrameInformationDTO> list = new ArrayList<HouseFrameInformationDTO>();
		list.add(ass);
		ResultDto result =  preHouseRackApi.update(list);
		if(result.getResultCode()==0){
			systemLogManageService.dataLog("frameId", SystemActionLogType.UPDATE, "机房-机架信息",  ass.getFrameId().toString());
		}
		return result;
	}

    @RequiresPermission(value="ROLE_PRE_HOUSE_FRAME_DEL")
    @RequestMapping(value ="/serviceapi/pre/house/rack/delete", method = {  RequestMethod.POST })
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.DELETE)
    public ResultDto delete(String ids){
    	if(ids==null||ids==""){
    		return new ResultDto();
    	}
    	String[] idArr = ids.split(",");
    	List<HouseFrameInformationDTO> list = new ArrayList<HouseFrameInformationDTO>();
    	HouseFrameInformationDTO dto = null;
    	for(String id:idArr){
    		dto = new HouseFrameInformationDTO();
    		dto.setFrameId(Long.parseLong(id));
    		dto.setCreateUserId(SpringUtil.getSystemOperator().getUserId());
    		dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        	dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        	dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        	list.add(dto);
    	}
		ResultDto result = preHouseRackApi.delete(list);
		if(result.getResultCode()==0){
			systemLogManageService.dataLog("frameId", SystemActionLogType.DELETE, "机房-机架信息",  ids);
		}
		return result;
    }


    @RequestMapping(value = "/serviceapi/pre/house/rack/validate", method = { RequestMethod.POST })
	@ResponseBody
	public AjaxValidationResult validate(@RequestBody HouseFrameInformationDTO[] dto) {
		AjaxValidationResult result = new AjaxValidationResult();
		for (HouseFrameInformationDTO obj : dto) {
			obj.setAddType(1);
			obj.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
			obj.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
			obj.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
			result = preHouseRackApi.validate(obj);
			if (!result.getErrorsArgsMap().isEmpty()) {
				result.setOutIndex(obj.getOutIndex());
				break;
			}
		}
		return result;
	}

    @RequestMapping(value = "/serviceapi/pre/house/rack/updateValidate", method = { RequestMethod.POST })
	@ResponseBody
	public AjaxValidationResult updateValidate(HouseFrameInformationDTO dto) {
		dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
		dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
		dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
		return preHouseRackApi.validate(dto);
	}
    
    @RequestMapping(value = "/serviceapi/pre/house/rack/getUserFrame", method = { RequestMethod.POST })
   	@ResponseBody
   	public List<HouseUserFrameInformation> getUserFrameList(HouseFrameInformationDTO dto) {
   		return commService.listUserFrame(dto);
   	}

}
