package com.aotain.datamanagerweb.model;

import java.util.Date;

/**
 * 操作日志
 * @author yinzf 
 * @createtime 2014年11月8日 下午2:33:22
 */
public class SystemActionLog {
	
	private long actionLogId;	
	
	private Long userId;
	
	private String username; //用户名
	
	private String realname; //真实姓名	
	
	private String ipAddress; //用户IP	
	
	private String module; //操作模块
	
	private Integer actionType; //操作类型,@see SystemActionLogType
	
	private Date actionTime; //操作时间
	
	private String description; //描述 
	
	private String areaCode;//隶属单位
	
	/**
	 * CU v4.0
	 * 用户级别：1=root,2=省管理员,3=地市管理员
	 */
	private Integer userLevel;
	

	public Integer getUserLevel() {
		return userLevel;
	}

	public void setUserLevel(Integer userLevel) {
		this.userLevel = userLevel;
	}

	public long getActionLogId() {
		return actionLogId;
	}

	public Long getUserId() {
		return userId;
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

	public String getModule() {
		return module;
	}

	public Integer getActionType() {
		return actionType;
	}

	public Date getActionTime() {
		return actionTime;
	}

	public String getDescription() {
		return description;
	}

	public void setActionLogId(long actionLogId) {
		this.actionLogId = actionLogId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
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

	public void setModule(String module) {
		this.module = module;
	}

	public void setActionType(Integer actionType) {
		this.actionType = actionType;
	}

	public void setActionTime(Date actionTime) {
		this.actionTime = actionTime;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getAreaCode() {
		return areaCode;
	}

	public void setAreaCode(String areaCode) {
		this.areaCode = areaCode;
	}
	
}
