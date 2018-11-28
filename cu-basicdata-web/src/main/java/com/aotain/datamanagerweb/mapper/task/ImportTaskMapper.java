package com.aotain.datamanagerweb.mapper.task;

import com.aotain.common.config.annotation.MyBatisDao;
import com.aotain.cu.serviceapi.model.ImportTaskModel;

import java.util.Map;

@MyBatisDao
public interface ImportTaskMapper {
    int insert( ImportTaskModel model);
    int update(ImportTaskModel model);
    ImportTaskModel selectByUserId( Map<String,Object> map);
    int isImporting(ImportTaskModel model);
}
