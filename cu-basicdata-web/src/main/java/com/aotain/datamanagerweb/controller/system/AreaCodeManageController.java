package com.aotain.datamanagerweb.controller.system;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.aotain.cu.serviceapi.dto.AjaxValidationResult;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.datamanagerweb.annotation.RequiresPermission;
import com.aotain.datamanagerweb.dto.dic.AreaModel;
import com.aotain.datamanagerweb.service.system.AreaCodeInfoService;
import com.aotain.datamanagerweb.utils.DataValidateUtils;

/**
 * 地市码管理
 * 
 * @author silence
 * @time 2018年8月9日
 */
@Component
@Controller
@RequestMapping(value = "/areaCode")
public class AreaCodeManageController {

	@Autowired
	private AreaCodeInfoService areaCodeInfoService;
	
	
	private static final int MC_LENGTH=512;

	@RequestMapping(value = "/index", method = RequestMethod.GET)
	public String getIndex(HttpServletRequest request, AreaModel areaModel) {
		return "/system/areaCode";
	}

	@RequiresPermission(value = "ROLE_AREACODE_QUERY")
	@RequestMapping(value = "/listAreaCode", method = RequestMethod.POST)
	@ResponseBody
	public PageResult<AreaModel> getHouseLinkInfoList(AreaModel dto, HttpServletRequest request) {
		return areaCodeInfoService.getAreaCodeInfoList(dto);
	}

	@RequestMapping(value = "/insert", method = { RequestMethod.POST })
	@ResponseBody
	public ResultDto insert(HttpServletRequest request, AreaModel dto) {
    	String params = request.getParameter("params");
        return areaCodeInfoService.insertXZQYDM(params);
	}


	@RequestMapping(value = "/update", method = { RequestMethod.POST })
	@ResponseBody
	public ResultDto update(HttpServletRequest request, AreaModel areaModel) {
		return areaCodeInfoService.updateById(areaModel);
	}

	@RequestMapping(value = "/delete", method = { RequestMethod.POST })
	@ResponseBody
	public ResultDto delete(String ids) {
		ResultDto resultDto = new ResultDto();
		if(ids==null||ids==""){
			resultDto.setResultCode(ResultDto.ResultCodeEnum.ERROR.getCode());
			resultDto.setResultMsg("删除数据为空");
			return resultDto;
		}
		List<Long> idList;
		try {
			String[] idArr = ids.split(",");
			idList = new ArrayList<>();
			for(String str :idArr){
				idList.add(Long.parseLong(str));
			}
			resultDto = areaCodeInfoService.deleteByIds(idList);
		} catch (NumberFormatException e) {
			resultDto.setResultCode(ResultDto.ResultCodeEnum.ERROR.getCode());
			resultDto.setResultMsg("删除失败");
		}
		return resultDto;
	}

	@RequestMapping(value="getAreaTree",method=RequestMethod.POST)
	@ResponseBody
	public List<Object> getAreaTree(AreaModel areaModel){	
		return areaCodeInfoService.listSourArea(areaModel);
	}
	
	@RequestMapping(value="validate",method=RequestMethod.POST)
	@ResponseBody
	public AjaxValidationResult validate(AreaModel dto){
		Map<String, Object[]> errorsArgsMap = new LinkedHashMap<String, Object[]>(0);
		List<ObjectError> errors = new ArrayList<ObjectError>(0);
		
		if(dto.getCode()==null||dto.getCode()==""){
			errorsArgsMap.put("code",new Object[]{"区域编码为空"});
		}else{
			if(!validateCode(dto.getCode())){
				errorsArgsMap.put("code",new Object[]{"请输入6位整型数值"});
			}else if(areaCodeInfoService.isExistXZQYDMByCode(dto)){
				errorsArgsMap.put("code",new Object[]{"区域编码已存在"});
			}
		}
		if(dto.getMc()==null||dto.getMc()==""){
			errorsArgsMap.put("mc",new Object[]{"区域名称为空"});
		}else {
			if(areaCodeInfoService.isExistXZQYDMByMCAndParentCode(dto)){
				errorsArgsMap.put("mc",new Object[]{"同一区域下的地市名称已存在"});
			}
			if(DataValidateUtils.getValueCharLength(dto.getMc())>MC_LENGTH){
				errorsArgsMap.put("mc",new Object[]{"区域名称超过长度限制"});
			}
		}
		if(dto.getPostCode()==null||dto.getPostCode()==""){
			errorsArgsMap.put("postCode",new Object[]{"邮政编码为空"});
		}else{
			if(!validateCode(dto.getPostCode())){
				errorsArgsMap.put("postCode",new Object[]{"请输入6位整型数值"});
			} 
		}
		return new AjaxValidationResult(errors, errorsArgsMap);
	}
	
	@RequestMapping(value="setPronvice",method=RequestMethod.POST)
	@ResponseBody
	public Boolean setPronvice(String code){
		return areaCodeInfoService.setPronvice(code);
	}
	
	private boolean validateCode(String areaCode) {
		try {
			if(areaCode.length()!=6){
				return false;
			}
			Long code = Long.parseLong(areaCode);
			if(code<0){
				return false;
			}
		} catch (NumberFormatException e) {
			return false;
		}
		return true;
	}

}
