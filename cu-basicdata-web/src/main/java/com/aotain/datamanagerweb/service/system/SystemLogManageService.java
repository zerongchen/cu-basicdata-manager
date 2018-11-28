package com.aotain.datamanagerweb.service.system;

import com.aotain.cu.serviceapi.dto.SystemLoginLogDTO;
import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.login.pojo.UserDetailInfo;

public interface SystemLogManageService {

	void insertLoginLog(SystemLoginLogDTO dto);

	void log(Integer actionType,String description,String module,UserDetailInfo userDetailInfo);
	
	void log(int actionType,String description,Long userId,String username, String realname,String module, String ipAddress,Integer userLevel, String areaCode);

	void dataLog(SystemActionLogType actionType, String description, String username, String realname, String moduleName, String ipAddress, Long dataId, Long userId, Integer userLevel, String areaCode);

	void dataLog(SystemActionLogType actionType, String description, String username, String realname, String moduleName,
				 String ipAddress, Long dataId,Long userId, Integer userLevel,String areaCode,String dataJson);

	void dataLog(Object obj, String fieldName, SystemActionLogType actionType, String moduleName, Long dataId);

	void dataLog(String fieldName, SystemActionLogType actionType, String moduleName, String dataIds);

	void dataLog(String fieldName, SystemActionLogType actionType, String moduleName, Long[] dataIds);

	void dataLog(SystemActionLogType actionType, String moduleName, String description, String dataJson);

}