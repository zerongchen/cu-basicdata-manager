package com.aotain.datamanagerweb.mapper.system;

import com.aotain.common.config.annotation.MyBatisDao;
import com.aotain.cu.serviceapi.dto.SystemLoginLogDTO;
import com.aotain.datamanagerweb.model.DataLog;
import com.aotain.datamanagerweb.model.SystemActionLog;

@MyBatisDao
public interface SystemLogManageMapper {
	
	/**
	 * 
	 * 写入操作日志
	 */
	int insertActionLog(SystemActionLog po);

	/**
	 * 写数据日志
	 * @param po
	 */
	void insertDataLog(DataLog po);
	void insertLoginLog(SystemLoginLogDTO dto);
}
