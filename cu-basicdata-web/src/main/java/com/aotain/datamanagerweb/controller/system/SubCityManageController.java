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
import com.aotain.datamanagerweb.model.ChinaArea;
import com.aotain.datamanagerweb.service.system.SubCityInfoService;
import com.aotain.datamanagerweb.utils.DataValidateUtils;

/**
 * 
 * 隶属单位管理
 * 
 * @author silence
 * @time 2018年8月9日
 */
@Component
@Controller
@RequestMapping(value = "/subCity")
public class SubCityManageController {

	private static final int  AREANAME_LENGTH=100;
	@Autowired
	private SubCityInfoService subCityInfoService;
	
	@RequestMapping(value = "/index", method = RequestMethod.GET)
	public String getIndex() {
		return "/system/subCity";
	}

	@RequiresPermission(value = "ROLE_SUBUNIT_QUERY")
	@RequestMapping(value = "/listSubCity", method = RequestMethod.POST)
	@ResponseBody
	public PageResult<ChinaArea> getHouseLinkInfoList(ChinaArea dto, HttpServletRequest request) {
		return subCityInfoService.getHouseLinkInfoList(dto);
	}

	@RequiresPermission(value = "ROLE_SUBUNIT_ADD")
	@RequestMapping(value = "/insert", method = { RequestMethod.POST })
	@ResponseBody
	public ResultDto insert(HttpServletRequest request, ChinaArea dto) {
		String params = request.getParameter("params");
		return subCityInfoService.insert(params,request);
	}

	

	@RequiresPermission(value = "ROLE_SUBUNIT_UPDATE")
	@RequestMapping(value = "/update", method = { RequestMethod.POST })
	@ResponseBody
	public ResultDto update(HttpServletRequest request, ChinaArea dto) {
		return subCityInfoService.update(dto,request);
	}

	@RequiresPermission(value = "ROLE_SUBUNIT_DEL")
	@RequestMapping(value = "/delete", method = { RequestMethod.POST })
	@ResponseBody
	public ResultDto delete(HttpServletRequest request,String ids) {
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
			resultDto = subCityInfoService.deleteByIds(idList,request);
		} catch (NumberFormatException e) {
			resultDto.setResultCode(ResultDto.ResultCodeEnum.ERROR.getCode());
			resultDto.setResultMsg("删除失败");
		}
		return resultDto;
	}

	
	@RequestMapping(value="validate",method=RequestMethod.POST)
	@ResponseBody
	public AjaxValidationResult validate(ChinaArea dto){
		Map<String, Object[]> errorsArgsMap = new LinkedHashMap<String, Object[]>(0);
		List<ObjectError> errors = new ArrayList<ObjectError>(0);
		if(dto.getAreaCode()==null||dto.getAreaCode()==""){
			errorsArgsMap.put("areaCode",new Object[]{"单位编码为空"});
		}else{
			if(!validateCode(dto.getAreaCode())){
				errorsArgsMap.put("areaCode",new Object[]{"单位编码不合法"});
			}else if(subCityInfoService.isExistChinaAreaCode(dto)){
				errorsArgsMap.put("areaCode",new Object[]{"单位编码已存在"});
			}
		}
		if(dto.getAreaName()==null||dto.getAreaName()==""){
			errorsArgsMap.put("areaName",new Object[]{"隶属单位名称为空"});
		}else{
			if(subCityInfoService.isExistChinaAreaName(dto)){
				errorsArgsMap.put("areaName",new Object[]{"隶属单位名称已存在"});
			}else if(DataValidateUtils.getValueCharLength(dto.getAreaName())>AREANAME_LENGTH){
				errorsArgsMap.put("areaName",new Object[]{"隶属单位名称超过长度限制"});
			}
		}
		return new AjaxValidationResult(errors, errorsArgsMap);
	}

	private boolean validateCode(String areaCode) {
		try {
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
