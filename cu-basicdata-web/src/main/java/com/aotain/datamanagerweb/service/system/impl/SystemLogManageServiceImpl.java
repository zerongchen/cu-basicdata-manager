package com.aotain.datamanagerweb.service.system.impl;

import java.util.Date;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.cu.serviceapi.dto.SystemLoginLogDTO;
import com.aotain.datamanagerweb.mapper.system.SystemLogManageMapper;
import com.aotain.datamanagerweb.model.DataLog;
import com.aotain.datamanagerweb.model.SystemActionLog;
import com.aotain.datamanagerweb.model.SystemOperator;
import com.aotain.datamanagerweb.service.system.SystemLogManageService;
import com.aotain.datamanagerweb.utils.SpringUtil;
import com.aotain.datamanagerweb.utils.WebContext;
import com.aotain.login.pojo.UserDetailInfo;

/**
 * 系统日志业务类
 */
@Service
public class SystemLogManageServiceImpl implements SystemLogManageService{

	private Logger log = LoggerFactory.getLogger(SystemLogManageServiceImpl.class);
	
	@Autowired
	private SystemLogManageMapper systemLogManageMapper;
	
	/**
	 * 增加登录日志
	 */
	@Override
	public void insertLoginLog(SystemLoginLogDTO dto) {
		try {
			systemLogManageMapper.insertLoginLog(dto);
		} catch (Throwable e) {
			log.warn("write login log exception : ", e);
		}
	}

	@Override
	public void log(Integer actionType, String description, String module, UserDetailInfo userDetailInfo) {
		try {
			Long userId = userDetailInfo.getUserId().longValue();
			Integer userLevel = userDetailInfo.getUserLevel();
			String username = userDetailInfo.getUserName();
			String realname = userDetailInfo.getFullName();
			String ipAddress = WebContext.getRequestIpAndPort();
			SystemOperator operator = SpringUtil.getSystemOperator();
			log(actionType, description, userId, username, realname, module, ipAddress, userLevel,
					StringUtils.join(operator.getAreaList(), ","));
		} catch (Throwable e) {
			log.warn("write system operator log exception : ", e);
		}
	}

	/**
	 * 添加系统操作日志
	 */
	@Override
	@Transactional
	public void log(int actionType, String description, Long userId, String username, String realname, String module, String ipAddress, Integer userLevel,String areaCode) {
		try {
			SystemActionLog systemActionLog = new SystemActionLog();
			systemActionLog.setUserId(userId);
			systemActionLog.setUsername(username);
			systemActionLog.setRealname(realname);
			systemActionLog.setActionTime(new Date());
			systemActionLog.setModule(module);
			systemActionLog.setIpAddress(ipAddress);
			systemActionLog.setActionType(actionType);
			systemActionLog.setDescription(description);
			systemActionLog.setUserLevel(userLevel);
			systemActionLog.setAreaCode(areaCode);
			systemLogManageMapper.insertActionLog(systemActionLog);
		} catch (Throwable e) {
			log.warn("write system operator log exception : ", e);
		}
	}


	/**
	 * 添加数据日志
	 */
	@Override
	public void dataLog(SystemActionLogType actionType, String description, String username, String realname, String moduleName, String ipAddress, Long dataId,Long userId, Integer userLevel,String areaCode) {
		try {
			DataLog dataLog = new DataLog();
			dataLog.setActionType(actionType.ordinal());
			dataLog.setDataId(dataId);
			dataLog.setIpAddress(ipAddress);
			dataLog.setUsername(username);
			dataLog.setRealname(realname);
			dataLog.setModuleName(moduleName);
			dataLog.setDescription(description);
			dataLog.setActionTime(new Date());
			dataLog.setUserId(userId);
			dataLog.setUserLevel(userLevel);
			dataLog.setAreaCode(areaCode);
			systemLogManageMapper.insertDataLog(dataLog);
		} catch (Throwable e) {
			log.warn("write system data log exception : ",e);
		}
	}

	/**
	 * 添加数据日志
	 */
	@Override
	public void dataLog(SystemActionLogType actionType, String description, String username, String realname, String moduleName,
						String ipAddress, Long dataId,Long userId, Integer userLevel,String areaCode,String dataJson) {
		try {
			DataLog dataLog = new DataLog();
			dataLog.setActionType(actionType.ordinal());
			dataLog.setDataId(dataId);
			dataLog.setIpAddress(ipAddress);
			dataLog.setUsername(username);
			dataLog.setRealname(realname);
			dataLog.setModuleName(moduleName);
			dataLog.setDescription(description);
			dataLog.setActionTime(new Date());
			dataLog.setUserId(userId);
			dataLog.setUserLevel(userLevel);
			dataLog.setAreaCode(areaCode);
			dataLog.setDataJson(dataJson);
			systemLogManageMapper.insertDataLog(dataLog);
		} catch (Throwable e) {
			log.warn("write system data log exception : ",e);
		}
	}

	/**
	 * 添加数据日志
	 */
	@Override
	public void dataLog(Object obj, String fieldName, SystemActionLogType actionType, String moduleName, Long dataId) {
		try {
			SystemOperator operator = SpringUtil.getSystemOperator();
			String username = operator.getUserName();
			String realname = operator.getUserName();
			Long userId = Long.valueOf(operator.getUserId());
			Integer userLevel = operator.getUserLevel();

			String ipAddress = WebContext.getRequestIpAndPort();
			String fieldValue = "";
			fieldValue = BeanUtils.getSimpleProperty(obj, fieldName);
			String description = actionType.getDescription() + "数据: [ " + fieldName + ":" + fieldValue + " ] ";

			dataLog(actionType, description, username, realname, moduleName, ipAddress, dataId, userId, userLevel,
					StringUtils.join(operator.getAreaList(), ","));
		} catch (Throwable e) {
			log.warn("write system data log exception : ", e);
		}
	}

	@Override
	public void dataLog(String fieldName, SystemActionLogType actionType, String moduleName, String dataIds) {
		try {
			SystemOperator operator = SpringUtil.getSystemOperator();
			String username = operator.getUserName();
			String realname = operator.getUserName();
			Long userId = Long.valueOf(operator.getUserId());
			Integer userLevel = operator.getUserLevel();

			String ipAddress = WebContext.getRequestIpAndPort();
			String[] dataIdsArr = dataIds.split(",");
			for (String dataId : dataIdsArr) {
				String description = actionType.getDescription() + "数据: [ " + fieldName + ":" + dataId + " ] ";
				dataLog(actionType, description, username, realname, moduleName, ipAddress, Long.parseLong(dataId),
						userId, userLevel, StringUtils.join(operator.getAreaList(), ","));
			}
		} catch (Throwable e) {
			log.warn("write system data log exception : ", e);
		}
	}

	@Override
	public void dataLog(String fieldName, SystemActionLogType actionType, String moduleName, Long[] dataIds) {
		SystemOperator operator = SpringUtil.getSystemOperator();
		String username = operator.getUserName();
		String realname = operator.getUserName();
		Long userId = Long.valueOf(operator.getUserId());
		Integer userLevel = operator.getUserLevel();

		String ipAddress = WebContext.getRequestIpAndPort();
		for (Long dataId : dataIds) {
			String description = actionType.getDescription() + "数据: [ " + fieldName + ":" + dataId + " ] ";
			dataLog(actionType, description, username, realname, moduleName, ipAddress, dataId, userId, userLevel, StringUtils.join(operator.getAreaList(), ","));
		}
	}

	/**
	 * 数据日志中增加dataJson
	 * @param actionType
	 * @param moduleName
	 * @param description
	 * @param dataJson
	 */
	public void dataLog(SystemActionLogType actionType, String moduleName, String description, String dataJson) {
		SystemOperator operator = SpringUtil.getSystemOperator();
		String username = operator.getUserName();
		String realname = operator.getUserName();
		Long userId = Long.valueOf(operator.getUserId());
		Integer userLevel = operator.getUserLevel();

		String ipAddress = WebContext.getRequestIpAndPort();
		dataLog(actionType, description, username, realname, moduleName, ipAddress, null, userId, userLevel, StringUtils.join(operator.getAreaList(), ","),dataJson);
	}

}