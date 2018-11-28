package com.aotain.datamanagerweb.service.system.impl;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.datamanagerweb.mapper.dic.DictionaryMapper;
import com.aotain.datamanagerweb.model.ChinaArea;
import com.aotain.datamanagerweb.service.system.SubCityInfoService;
import com.aotain.login.pojo.DataPermission;
import com.aotain.login.pojo.DataPermissionSetting;
import com.aotain.login.pojo.UserDetailInfo;
import com.aotain.login.support.Authority;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Service
public class SubCityInfoServiceImpl implements SubCityInfoService {

	@Autowired
	private DictionaryMapper mapper;
	
	/**
     * 当前系统在权限系统的部署id
     */
    @Value("${service.local.deployid}")
    private String deployid;
    
    /**
     * 系统地市权限
     */
    @Value("${service.local.updateUrl}")
    private String updateUrl;
    
    /**
     * 系统地市更新接口地址
     */
    @Value("${service.local.codeToken}")
    private String codeToken;
	
	@Override
	public PageResult<ChinaArea> getHouseLinkInfoList(ChinaArea dto) {
		PageResult<ChinaArea> result = new PageResult<ChinaArea>();
		List<ChinaArea> info = new ArrayList<ChinaArea>();
		if(dto.getIsPaging().equals(1)){
			PageHelper.startPage(dto.getPageIndex(), dto.getPageSize());
            info = mapper.getChinaAraList(dto);
            PageInfo<ChinaArea> pageResult = new PageInfo<ChinaArea>(info);
            result.setTotal(pageResult.getTotal());
		}else{
			info = mapper.getChinaAraList(dto);
		}
		result.setRows(info);
		return result;
	}

	@Transactional
	@Override
	public ResultDto insert(String params, HttpServletRequest request) {
		if(params==null){
    		return null;
    	}
    	ResultDto result = new ResultDto();
    	int code = ResultDto.ResultCodeEnum.BATCH_OPERATION.getCode();
    	List<ResultDto> resultDtos = new ArrayList<ResultDto>();
		ResultDto resultDto = null;
		ChinaArea jo = null;
		
		Map<String, String> validateMap = new HashMap();
    	Map<String, String> map = null;
    	List<ChinaArea> list = new ArrayList<>();
    	String[] dataArr = params.split(",");
    	try {
    	for(String str :dataArr){
    		map = new HashMap<String, String>();
    		String[] poArr = str.split("&");
    		for(String temp: poArr){
    			String[] mapArr = temp.split("=");
    			map.put(mapArr[0], mapArr[1]);
    		}
    		//初始化数据库隶属单位信息，比不过入库
    		jo = new ChinaArea();
    		jo.setAreaCode(map.get("areaCode"));
    		jo.setAreaName(map.get("areaName"));
    		if(validateMap.containsKey("MC_"+jo.getAreaName())){
    			result =new ResultDto();
				result.setResultCode(ResultDto.ResultCodeEnum.ERROR_CONFLICT.getCode());
				result.setResultMsg("存在重复隶属单位名称["+jo.getAreaName()+"]");
				return result;
    		}else{
    			validateMap.put("MC_"+jo.getAreaName(), "MC_"+jo.getAreaName());
    		}
    		if(validateMap.containsKey("CODE_"+jo.getAreaCode())){
    			result =new ResultDto();
				result.setResultCode(ResultDto.ResultCodeEnum.ERROR_CONFLICT.getCode());
				result.setResultMsg("存在重复单位编码["+jo.getAreaCode()+"]");
				return result;
    		}else{
    			validateMap.put("CODE_"+jo.getAreaCode(), "CODE_"+jo.getAreaCode());
    		}
    		
    		list.add(jo);
    		
    		resultDtos.add(resultDto);
    	}
    	
    	
    	for(ChinaArea dto:list){
    		int res = mapper.insertChinaArea(dto);
    		if(res<=0){
    			result.setResultMsg("隶属单位插入数据库错误");
    			resultDtos.add(resultDto);
    			continue;
    		}
    	}
    	Boolean flag= insertChinaAreaToPassport(request);
    	if(!flag){
    		throw new RuntimeException("同步隶属单位信息到权限系统失败！"); 
    	}
    	
		} catch (Exception e) {
			code = ResultDto.ResultCodeEnum.ERROR.getCode();
			result.setResultCode(code);
			result.setResultMsg("新增失败");
			return result;
		}
		result.setResultCode(code);
    	result.setResultMsg(JSONArray.toJSONString(resultDtos));
		return result;
	}

	@Transactional
	@Override
	public ResultDto update(ChinaArea dto, HttpServletRequest request) {
		ResultDto result = new ResultDto();
		int code = ResultDto.ResultCodeEnum.SUCCESS.getCode();
		try {
			int res = mapper.updateChinaArea(dto);
			if(res<=0){
				code = ResultDto.ResultCodeEnum.ERROR.getCode();
				result.setResultMsg("");
			}
			
			
			Boolean flag= insertChinaAreaToPassport(request);
	    	if(!flag){
	    		throw new RuntimeException("同步隶属单位信息到权限系统失败！"); 
	    	}
		} catch (Exception e) {
			code = ResultDto.ResultCodeEnum.ERROR.getCode();
			result.setResultMsg("更新失败");
		}
		result.setResultCode(code);
		return result;
	}

	@Override
	public boolean isExistChinaAreaCode(ChinaArea dto) {
		return mapper.finChinaAreaCountByCode(dto)>0?true:false;
	}

	@Transactional
	@Override
	public ResultDto deleteByIds(List<Long> idList, HttpServletRequest request) {
		ResultDto resultDto = new ResultDto();
		int code = ResultDto.ResultCodeEnum.BATCH_OPERATION.getCode();
		try {
			for(long id:idList){
				mapper.deleteChinaAreaByCode(id);
			}
			
			Boolean flag= insertChinaAreaToPassport(request);
	    	if(!flag){
	    		throw new RuntimeException("同步隶属单位信息到权限系统失败！"); 
	    	}
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultDto.setResultCode(code);
		return resultDto;
	}

	
	public static JsonObject getPaassportHttpResult(String path, String post) {
		URL url = null;
		try {
			url = new URL(path);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("POST");
			// 发送POST请求必须设置如下两行
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setRequestProperty("Content-Type", "application/json");
			// 获取URLConnection对象对应的输出流
			PrintWriter printWriter = new PrintWriter(conn.getOutputStream());
			// 发送请求参数
			printWriter.write(post);// post的参数 xx=xx&yy=yy
			// flush输出流的缓冲
			printWriter.flush();
			// 开始获取数据
			StringBuffer rBuffer = new StringBuffer();
			String lines;
			BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
			while ((lines = reader.readLine()) != null) {
				rBuffer.append(lines);
				System.out.println(lines);
			}
			JsonParser parse = new JsonParser();
			return (JsonObject) parse.parse(rBuffer.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 
	 * 写入隶属单位到权限系统
	 */
	@Override
	public Boolean insertChinaAreaToPassport(HttpServletRequest request) {
		UserDetailInfo userDetailInfo = Authority.getUserDetailInfo(request);
		List<ChinaArea> infoList = new ArrayList<ChinaArea>();
		infoList = mapper.getChinaAraList(new ChinaArea());
		DataPermission codePermission =null;
		for (DataPermission dataPermission : userDetailInfo.getDataPermissions()) {
			if(codeToken.equals(dataPermission.getDataPermissionToken())){
				codePermission = dataPermission;
			}
		}
		
		// 分权分域信息
		DataPermission dataPermission = new DataPermission();
		try {
			List<DataPermissionSetting> dataPermissionSettingList = new ArrayList<DataPermissionSetting>();
			DataPermissionSetting dataPermissionSetting = null;
			String urlPath = "";
			for(ChinaArea info:infoList){
				dataPermissionSetting = new DataPermissionSetting();
				for(DataPermissionSetting codeSetting:codePermission.getSettings()){
					if(codeSetting.getSettingKey().equals(info.getAreaCode())){
						dataPermissionSetting.setSettingId(codeSetting.getSettingId());
						break;
					}
				}
				dataPermissionSetting.setSettingKey(info.getAreaCode());
				dataPermissionSetting.setSettingValue(info.getAreaName());
				dataPermissionSetting.setDataPermissionId(codePermission.getDataPermissionId());
				
				dataPermissionSettingList.add(dataPermissionSetting);
			}
			
			dataPermission.setDataPermissionToken(codeToken);
			dataPermission.setAppId(Integer.parseInt(deployid));
			dataPermission.setAppName("");
			dataPermission.setDataPermissionDesc(codePermission.getDataPermissionDesc());
			dataPermission.setDataPermissionId(codePermission.getDataPermissionId());
			dataPermission.setDataPermissionName(codePermission.getDataPermissionName());
			dataPermission.setSettings(dataPermissionSettingList);
			JsonObject jsonObject = null;
			urlPath = updateUrl + "/" + Authority.getUserToken(request)+"/true";
			jsonObject = getPaassportHttpResult(urlPath, JSON.toJSONString(dataPermission));
			if(!"0".equals(jsonObject.get("resultCode").toString())){
				return false;
			}
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	@Override
	public boolean isExistChinaAreaName(ChinaArea dto) {
		return mapper.finChinaAreaCountByName(dto)>0?true:false;
	}
	
	

}
