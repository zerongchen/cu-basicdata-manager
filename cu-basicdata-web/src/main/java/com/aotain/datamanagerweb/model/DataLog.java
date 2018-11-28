package com.aotain.datamanagerweb.model;

import java.io.Serializable;
import java.util.Date;

/**
 * 数据日志
 * @author yinzf 
 * @createtime 2015年4月1日 上午11:23:02
 */
public class DataLog implements Serializable {
	
	private static final long serialVersionUID = 6181206008273362971L;

	private long id;
	
	private String username; //用户名
	
	private String realname; //真实用户名
	
	private String ipAddress; //IP地址
	
	private String moduleName; //模块名称
	
	private Long dataId; //数据ID
	
	private Date actionTime; //操作时间
	
	private int actionType; //操作类型,@see SystemActionLogType
	
	private String description; //操作描述

	private String areaCode;//隶属单位

	private String dataJson; // 操作关键信息(id集合)
	
	/**
	 * CU v4.0
	 *用户Id
	 */
	private Long userId;
	/**
	 * CU v4.0
	 * 用户级别：1=root,2=省管理员,3=地市管理员
	 */
	private Integer userLevel;
	

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Integer getUserLevel() {
		return userLevel;
	}

	public void setUserLevel(Integer userLevel) {
		this.userLevel = userLevel;
	}

	public long getId() {
		return id;
	}

	public String getUsername() {
		return username;
	}

	public String getRealname() {
		return realname;
	}

	public String getIpAddress() {
		return ipAddress;
	}

	public String getModuleName() {
		return moduleName;
	}


	public Date getActionTime() {
		return actionTime;
	}

	public int getActionType() {
		return actionType;
	}

	public String getDescription() {
		return description;
	}

	public void setId(long id) {
		this.id = id;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setRealname(String realname) {
		this.realname = realname;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}


	public void setActionTime(Date actionTime) {
		this.actionTime = actionTime;
	}

	public void setActionType(int actionType) {
		this.actionType = actionType;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Long getDataId() {
		return dataId;
	}

	public void setDataId(Long dataId) {
		this.dataId = dataId;
	}

	public String getAreaCode() {
		return areaCode;
	}

	public void setAreaCode(String areaCode) {
		this.areaCode = areaCode;
	}

	public String getDataJson() {
		return dataJson;
	}

	public void setDataJson(String dataJson) {
		this.dataJson = dataJson;
	}
}
