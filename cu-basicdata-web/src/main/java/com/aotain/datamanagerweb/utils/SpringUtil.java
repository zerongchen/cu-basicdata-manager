package com.aotain.datamanagerweb.utils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.alibaba.fastjson.JSON;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.HouseInformation;
import com.aotain.datamanagerweb.constant.DataPermissionConstant;
import com.aotain.datamanagerweb.model.SystemOperator;
import com.aotain.login.pojo.DataPermission;
import com.aotain.login.pojo.DataPermissionSetting;
import com.aotain.login.pojo.UserDetailInfo;
import com.aotain.login.support.Authority;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.mysql.fabric.xmlrpc.base.Array;

@Component
public class SpringUtil implements ApplicationContextAware {

    /** logger */
    private static final Logger logger = LoggerFactory.getLogger(SpringUtil.class);

    private static ApplicationContext applicationContext;

    /**
     * 当前系统在权限系统的部署id
     */
    private static String appId;
    
    public static String permissionMethodUrl;
    
    private static String dataPermissionUrl;
    
    private static SystemOperator systemOperator;
    
    
    private static String sycnhPermissionUrl;
    
    
    
    
    public String getSycnhPermissionUrl() {
		return sycnhPermissionUrl;
	}


    @Value("${service.local.sycnhPermissionUrl}")
	public void setSycnhPermissionUrl(String sycnhPermissionUrl) {
		SpringUtil.sycnhPermissionUrl = sycnhPermissionUrl;
	}



	public String getAppId() {
		return appId;
	}

    
    
    public String getDataPermissionUrl() {
		return dataPermissionUrl;
	}

    @Value("${service.local.dataPermissionUrl}")
	public void setDataPermissionUrl(String dataPermissionUrl) {
		SpringUtil.dataPermissionUrl = dataPermissionUrl;
	}

	@Value("${service.local.deployid}")
	public void setAppId(String appId) {
		SpringUtil.appId = appId;
	}

	public String getPermissionMethodUrl() {
		return permissionMethodUrl;
	}
	
	@Value("${service.local.updateUrl}")
	public void setPermissionMethodUrl(String permissionMethodUrl) {
		SpringUtil.permissionMethodUrl = permissionMethodUrl;
	}

	@Override
    public void setApplicationContext( ApplicationContext applicationContext ) throws BeansException {
        SpringUtil.applicationContext = applicationContext;
    }

    //获取applicationContext
    public static ApplicationContext getApplicationContext() {
        return applicationContext;
    }

    //通过name获取 Bean.
    public static Object getBean(String name){
        return getApplicationContext().getBean(name);

    }

    //通过class获取Bean.
    public static <T> T getBean(Class<T> clazz){
        return getApplicationContext().getBean(clazz);
    }

    //通过name,以及Clazz返回指定的Bean
    public static <T> T getBean(String name,Class<T> clazz){
        return getApplicationContext().getBean(name, clazz);
    }

	public static String getSysUserName() {
		try {
			HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
			return Authority.getUserDetailInfo(request).getUserName();
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("get sysUserName error...", e);
		}
		// 返回一个默认值
		return "admin";
	}

	public static SystemOperator getSystemOperator() {
		SystemOperator operator = new SystemOperator();
		try {
			HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
			UserDetailInfo userInfo = Authority.getUserDetailInfo(request);
			DataPermission resultPermission = encapsulateAuthHouseDataPermission(userInfo);
			Map<String, List<String>> permissionMap = encapsulatePermissionMap(userInfo);
			HttpSession session = request.getSession(false);
			
			try {
				List<String> houseList = (List<String>) session.getAttribute(DataPermissionConstant.AUTH_HOUSE_LIST);
				if(houseList!=null&&houseList.size()>0){
					operator.setAuthHouseList(houseList);
				}else{
					operator.setAuthIdentityList(permissionMap.get(DataPermissionConstant.AUTH_HOUSE_LIST));
				}
			} catch (Exception e) {
				String[] houseArr =  session.getAttribute(DataPermissionConstant.AUTH_HOUSE_LIST).toString().split(",");
				if(houseArr!=null&&houseArr.length>0){
					operator.setAuthHouseList(Arrays.asList(houseArr));
				}else{
					operator.setAuthIdentityList(permissionMap.get(DataPermissionConstant.AUTH_HOUSE_LIST));
				}
			}
			
			operator.setUserId(userInfo.getUserId());
			operator.setUserName(userInfo.getUserName());
			operator.setUserLevel(userInfo.getUserLevel());
			operator.setAreaList(permissionMap.get(DataPermissionConstant.AUTH_CITY_CODE_LIST));
			operator.setAuthIdentityList(permissionMap.get(DataPermissionConstant.AUTH_IDENTITY_LIST));
			operator.setPermissionMethodUrl(SpringUtil.permissionMethodUrl);
			operator.setUserToken(Authority.getUserToken(request));
			operator.setDataPermissionUrl(SpringUtil.dataPermissionUrl);
			operator.setSycnhPermissionUrl(SpringUtil.sycnhPermissionUrl);
			//operator.setHomeSettingList(getAuthHomeSetting());
			if (resultPermission != null) {
				operator.setDataPermissionId(resultPermission.getDataPermissionId());
				operator.setAppId(resultPermission.getAppId());
				operator.setDataPermissionToken(resultPermission.getDataPermissionToken());
				operator.setDataPermissionName(resultPermission.getDataPermissionName());
				operator.setDataPermissionDesc(resultPermission.getDataPermissionDesc());
			}
		} catch (Exception e) {
			logger.error("get sysUserName error...", e);
		}
		return operator;
	}
	
	private static DataPermission encapsulateAuthHouseDataPermission(UserDetailInfo user) {
		if (user != null && !user.getDataPermissions().isEmpty()) {
			List<DataPermission> dataPermissions = user.getDataPermissions();
			for (DataPermission dataPermission : dataPermissions) {
				String key = dataPermission.getDataPermissionToken();
				if (DataPermissionConstant.AUTH_HOUSE_LIST.equals(key)) {
					if (dataPermission.getAppId() == null) {
						dataPermission.setAppId(Integer.parseInt(SpringUtil.appId));
					}
					return dataPermission;
				}
			}
		}
		return null;
	}

	private static Map<String, List<String>> encapsulatePermissionMap(UserDetailInfo user) {
		Map<String, List<String>> permissionMap = new HashMap<String, List<String>>();
		if (user != null) {
			List<DataPermission> dataPermissions = user.getDataPermissions();
			if (dataPermissions != null && dataPermissions.size() > 0) {
				for (DataPermission dataPermission : dataPermissions) {
					String key = dataPermission.getDataPermissionToken();
					List<DataPermissionSetting> dataPermissionSettings = dataPermission.getSettings();
					if (dataPermissionSettings != null && dataPermissionSettings.size() > 0) {
						List<String> valueList = new ArrayList<String>();
						for (DataPermissionSetting dataPermissionSetting : dataPermissionSettings) {
							String value = dataPermissionSetting.getSettingKey();
							valueList.add(value);
						}
						permissionMap.put(key, valueList);
					}
				}
			}
			
		}
		return permissionMap;
	}
	
//    /**
//     * 获取系统用户的用户名和区域ID
//     * @return
//     */
//    public static SystemUser getSysUser(){
//    	SystemUser sysUser = new SystemUser("admin","123456",(long)440000);
//        return sysUser;
//    }
//
//    /**
//     * 获取系统用户获取当前部署区域ID(流量流向区域ID和areaCode不一致，重点在于对应关系)
//     * @return
//     */
//    public static String getSysUserAreaId(){
//        return LocalConfig.getInstance().getHashValueByHashKey("system.deploy.province.iparea");
//    }
    
    /**
     * 获取用户账号携带地市信息
     * 
     */
    public static List<Long> getUserCodeList(HttpServletRequest  request){
    	List<Long> codeList = new ArrayList<Long>();
    	List<DataPermission> dataPermissions =Authority.getUserDetailInfo(request).getDataPermissions();
    	if(dataPermissions==null||dataPermissions.size()==0){
    		return codeList;
    	}
    	List<DataPermissionSetting> settings = new ArrayList<>();
    	for(DataPermission dataPermission:dataPermissions){
    		if("AUTHCITYCODELIST".equals(dataPermission.getDataPermissionToken())){
    			settings = dataPermission.getSettings();
    			for(DataPermissionSetting setting:settings){
    				try {
    					Long code = Long.parseLong(setting.getSettingKey());
    					if(code!=null){
    						codeList.add(code);
    					}
					} catch (NumberFormatException e) {
						logger.error("地市码信息转换错误");
					}
    			}
    		}
    	}
    	return codeList;
    }

	public static List<com.aotain.cu.serviceapi.model.permission.DataPermissionSetting> getSystemHouseDataPermissions(List<DataPermission> dataPermissions) {
		List<com.aotain.cu.serviceapi.model.permission.DataPermissionSetting> list = new ArrayList<>();
		if(dataPermissions==null||dataPermissions.size()<=0){
			return null;
		}
		com.aotain.cu.serviceapi.model.permission.DataPermissionSetting dto = null;
		for(DataPermission dataPermission:dataPermissions){
			if(DataPermissionConstant.AUTH_HOUSE_LIST.equals(dataPermission.getDataPermissionToken())){
				for(DataPermissionSetting setting:dataPermission.getSettings()){
					dto = new com.aotain.cu.serviceapi.model.permission.DataPermissionSetting();
					dto.setSettingId(setting.getSettingId());
					dto.setDataPermissionId(setting.getDataPermissionId());
					dto.setSettingKey(setting.getSettingKey());
					dto.setSettingValue(setting.getSettingValue());
					list.add(dto);
				}
			}
		}
		return list;
	}
	
	public static JsonObject getPaassportHttpResult(String path, String post) {
		URL url = null;
		try {
			url = new URL(path);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			// 发送POST请求必须设置如下两行
			conn.setDoOutput(true);
			conn.setDoInput(true);
			// 设置内容的类型,设置为经过urlEncoded编码过的from参数
            conn.setRequestProperty("Content-Type", "*/*");
			/*conn.setRequestProperty("Content-Type", "application/json");*/
			// 建立连接
            // (请求未开始,直到connection.getInputStream()方法调用时才发起,以上各个参数设置需在此方法之前进行)
            conn.connect();/*conn.getResponseCode()*/
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

	public static List<com.aotain.cu.serviceapi.model.permission.DataPermissionSetting> getAuthHomeSetting() {
		List<com.aotain.cu.serviceapi.model.permission.DataPermissionSetting> list = new ArrayList<>();
		com.aotain.cu.serviceapi.model.permission.DataPermissionSetting dto = null;
		String path = sycnhPermissionUrl + appId;
		JsonObject jsonObject = SpringUtil.getPaassportHttpResult(path, "");
		jsonObject.get("result");
		if (jsonObject != null && "1".equals(jsonObject.get("statuCode").toString())) {
			JsonArray jsonArray = jsonObject.getAsJsonArray("result");
			DataPermission dataPermission = null;
			for (JsonElement element : jsonArray) {
				dataPermission = JSON.parseObject(element.toString(), DataPermission.class);
				if (DataPermissionConstant.AUTH_HOUSE_LIST.equals(dataPermission.getDataPermissionToken())) {
					if (dataPermission.getSettings() != null && dataPermission.getSettings().size() > 0 ) {
						for (DataPermissionSetting setting : dataPermission.getSettings()) {
							dto = new com.aotain.cu.serviceapi.model.permission.DataPermissionSetting();
							dto.setSettingId(setting.getSettingId());
							dto.setDataPermissionId(setting.getDataPermissionId());
							dto.setSettingKey(setting.getSettingKey());
							dto.setSettingValue(setting.getSettingValue());
							list.add(dto);
						}
					}
				}
			}
		}
		return list;
	}

	public static void setSystemOperator(SystemOperator systemOperator) {
		SpringUtil.systemOperator = systemOperator;
	}

	
}
