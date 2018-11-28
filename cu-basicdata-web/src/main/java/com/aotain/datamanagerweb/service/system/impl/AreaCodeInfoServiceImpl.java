package com.aotain.datamanagerweb.service.system.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.datamanagerweb.dto.dic.AreaModel;
import com.aotain.datamanagerweb.mapper.dic.DictionaryMapper;
import com.aotain.datamanagerweb.service.system.AreaCodeInfoService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

@Service(value="areaCodeService")
public class AreaCodeInfoServiceImpl implements AreaCodeInfoService{

	@Autowired
	private DictionaryMapper mapper;
	
	@Override
	public PageResult<AreaModel> getAreaCodeInfoList(AreaModel dto) {
		PageResult<AreaModel> result = new PageResult<AreaModel>();
		List<AreaModel> info = new ArrayList<AreaModel>();
		if(dto.getIsPaging().equals(1)){
			PageHelper.startPage(dto.getPageIndex(), dto.getPageSize());
            info = mapper.getAreaCodeList(dto);
            PageInfo<AreaModel> pageResult = new PageInfo<AreaModel>(info);
            result.setTotal(pageResult.getTotal());
		}else{
			info = mapper.getAreaCodeList(dto);
		}
		result.setRows(info);
		return result;
	}

	@Override
	public ResultDto insertXZQYDM(String params) {
		if(params==null){
    		return null;
    	}
    	ResultDto result = new ResultDto();
    	List<ResultDto> resultDtos = new ArrayList<ResultDto>();
		ResultDto resultDto = null;
    	AreaModel jo = null;
    	Map<String, String> map = null;
    	Map<String, String> validateMap = new HashMap();
    	String[] dataArr = params.split(",");
    	List<AreaModel> list = new ArrayList<>();
    	for(String str :dataArr){
    		map = new HashMap<String, String>();
    		String[] poArr = str.split("&");
    		for(String temp: poArr){
    			String[] mapArr = temp.split("=");
    			map.put(mapArr[0], mapArr[1]);
    		}
    		jo = new AreaModel();
    		jo.setCode(map.get("code"));
    		jo.setPostCode(map.get("postCode"));
    		jo.setMc(map.get("mc"));
    		jo.setParentCode(map.get("parentCode"));
    		if(validateMap.containsKey("MC_"+jo.getMc())){
    			result =new ResultDto();
				result.setResultCode(ResultDto.ResultCodeEnum.ERROR_CONFLICT.getCode());
				result.setResultMsg("存在重复区域名称["+jo.getMc()+"]");
				return result;
    		}else{
    			validateMap.put("MC_"+jo.getMc(), "MC_"+jo.getMc());
    		}
    		if(validateMap.containsKey("CODE_"+jo.getCode())){
    			result =new ResultDto();
				result.setResultCode(ResultDto.ResultCodeEnum.ERROR_CONFLICT.getCode());
				result.setResultMsg("存在重复区域编码["+jo.getCode()+"]");
				return result;
    		}else{
    			validateMap.put("CODE_"+jo.getCode(), "CODE_"+jo.getCode());
    		}
    		
    		list.add(jo);
    		if(map.get("codeLevel")!=null){
    			jo.setCodeLevel(Integer.parseInt(map.get("codeLevel")));
    		}
    		
    	}
    	
    	
    	for(AreaModel dto:list){
    		int res = mapper.insertXZQYDM(dto);
    		if(res<=0){
    			resultDto.setResultMsg("区域编码["+dto.getMc()+"]插入失败");
    		}
    		resultDtos.add(resultDto);
    	}
    	result.setResultCode(ResultDto.ResultCodeEnum.BATCH_OPERATION.getCode());
    	result.setResultMsg(JSONArray.toJSONString(resultDtos));
		return result;
	}

	@Override
	public ResultDto deleteByIds(List<Long> idList) {
		ResultDto resultDto = new ResultDto();
		resultDto.setResultCode(0);
		for(long id:idList){
			mapper.deleteXZQYDMById(id);
		}
		return resultDto;
	}

	@Override
	public ResultDto updateById(AreaModel areaModel) {
		ResultDto resultDto = new ResultDto();
		resultDto.setResultCode(0);
		int result = mapper.updateXZQYDMById(areaModel);
		if(result<=0){
			resultDto.setResultCode(1);
			resultDto.setResultMsg("修改失败！");
		}
		return resultDto;
	}

	@Override
	public List<Object> listSourArea(AreaModel areaModel) {
		List<Object> listZTree = new ArrayList<Object>();
		List<AreaModel> list = mapper.getAreaTreeList(areaModel);
		String str = "{id:'000000', pId:'0', codeLevel:'0', name:'全国'}";
		if(areaModel.getParentCode()!=null&&areaModel.getParentCode()!=""){
			str = "";
		}else{
			listZTree.add(str);
		}
		for(AreaModel area : list){
			str = "{id:'" +area.getCode() + "', pId:'"+area.getParentCode()+ "', codeLevel:'"+area.getCodeLevel()+"', name:\""+area.getMc()+"\" }";//封装ztree需要格式的字符串
			listZTree.add(str);
		}
		return listZTree;
	}

	@Override
	public boolean isExistXZQYDMByCode(AreaModel dto) {
		return mapper.findCountByCode(dto)>0?true:false;
	}

	@Override
	public Boolean setPronvice(String code) {
		if(code==null||code==""){
			return false;
		}
		try {
			//先清除原有省份设置标识
			if(emptyProvince()){
				//设置新部署省份
				int result = mapper.setPronvice(Long.parseLong(code));
				if(result<=0){
					return false;
				}
			}
		} catch (Exception e) {
			return false;
		}
		
		return true;
	}

	private Boolean emptyProvince() {
		return mapper.emptyProvince()>0?true:false;
		
	}

	@Override
	public boolean isExistXZQYDMByMCAndParentCode(AreaModel dto) {
		return mapper.findCountByMCandParentCode(dto)>0?true:false;
	}

	
}
