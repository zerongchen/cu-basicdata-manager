package com.aotain.datamanagerweb.mapper.export;


import com.aotain.common.config.annotation.MyBatisDao;
import com.aotain.cu.serviceapi.dto.UserInformationDTO;
import com.aotain.datamanagerweb.model.dataexport.UserInforExport;

import java.util.List;

/**
 * 上报用户数据查询，导出
 */
@MyBatisDao
public interface RptUserInfoExportMapper {
	List<UserInforExport> getExportData(UserInformationDTO dto);
}
