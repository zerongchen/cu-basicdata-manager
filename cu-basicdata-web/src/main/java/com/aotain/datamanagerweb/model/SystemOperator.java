package com.aotain.datamanagerweb.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;

import com.aotain.cu.serviceapi.model.permission.DataPermissionSetting;

public class SystemOperator implements Serializable {

	private static final long serialVersionUID = 7539203008909919672L;

	// 用户ID
	private Integer userId;
	// 用户名
	private String userName;
	// 用户真实姓名
	private String fullName;
	// 密码
	private String password;
	// 描述
	private String userDescription;
	// 电子邮件
	private String email;
	// 手机号码
	private String mobile;
	// 状态:0-暂停；1-正常
	private Integer status;
	// 用户级别
	private Integer userLevel;
	// 用户账号携带的隶属码信息
	private List<String> areaList = new ArrayList<String>();
	//用户账号携带的隶属码信息，逗号分隔的
	private String areaCodes;
	// 用户账号携带的专线机标识信息
	private List<String> authIdentityList = new ArrayList<String>();
	// 用户账号携带的专线机标识信息，逗号分隔的
	private String authIdentities;
	// 用户账号携带的机房信息
	private List<String> authHouseList = new ArrayList<String>();
	// 用户账号携带的机房信息，逗号分隔的
	private String authHouses;
	//用户携带token信息
	private String userToken;
	//用户携带机房权限信息集合
	private List<DataPermissionSetting> homeSettingList;
	
	
	/**
	 * 机房的分权分域数据信息
	 */
	//分权分域数据ID
	private Integer dataPermissionId;
	//系统IP
    private Integer appId;
    //分权分域字段
    private String dataPermissionToken;
    //分权分域显示名称
    private String dataPermissionName;
    //分权分域显示备注
    private String dataPermissionDesc;

    private String permissionMethodUrl;
    
    private String dataPermissionUrl;
    
    private String sycnhPermissionUrl;
    
    
    
	public String getSycnhPermissionUrl() {
		return sycnhPermissionUrl;
	}

	public void setSycnhPermissionUrl(String sycnhPermissionUrl) {
		this.sycnhPermissionUrl = sycnhPermissionUrl;
	}

	public String getDataPermissionUrl() {
		return dataPermissionUrl;
	}

	public void setDataPermissionUrl(String dataPermissionUrl) {
		this.dataPermissionUrl = dataPermissionUrl;
	}

	public Integer getUserId() {
		return userId;
	}

	public String getUserName() {
		return userName;
	}

	public String getFullName() {
		return fullName;
	}

	public String getPassword() {
		return password;
	}

	public String getUserDescription() {
		return userDescription;
	}

	public String getEmail() {
		return email;
	}

	public String getMobile() {
		return mobile;
	}

	public Integer getStatus() {
		return status;
	}

	public Integer getUserLevel() {
		return userLevel;
	}

	public List<String> getAreaList() {
		return areaList;
	}

	public List<String> getAuthIdentityList() {
		return authIdentityList;
	}

	public List<String> getAuthHouseList() {
		return authHouseList;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setUserDescription(String userDescription) {
		this.userDescription = userDescription;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public void setUserLevel(Integer userLevel) {
		this.userLevel = userLevel;
	}

	public void setAreaList(List<String> list) {
		this.areaList = list;
	}

	public void setAuthIdentityList(List<String> authIdentityList) {
		this.authIdentityList = authIdentityList;
	}

	public void setAuthHouseList(List<String> authHouseList) {
		this.authHouseList = authHouseList;
	}

	public String getAreaCodes() {
		return areaCodes;
	}

	public String getAuthIdentities() {
		return authIdentities;
	}

	public String getAuthHouses() {
		return authHouses;
	}

	public void setAreaCodes(String areaCodes) {
		this.areaCodes = areaCodes;
	}

	public void setAuthIdentities(String authIdentities) {
		this.authIdentities = authIdentities;
	}

	public void setAuthHouses(String authHouses) {
		this.authHouses = authHouses;
	}

	public Integer getDataPermissionId() {
		return dataPermissionId;
	}

	public Integer getAppId() {
		return appId;
	}

	public String getDataPermissionToken() {
		return dataPermissionToken;
	}

	public String getDataPermissionName() {
		return dataPermissionName;
	}

	public String getDataPermissionDesc() {
		return dataPermissionDesc;
	}

	public void setDataPermissionId(Integer dataPermissionId) {
		this.dataPermissionId = dataPermissionId;
	}

	public void setAppId(Integer appId) {
		this.appId = appId;
	}

	public void setDataPermissionToken(String dataPermissionToken) {
		this.dataPermissionToken = dataPermissionToken;
	}

	public void setDataPermissionName(String dataPermissionName) {
		this.dataPermissionName = dataPermissionName;
	}

	public void setDataPermissionDesc(String dataPermissionDesc) {
		this.dataPermissionDesc = dataPermissionDesc;
	}

	public String getPermissionMethodUrl() {
		return permissionMethodUrl;
	}

	public void setPermissionMethodUrl(String permissionMethodUrl) {
		this.permissionMethodUrl = permissionMethodUrl;
	}

	public String getUserToken() {
		return userToken;
	}

	public void setUserToken(String userToken) {
		this.userToken = userToken;
	}

	public List<DataPermissionSetting> getHomeSettingList() {
		return homeSettingList;
	}

	public void setHomeSettingList(List<DataPermissionSetting> homeSettingList) {
		this.homeSettingList = homeSettingList;
	}
	
	
}
